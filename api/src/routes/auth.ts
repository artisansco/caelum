import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import * as jwt from "hono/jwt";
import { db } from "../db/drizzle";
import { staff_table } from "../db/schema";
import { config } from "../lib/config";
import { token_validator } from "../validators/auth";

const app = new Hono().basePath("/auth");

app.post("/token", token_validator, async (c) => {
	const { email, password } = c.req.valid("json");

	const user = await db.query.staff_table.findFirst({
		where: eq(staff_table.email, email),
		columns: { id: true, password: true, school_id: true },
	});

	if (!user || !bcrypt.compare(password, String(user?.password))) {
		return c.json(
			{ status: "fail", message: "invalid email or password", data: null },
			401,
		);
	}

	const token = await jwt.sign({ id: user.id }, config.JWT_SECRET);
	return c.json(
		{
			status: "success",
			message: "generated token successfully",
			data: { token },
			meta: {},
		},
		201,
	);
});

export default app;
