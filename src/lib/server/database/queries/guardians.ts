import { eq, and } from "drizzle-orm";
import { db } from "../drizzle";
import { guardians_table, students_table } from "../schema";

export async function get_guardians_by_student(student_id: string) {
	try {
		const guardians = await db.query.guardians_table.findMany({
			where: eq(guardians_table.student_id, student_id),
		});

		return { success: true, data: guardians };
	} catch (_e) {
		console.error("Error getting guardians:", _e);
		return { success: false, message: "Failed to get guardians" };
	}
}

export async function get_guardian(guardian_id: string) {
	try {
		const guardian = await db.query.guardians_table.findFirst({
			where: eq(guardians_table.id, guardian_id),
		});

		return { success: true, data: guardian };
	} catch (_e) {
		console.error("Error getting guardian:", _e);
		return { success: false, message: "Failed to get guardian" };
	}
}

export async function get_guardians_by_school(school_id: string) {
	try {
		const guardians = await db
			.select({
				id: guardians_table.id,
				first_name: guardians_table.first_name,
				last_name: guardians_table.last_name,
				email: guardians_table.email,
				phone_number: guardians_table.phone_number,
				relationship: guardians_table.relationship,
				is_primary_contact: guardians_table.is_primary_contact,
				student_id: guardians_table.student_id,
				student_name: students_table.first_name,
				student_last_name: students_table.last_name,
				student_admission: students_table.admission_number,
			})
			.from(guardians_table)
			.leftJoin(students_table, eq(guardians_table.student_id, students_table.id))
			.where(eq(guardians_table.school_id, school_id));

		return { success: true, data: guardians };
	} catch (_e) {
		console.error("Error getting school guardians:", _e);
		return { success: false, message: "Failed to get guardians" };
	}
}

export async function create_guardian(
	data: typeof guardians_table.$inferInsert,
) {
	try {
		const [guardian] = await db
			.insert(guardians_table)
			.values(data)
			.returning();

		return { success: true, data: guardian };
	} catch (_e) {
		console.error("Error creating guardian:", _e);
		return { success: false, message: "Failed to create guardian" };
	}
}

export async function update_guardian(
	guardian_id: string,
	data: Partial<typeof guardians_table.$inferInsert>,
) {
	try {
		const [guardian] = await db
			.update(guardians_table)
			.set(data)
			.where(eq(guardians_table.id, guardian_id))
			.returning();

		return { success: true, data: guardian };
	} catch (_e) {
		console.error("Error updating guardian:", _e);
		return { success: false, message: "Failed to update guardian" };
	}
}

export async function delete_guardian(guardian_id: string) {
	try {
		await db.delete(guardians_table).where(eq(guardians_table.id, guardian_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting guardian:", _e);
		return { success: false, message: "Failed to delete guardian" };
	}
}

export async function get_primary_guardian(student_id: string) {
	try {
		const guardian = await db.query.guardians_table.findFirst({
			where: and(
				eq(guardians_table.student_id, student_id),
				eq(guardians_table.is_primary_contact, true),
			),
		});

		return { success: true, data: guardian };
	} catch (_e) {
		console.error("Error getting primary guardian:", _e);
		return { success: false, message: "Failed to get primary guardian" };
	}
}

export async function get_emergency_contacts(student_id: string) {
	try {
		const contacts = await db.query.guardians_table.findMany({
			where: and(
				eq(guardians_table.student_id, student_id),
				eq(guardians_table.is_emergency_contact, true),
			),
		});

		return { success: true, data: contacts };
	} catch (_e) {
		console.error("Error getting emergency contacts:", _e);
		return { success: false, message: "Failed to get emergency contacts" };
	}
}
