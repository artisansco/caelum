import { Hono } from "hono";
import { nanoid } from "nanoid";
import { db } from "../db/drizzle";
import { staff_table } from "../db/schema";

const app = new Hono().basePath("/staff");

app.post("/", async (c) => {
	const { email, password } = await c.req.json();

	const [staff] = await db
		.insert(staff_table)
		.values({
			staff_id: nanoid(),
			first_name: "School",
			last_name: "Admin",
			email,
			password,
			school_id: "",
		})
		.returning();

	return c.json(
		{
			status: "success",
			message: "Staff created successfully",
			data: staff,
		},
		201,
	);
});

export default app;
