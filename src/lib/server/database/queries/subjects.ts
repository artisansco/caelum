import { desc, eq } from "drizzle-orm";
import { db } from "../drizzle";
import { subjects_table } from "../schema";

export async function get_subjects(school_id: string) {
	try {
		const subjects = await db.query.subjects_table.findMany({
			where: eq(subjects_table.school_id, school_id),
			orderBy: desc(subjects_table.created_at),
		});

		return { success: true, data: subjects };
	} catch (_e) {
		console.error("Error getting subjects:", _e);
		return { success: false, message: "Failed to get subjects" };
	}
}

export async function get_subject(subject_id: string) {
	try {
		const subject = await db.query.subjects_table.findFirst({
			where: eq(subjects_table.id, subject_id),
		});

		return { success: true, data: subject };
	} catch (_e) {
		console.error("Error getting subject:", _e);
		return { success: false, message: "Failed to get subject" };
	}
}

export async function create_subject(data: typeof subjects_table.$inferInsert) {
	try {
		const [subject] = await db.insert(subjects_table).values(data).returning();

		return { success: true, data: subject };
	} catch (_e) {
		console.error("Error creating subject:", _e);
		return { success: false, message: "Failed to create subject" };
	}
}

export async function update_subject(
	subject_id: string,
	data: Partial<typeof subjects_table.$inferInsert>,
) {
	try {
		const [subject] = await db
			.update(subjects_table)
			.set(data)
			.where(eq(subjects_table.id, subject_id))
			.returning();

		return { success: true, data: subject };
	} catch (_e) {
		console.error("Error updating subject:", _e);
		return { success: false, message: "Failed to update subject" };
	}
}

export async function delete_subject(subject_id: string) {
	try {
		await db.delete(subjects_table).where(eq(subjects_table.id, subject_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting subject:", _e);
		return { success: false, message: "Failed to delete subject" };
	}
}
