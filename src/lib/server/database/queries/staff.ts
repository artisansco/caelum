import { desc, eq } from "drizzle-orm";
import { db } from "../drizzle";
import { staff_table } from "../schema";

export async function get_all_staff(
	school_id: string,
	opts: { limit?: number },
) {
	try {
		const staff = await db.query.staff_table.findMany({
			where: eq(staff_table.school_id, school_id),
			orderBy: desc(staff_table.created_at),
			limit: opts.limit || 10,
		});

		return { success: true, data: staff };
	} catch (_e) {
		console.error("Error getting staff:", _e);
		return { success: false, message: "Failed to get staff" };
	}
}

export async function get_staff(staff_id: string) {
	try {
		const staff = await db.query.staff_table.findFirst({
			where: eq(staff_table.id, staff_id),
		});

		return { success: true, data: staff };
	} catch (_e) {
		console.error("Error getting staff:", _e);
		return { success: false, message: "Failed to get staff" };
	}
}

export async function get_staff_by_email(email: string) {
	try {
		const staff = await db.query.staff_table.findFirst({
			where: eq(staff_table.email, email),
		});

		if (!staff) {
			return { success: false, message: "no staff with that email found" };
		}

		return { success: true, data: staff };
	} catch (_e) {
		console.error("Error getting staff by email:", _e);
		return { success: false, message: "Failed to get staff by email" };
	}
}

export async function create_staff(data: typeof staff_table.$inferInsert) {
	try {
		const [staff] = await db.insert(staff_table).values(data).returning();

		return { success: true, data: staff };
	} catch (_e) {
		console.error("Error creating staff:", _e);
		return { success: false, message: "Failed to create staff" };
	}
}

export async function update_staff(
	staff_id: string,
	data: Partial<typeof staff_table.$inferInsert>,
) {
	try {
		const [staff] = await db
			.update(staff_table)
			.set(data)
			.where(eq(staff_table.id, staff_id))
			.returning();

		return { success: true, data: staff };
	} catch (_e) {
		console.error("Error updating staff:", _e);
		return { success: false, message: "Failed to update staff" };
	}
}

export async function delete_staff(staff_id: string) {
	try {
		await db.delete(staff_table).where(eq(staff_table.id, staff_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting staff:", _e);
		return { success: false, message: "Failed to delete staff" };
	}
}
