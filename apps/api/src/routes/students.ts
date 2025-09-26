import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/drizzle";
import { students_table } from "../db/schema";
import { check_jwt } from "../middlewares/auth";

const app = new Hono().basePath("/students");

app.get("/", check_jwt, async (c) => {
	const students = await db.query.students_table.findMany({
		orderBy: desc(students_table.admission_date),
	});

	const payload = c.get("jwtPayload");

	return c.json({
		status: "success",
		message: "students fetched successfully",
		data: { students },
		meta: {},
	});
});

app.get("/:id", async (c) => {
	const student = await db.query.students_table.findFirst({
		where: eq(students_table.id, c.req.param("id")),
	});

	return c.json({
		status: "success",
		message: "student fetched successfully",
		data: student,
	});
});

app.post("/", async (c) => {
	const body = await c.req.json();

	const [student] = await db.insert(students_table).values(body).returning();

	return c.json(
		{
			status: "success",
			message: "User created successfully",
			data: student,
			meta: {},
		},
		201,
	);
});

app.delete("/:id", async (c) => {
	await db
		.delete(students_table)
		.where(eq(students_table.id, c.req.param("id")));

	return c.json({
		status: "success",
		message: "User deleted successfully",
		data: null,
		meta: {},
	});
});

app.put("/:id", async (c) => {
	const body = await c.req.json();

	const [student] = await db
		.update(students_table)
		.set(body)
		.where(eq(students_table.id, c.req.param("id")))
		.returning();

	return c.json({
		status: "success",
		message: "User updated successfully",
		data: student,
		meta: {},
	});
});

export default app;
