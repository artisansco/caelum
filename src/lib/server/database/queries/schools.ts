import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "../drizzle";
import {
	plans_table,
	schools_table,
	staff_table,
	subscriptions_table,
} from "../schema";

export async function get_school(school_id: string) {
	try {
		const [school] = await db
			.select({
				...getTableColumns(schools_table),
				current_plan: {
					id: plans_table.id,
					name: plans_table.name,
					end_date: subscriptions_table.end_date,
				},
			})
			.from(schools_table)
			.leftJoin(
				subscriptions_table,
				eq(subscriptions_table.school_id, schools_table.id),
			)
			.leftJoin(plans_table, eq(plans_table.id, subscriptions_table.plan_id))
			.orderBy(desc(subscriptions_table.created_at))
			.where(eq(schools_table.id, school_id))
			.limit(1);

		return { success: true, data: school };
	} catch (_e) {
		console.error("Error getting school:", _e);
		return {
			success: false,
			message: "Failed to get school",
		};
	}
}

export async function create_school(data: typeof schools_table.$inferInsert) {
	try {
		const [school] = await db.insert(schools_table).values(data).returning();

		return { success: true, data: school };
	} catch (_e) {
		console.error("Error creating school:", _e);
		return { success: false, message: "Failed to create school" };
	}
}

export async function update_school(
	school_id: string,
	data: Partial<typeof schools_table.$inferInsert>,
) {
	try {
		const [school] = await db
			.update(schools_table)
			.set(data)
			.where(eq(schools_table.id, school_id))
			.returning();

		return { success: true, data: school };
	} catch (_e) {
		console.error("Error updating school:", _e);
		return { success: false, message: "Failed to update school" };
	}
}

export async function delete_school(school_id: string) {
	try {
		await db.delete(schools_table).where(eq(schools_table.id, school_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting school:", _e);
		return { success: false, message: "Failed to delete school" };
	}
}

export async function register_school(data: {
	name: string;
	address?: string;
	city?: string;
	email: string;
	password: string;
}) {
	try {
		const [school] = await db
			.insert(schools_table)
			.values({
				name: data.name,
				address: data.address,
				city: data.city as (typeof schools_table.$inferInsert)["city"],
				logo_url: `https://placehold.co/100?text=${data.name[0]}`,
			})
			.returning({ id: schools_table.id });

		await db.insert(staff_table).values({
			staff_id: crypto.randomUUID(),
			first_name: "School",
			last_name: "Admin",
			role: "admin",
			address: data.address || "",
			contact: "",
			email: data.email || "",
			password: data.password,
			school_id: school.id,
			employed_date: new Date().toISOString(),
		});

		return { success: true, data: school };
	} catch (_e) {
		console.error("Error registering school:", _e);
		return { success: false, message: "Failed to register school" };
	}
}
