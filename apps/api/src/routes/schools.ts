import { Hono } from "hono";
import { nanoid } from "nanoid";
import { db } from "../db/drizzle";
import { schools_table, staff_table } from "../db/schema";
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

export default app;
