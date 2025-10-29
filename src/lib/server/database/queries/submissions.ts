import { eq, and, sql } from "drizzle-orm";
import { db } from "../drizzle";
import {
	assignment_submissions_table,
	assignments_table,
	students_table,
	grades_table,
} from "../schema";

export async function submit_assignment(
	data: typeof assignment_submissions_table.$inferInsert,
) {
	try {
		const [submission] = await db
			.insert(assignment_submissions_table)
			.values(data)
			.returning();

		return { success: true, data: submission };
	} catch (_e) {
		console.error("Error submitting assignment:", _e);
		return { success: false, message: "Failed to submit assignment" };
	}
}

export async function get_assignment_submissions(assignment_id: string) {
	try {
		const submissions = await db
			.select({
				id: assignment_submissions_table.id,
				file_url: assignment_submissions_table.file_url,
				file_name: assignment_submissions_table.file_name,
				submission_date: assignment_submissions_table.submission_date,
				status: assignment_submissions_table.status,
				feedback: assignment_submissions_table.feedback,
				student_id: assignment_submissions_table.student_id,
				student_name: students_table.first_name,
				student_last_name: students_table.last_name,
				student_admission: students_table.admission_number,
				grade_score: grades_table.actual_score,
				grade_max: grades_table.max_score,
			})
			.from(assignment_submissions_table)
			.leftJoin(
				students_table,
				eq(assignment_submissions_table.student_id, students_table.id),
			)
			.leftJoin(
				grades_table,
				eq(assignment_submissions_table.grade_id, grades_table.id),
			)
			.where(eq(assignment_submissions_table.assignment_id, assignment_id));

		return { success: true, data: submissions };
	} catch (_e) {
		console.error("Error getting assignment submissions:", _e);
		return { success: false, message: "Failed to get submissions" };
	}
}

export async function get_student_submissions(student_id: string) {
	try {
		const submissions = await db
			.select({
				id: assignment_submissions_table.id,
				file_url: assignment_submissions_table.file_url,
				file_name: assignment_submissions_table.file_name,
				submission_date: assignment_submissions_table.submission_date,
				status: assignment_submissions_table.status,
				feedback: assignment_submissions_table.feedback,
				assignment_title: assignments_table.title,
				assignment_due_date: assignments_table.due_date,
				grade_score: grades_table.actual_score,
				grade_max: grades_table.max_score,
			})
			.from(assignment_submissions_table)
			.leftJoin(
				assignments_table,
				eq(assignment_submissions_table.assignment_id, assignments_table.id),
			)
			.leftJoin(
				grades_table,
				eq(assignment_submissions_table.grade_id, grades_table.id),
			)
			.where(eq(assignment_submissions_table.student_id, student_id))
			.orderBy(sql`${assignment_submissions_table.submission_date} DESC`);

		return { success: true, data: submissions };
	} catch (_e) {
		console.error("Error getting student submissions:", _e);
		return { success: false, message: "Failed to get student submissions" };
	}
}

export async function get_submission(submission_id: string) {
	try {
		const submission = await db.query.assignment_submissions_table.findFirst({
			where: eq(assignment_submissions_table.id, submission_id),
		});

		return { success: true, data: submission };
	} catch (_e) {
		console.error("Error getting submission:", _e);
		return { success: false, message: "Failed to get submission" };
	}
}

export async function update_submission(
	submission_id: string,
	data: Partial<typeof assignment_submissions_table.$inferInsert>,
) {
	try {
		const [submission] = await db
			.update(assignment_submissions_table)
			.set(data)
			.where(eq(assignment_submissions_table.id, submission_id))
			.returning();

		return { success: true, data: submission };
	} catch (_e) {
		console.error("Error updating submission:", _e);
		return { success: false, message: "Failed to update submission" };
	}
}

export async function delete_submission(submission_id: string) {
	try {
		await db
			.delete(assignment_submissions_table)
			.where(eq(assignment_submissions_table.id, submission_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting submission:", _e);
		return { success: false, message: "Failed to delete submission" };
	}
}

export async function link_grade_to_submission(
	submission_id: string,
	grade_id: string,
) {
	try {
		const [submission] = await db
			.update(assignment_submissions_table)
			.set({ grade_id, status: "graded" })
			.where(eq(assignment_submissions_table.id, submission_id))
			.returning();

		return { success: true, data: submission };
	} catch (_e) {
		console.error("Error linking grade to submission:", _e);
		return { success: false, message: "Failed to link grade" };
	}
}

export async function get_ungraded_submissions(assignment_id: string) {
	try {
		const submissions = await db
			.select({
				id: assignment_submissions_table.id,
				file_url: assignment_submissions_table.file_url,
				file_name: assignment_submissions_table.file_name,
				submission_date: assignment_submissions_table.submission_date,
				student_name: students_table.first_name,
				student_last_name: students_table.last_name,
				student_admission: students_table.admission_number,
			})
			.from(assignment_submissions_table)
			.leftJoin(
				students_table,
				eq(assignment_submissions_table.student_id, students_table.id),
			)
			.where(
				and(
					eq(assignment_submissions_table.assignment_id, assignment_id),
					eq(assignment_submissions_table.status, "submitted"),
				),
			);

		return { success: true, data: submissions };
	} catch (_e) {
		console.error("Error getting ungraded submissions:", _e);
		return { success: false, message: "Failed to get ungraded submissions" };
	}
}

export async function check_student_submitted(
	student_id: string,
	assignment_id: string,
) {
	try {
		const submission =
			await db.query.assignment_submissions_table.findFirst({
				where: and(
					eq(assignment_submissions_table.student_id, student_id),
					eq(assignment_submissions_table.assignment_id, assignment_id),
				),
			});

		return { success: true, data: { submitted: !!submission, submission } };
	} catch (_e) {
		console.error("Error checking submission:", _e);
		return { success: false, message: "Failed to check submission" };
	}
}
