import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/drizzle";
import { subjects_table } from "../db/schema";

const app = new Hono().basePath("/subjects");

app.get("/", async (c) => {
	const subjects = await db.query.subjects_table.findMany();

	return c.json({
		status: "success",
		message: "subjects fetched successfully",
		data: { subjects },
	});
});

app.post("/", async (c) => {
	const { name, code } = await c.req.json();

	const subject = await db.insert(subjects_table).values({ name, code });

	return c.json(
		{
			status: "success",
			message: "subject created successfully",
			data: subject,
		},
		201,
	);
});

app.delete("/:id", async (c) => {
	await db
		.delete(subjects_table)
		.where(eq(subjects_table.id, c.req.param("id")));

	return c.json({
		status: "success",
		message: "subject deleted successfully",
		data: null,
		meta: {},
	});
});

export default app;
