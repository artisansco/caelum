import { Hono } from "hono";
import { db } from "../db/drizzle";
import { staff_table } from "../db/schema";
import { validate_new_staff } from "../validators/staff";

const app = new Hono().basePath("/staff");

app.post("/", validate_new_staff, async (c) => {
	const body = c.req.valid("json");

	const [staff] = await db
		.insert(staff_table)
		.values({
			staff_id: body.staff_id,
			first_name: body.first_name,
			middle_name: body.middle_name,
			last_name: body.last_name,
			email: body.email,
			employed_date: body.employed_on,
			role: body.role,
			permissions: body.permissions,
			password: body.password,
			school_id: body.school_id,
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
