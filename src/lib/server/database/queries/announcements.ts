import { desc, eq } from "drizzle-orm";
import { db } from "../drizzle";
import { announcements_table } from "../schema";

export async function get_announcements(school_id: string) {
	try {
		const announcements = await db
			.select()
			.from(announcements_table)
			.where(eq(announcements_table.school_id, school_id))
			.orderBy(desc(announcements_table.created_at));

		return { success: true, data: announcements };
	} catch (_e) {
		console.error("Error getting announcements:", _e);
		return { success: false, message: "Failed to get announcements" };
	}
}

export async function get_announcement(announcement_id: string) {
	try {
		const announcement = await db.query.announcements_table.findFirst({
			where: eq(announcements_table.id, announcement_id),
		});

		return { success: true, data: announcement };
	} catch (_e) {
		console.error("Error getting announcement:", _e);
		return { success: false, message: "Failed to get announcement" };
	}
}

export async function create_announcement(
	data: typeof announcements_table.$inferInsert,
) {
	try {
		const [announcement] = await db
			.insert(announcements_table)
			.values(data)
			.returning();

		return { success: true, data: announcement };
	} catch (_e) {
		console.error("Error creating announcement:", _e);
		return { success: false, message: "Failed to create announcement" };
	}
}

export async function update_announcement(
	announcement_id: string,
	data: Partial<typeof announcements_table.$inferInsert>,
) {
	try {
		const [announcement] = await db
			.update(announcements_table)
			.set(data)
			.where(eq(announcements_table.id, announcement_id))
			.returning();

		return { success: true, data: announcement };
	} catch (_e) {
		console.error("Error updating announcement:", _e);
		return { success: false, message: "Failed to update announcement" };
	}
}

export async function delete_announcement(announcement_id: string) {
	try {
		await db
			.delete(announcements_table)
			.where(eq(announcements_table.id, announcement_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting announcement:", _e);
		return { success: false, message: "Failed to delete announcement" };
	}
}
