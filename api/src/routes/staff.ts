import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/drizzle";
import { staff_table } from "../db/schema";
import { check_jwt } from "../middlewares/auth";
import { validate_new_staff, validate_update_staff } from "../validators/staff";

const app = new Hono().basePath("/staff");

app.get("/", async (c) => {
	const limit = Number(c.req.query("limit")) || 10;

	const staff = await db.query.staff_table.findMany({
		limit: limit,
		orderBy: desc(staff_table.created_at),
	});

	return c.json({
		status: "success",
		message: "All staff fetched successfully",
		data: { staff },
		meta: {
			total: staff.length,
			page: 1,
			limit: limit,
		},
	});
});

app.get("/:id", async (c) => {
	try {
		const staff = await db.query.staff_table.findFirst({
			where: eq(staff_table.id, c.req.param("id")),
		});

		return c.json({
			status: "success",
			message: "Staff fetched successfully",
			data: {
				...staff,
				permissions: staff?.permissions?.split(",") || [],
			},
		});
	} catch (_e) {
		return c.json(
			{
				status: "error",
				message: _e.message,
			},
			500,
		);
	}
});

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
			contact: body.phone_number,
			address: body.address,
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

app.put("/:id", check_jwt, validate_update_staff, async (c) => {
	const body = c.req.valid("json");

	const [staff] = await db
		.update(staff_table)
		.set({
			first_name: body.first_name,
			middle_name: body.middle_name,
			last_name: body.last_name,
			email: body.email,
			role: body.role,
			permissions: body.permissions,
			password: body.password,
		})
		.where(eq(staff_table.id, body.staff_id))
		.returning();

	return c.json({
		status: "success",
		message: "Staff updated successfully",
		data: staff,
	});
});

app.delete("/:id", check_jwt, async (c) => {
	await db
		.delete(staff_table)
		.where(eq(staff_table.id, c.req.param("id")))
		.returning();

	return c.json({
		status: "success",
		message: "Staff updated successfully",
	});
});

export default app;
