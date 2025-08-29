import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/drizzle";
import { students_table } from "../db/schema";

const app = new Hono().basePath("/users");

app.get("/", async (c) => {
	const students = await db.query.students_table.findMany();

	return c.json({
		status: "success",
		message: "students fetched successfully",
		data: { students },
		meta: {},
	});
});

app.post("/", async (c) => {
	const body = await c.req.json();

	const user = await db.insert(students_table).values(body);

	return c.json(
		{
			status: "success",
			message: "User created successfully",
			data: user,
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

	const user = await db
		.update(students_table)
		.set(body)
		.where(eq(students_table.id, c.req.param("id")));

	return c.json({
		status: "success",
		message: "User updated successfully",
		data: user,
		meta: {},
	});
});

export default app;
