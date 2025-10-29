import { eq, and, between, sql } from "drizzle-orm";
import { db } from "../drizzle";
import {
	attendance_table,
	students_table,
	staff_table,
	classes_table,
} from "../schema";

export async function mark_attendance(
	data: typeof attendance_table.$inferInsert,
) {
	try {
		const [attendance] = await db
			.insert(attendance_table)
			.values(data)
			.returning();

		return { success: true, data: attendance };
	} catch (_e) {
		console.error("Error marking attendance:", _e);
		return { success: false, message: "Failed to mark attendance" };
	}
}

export async function get_attendance_by_date(school_id: string, date: string) {
	try {
		const attendance = await db
			.select({
				id: attendance_table.id,
				date: attendance_table.date,
				status: attendance_table.status,
				notes: attendance_table.notes,
				student_id: attendance_table.student_id,
				student_name: students_table.first_name,
				student_last_name: students_table.last_name,
				student_admission: students_table.admission_number,
				class_name: classes_table.name,
				marked_by_name: staff_table.first_name,
			})
			.from(attendance_table)
			.leftJoin(students_table, eq(attendance_table.student_id, students_table.id))
			.leftJoin(classes_table, eq(students_table.class_id, classes_table.id))
			.leftJoin(staff_table, eq(attendance_table.marked_by, staff_table.id))
			.where(
				and(
					eq(attendance_table.school_id, school_id),
					eq(attendance_table.date, date),
				),
			);

		return { success: true, data: attendance };
	} catch (_e) {
		console.error("Error getting attendance:", _e);
		return { success: false, message: "Failed to get attendance" };
	}
}

export async function get_student_attendance(
	student_id: string,
	start_date?: string,
	end_date?: string,
) {
	try {
		const conditions = [eq(attendance_table.student_id, student_id)];

		if (start_date && end_date) {
			conditions.push(between(attendance_table.date, start_date, end_date));
		}

		const attendance = await db.query.attendance_table.findMany({
			where: and(...conditions),
			orderBy: (attendance, { desc }) => [desc(attendance.date)],
		});

		return { success: true, data: attendance };
	} catch (_e) {
		console.error("Error getting student attendance:", _e);
		return { success: false, message: "Failed to get student attendance" };
	}
}

export async function get_class_attendance(
	class_id: string,
	date: string,
	school_id: string,
) {
	try {
		const attendance = await db
			.select({
				id: attendance_table.id,
				date: attendance_table.date,
				status: attendance_table.status,
				notes: attendance_table.notes,
				student_id: students_table.id,
				student_name: students_table.first_name,
				student_last_name: students_table.last_name,
				student_admission: students_table.admission_number,
			})
			.from(students_table)
			.leftJoin(
				attendance_table,
				and(
					eq(students_table.id, attendance_table.student_id),
					eq(attendance_table.date, date),
				),
			)
			.where(
				and(
					eq(students_table.class_id, class_id),
					eq(students_table.school_id, school_id),
				),
			);

		return { success: true, data: attendance };
	} catch (_e) {
		console.error("Error getting class attendance:", _e);
		return { success: false, message: "Failed to get class attendance" };
	}
}

export async function get_attendance_statistics(
	school_id: string,
	start_date: string,
	end_date: string,
) {
	try {
		const stats = await db
			.select({
				status: attendance_table.status,
				count: sql<number>`cast(count(*) as integer)`,
			})
			.from(attendance_table)
			.where(
				and(
					eq(attendance_table.school_id, school_id),
					between(attendance_table.date, start_date, end_date),
				),
			)
			.groupBy(attendance_table.status);

		return { success: true, data: stats };
	} catch (_e) {
		console.error("Error getting attendance statistics:", _e);
		return {
			success: false,
			message: "Failed to get attendance statistics",
		};
	}
}

export async function update_attendance(
	attendance_id: string,
	data: Partial<typeof attendance_table.$inferInsert>,
) {
	try {
		const [attendance] = await db
			.update(attendance_table)
			.set(data)
			.where(eq(attendance_table.id, attendance_id))
			.returning();

		return { success: true, data: attendance };
	} catch (_e) {
		console.error("Error updating attendance:", _e);
		return { success: false, message: "Failed to update attendance" };
	}
}

export async function delete_attendance(attendance_id: string) {
	try {
		await db
			.delete(attendance_table)
			.where(eq(attendance_table.id, attendance_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting attendance:", _e);
		return { success: false, message: "Failed to delete attendance" };
	}
}

export async function get_student_absence_count(
	student_id: string,
	start_date: string,
	end_date: string,
) {
	try {
		const result = await db
			.select({
				count: sql<number>`cast(count(*) as integer)`,
			})
			.from(attendance_table)
			.where(
				and(
					eq(attendance_table.student_id, student_id),
					eq(attendance_table.status, "absent"),
					between(attendance_table.date, start_date, end_date),
				),
			);

		return { success: true, data: result[0]?.count || 0 };
	} catch (_e) {
		console.error("Error getting absence count:", _e);
		return { success: false, message: "Failed to get absence count" };
	}
}
