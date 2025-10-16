import { and, desc, eq } from "drizzle-orm";
import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { guard_route } from "$lib/auth";
import {
	classes_table,
	db,
	grades_table,
	staff_table,
	students_table,
	subjects_table,
} from "$lib/db";
import { grade_schema } from "$lib/schemas";

export const get_grades = query(async () => {
	guard_route();
	const { locals } = getRequestEvent();

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
		.where(eq(grades_table.school_id, locals.school_id))
		.orderBy(desc(grades_table.created_at))
		.limit(10);

	return grades;
});

export const add_grade = form(grade_schema, async (parsed) => {
	const { locals } = getRequestEvent();

	try {
		await db
			.insert(grades_table)
			.values({ ...parsed, school_id: locals.school_id });

		await get_grades().refresh();
	} catch (_e) {
		console.error("Error adding grade:", _e);
		return { message: _e?.message || "Failed to add grade" };
	}
});

export const delete_grade = command(v.string(), async (grade_id) => {
	try {
		const { params } = getRequestEvent();
		const school_id = params.school_id as string;

		await db
			.delete(grades_table)
			.where(
				and(
					eq(grades_table.id, grade_id),
					eq(grades_table.school_id, school_id),
				),
			);

		return { success: true };
	} catch (error: unknown) {
		console.error("Error deleting grade:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Failed to delete grade";
		throw new Error(errorMessage);
	}
});
