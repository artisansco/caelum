import { desc } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { db } from "../db/drizzle";
import { assignments_table, schools_table, staff_table } from "../db/schema";
import { validate_onboarding } from "../validators/schools";

const app = new Hono().basePath("/schools");

app.post("/", validate_onboarding, async (c) => {
	const body = c.req.valid("json");

	try {
		const [school] = await db
			.insert(schools_table)
			.values({
				name: body.name,
				address: body.address,
				city: body.city,
				logo_url: `https://placehold.co/100?text=${body.name[0]}`,
			})
			.returning({ id: schools_table.id });

		await db.insert(staff_table).values({
			staff_id: nanoid(),
			first_name: "School",
			last_name: "Admin",
			role: "admin",
			email: body.email,
			password: body.password,
			school_id: school.id,
			employed_date: new Date().toISOString(),
		});

		return c.json(
			{
				status: "success",
				message: "school created successfully",
				data: school,
			},
			201,
		);
	} catch (_e) {
		console.log(_e);
		// @ts-expect-error
		return c.json({ status: "error", message: _e.message });
	}
});

// route to submit assignment for the school
app.get("/:school_id/assignments", async (c) => {
	try {
		const assignments = await db.query.assignments_table.findMany({
			orderBy: desc(assignments_table.created_at),
		});
		console.log({ assignments });

		return c.json(
			{
				status: "success",
				message: "assignment created successfully",
				data: { assignments },
			},
			201,
		);
	} catch (_e) {
		console.log(_e);
		// @ts-expect-error
		return c.json({ status: "error", message: _e.message });
	}
});

// route to submit assignment for the school
app.post("/:school_id/assignments", async (c) => {
	const body = await c.req.json();

	try {
		const [assignment] = await db
			.insert(assignments_table)
			.values({
				title: body.title,
				description: body.description,
				due_date: body.due_date,
				file_name: "", // TODO: upload file later
				class_id: body.class_id,
				school_id: c.req.param("school_id"),
			})
			.returning({ id: assignments_table.id });

		console.log({ assignment });

		return c.json(
			{
				status: "success",
				message: "assignment created successfully",
				data: assignment,
			},
			201,
		);
	} catch (_e) {
		console.log(_e);
		// @ts-expect-error
		return c.json({ status: "error", message: _e.message });
	}
});

export default app;
