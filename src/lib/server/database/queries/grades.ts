import { desc, eq } from "drizzle-orm";
import { db } from "../drizzle";
import {
	classes_table,
	grades_table,
	staff_table,
	students_table,
	subjects_table,
} from "../schema";

export async function get_grades(school_id: string, limit?: number) {
	try {
		const grades = await db
			.select({
				id: grades_table.id,
				grade_type: grades_table.grade_type,
				max_score: grades_table.max_score,
				actual_score: grades_table.actual_score,
				term: grades_table.term,
				academic_year: grades_table.academic_year,
				notes: grades_table.notes,
				created_at: grades_table.created_at,
				student_name: students_table.first_name,
				student_last_name: students_table.last_name,
				student_admission_number: students_table.admission_number,
				subject_name: subjects_table.name,
				subject_code: subjects_table.code,
				grader_name: staff_table.first_name,
				grader_last_name: staff_table.last_name,
				class_name: classes_table.name,
			})
			.from(grades_table)
			.leftJoin(students_table, eq(grades_table.student_id, students_table.id))
			.leftJoin(subjects_table, eq(grades_table.subject_id, subjects_table.id))
			.leftJoin(staff_table, eq(grades_table.graded_by, staff_table.id))
			.leftJoin(classes_table, eq(students_table.class_id, classes_table.id))
			.where(eq(grades_table.school_id, school_id))
			.orderBy(desc(grades_table.created_at))
			.limit(limit || 10);

		return { success: true, data: grades };
	} catch (_e) {
		console.error("Error getting grades:", _e);
		return { success: false, message: "Failed to get grades" };
	}
}

export async function get_grade(grade_id: string) {
	try {
		const grade = await db.query.grades_table.findFirst({
			where: eq(grades_table.id, grade_id),
		});

		return { success: true, data: grade };
	} catch (_e) {
		console.error("Error getting grade:", _e);
		return { success: false, message: "Failed to get grade" };
	}
}

export async function create_grade(data: typeof grades_table.$inferInsert) {
	try {
		const [grade] = await db.insert(grades_table).values(data).returning();

		return { success: true, data: grade };
	} catch (_e) {
		console.error("Error creating grade:", _e);
		return { success: false, message: "Failed to create grade" };
	}
}

export async function update_grade(
	grade_id: string,
	data: Partial<typeof grades_table.$inferInsert>,
) {
	try {
		const [grade] = await db
			.update(grades_table)
			.set(data)
			.where(eq(grades_table.id, grade_id))
			.returning();

		return { success: true, data: grade };
	} catch (_e) {
		console.error("Error updating grade:", _e);
		return { success: false, message: "Failed to update grade" };
	}
}

export async function delete_grade(grade_id: string) {
	try {
		await db.delete(grades_table).where(eq(grades_table.id, grade_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting grade:", _e);
		return { success: false, message: "Failed to delete grade" };
	}
}
