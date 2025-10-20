import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { grade_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const get_grades_query = query(async () => {
	const { locals } = getRequestEvent();

	const { success, data, message } = await database.get_grades(
		locals.school_id,
		10,
	);

	if (!success) {
		console.error(message);
		return [];
	}

	return data || [];
});

export const add_grade = form(grade_schema, async (parsed) => {
	const { locals } = getRequestEvent();

	const { success, message } = await database.create_grade({
		student_id: parsed.student_id,
		subject_id: parsed.subject_id,
		grade_type: parsed.grade_type,
		max_score: parsed.max_score,
		actual_score: parsed.actual_score,
		graded_by: parsed.graded_by,
		term: parsed.term,
		academic_year: parsed.academic_year,
		notes: parsed.notes,
		school_id: locals.school_id,
	});

	if (!success) {
		return { message: message || "Failed to add grade" };
	}

	await get_grades_query().refresh();
});

export const delete_grade_command = command(v.string(), async (grade_id) => {
	const { params } = getRequestEvent();
	const _school_id = params.school_id as string;

	const { success, message } = await database.delete_grade(grade_id);

	if (!success) {
		return { message: message || "Failed to delete grade" };
	}

	return { success: true };
});

// Export with original names for backwards compatibility
export const get_grades = get_grades_query;
export const delete_grade = delete_grade_command;
