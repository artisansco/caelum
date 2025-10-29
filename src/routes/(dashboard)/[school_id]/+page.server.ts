import { ensure_authenticated } from "$lib/auth";
import { database } from "$lib/server/database/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	ensure_authenticated();
	const [
		{ success: students_success, data: students },
		{ success: staff_success, data: staff },
		{ success: assignments_success, data: assignments },
		{ success: announcements_success, data: announcements },
	] = await Promise.all([
		database.get_students(params.school_id, { limit: -1 }), // Get all students
		database.get_all_staff(params.school_id, { limit: -1 }), // Get all staff
		database.get_assignments(params.school_id),
		database.get_announcements(params.school_id, 5), // Get recent 5 announcements
	]);

	const students_data = students_success ? students || [] : [];
	const staff_data = staff_success ? staff || [] : [];
	const assignments_data = assignments_success ? assignments || [] : [];
	const announcements_data = announcements_success ? announcements || [] : [];

	// Calculate student enrollment by month for the current year
	const current_year = new Date().getFullYear();
	const enrollment_by_month = Array(12).fill(0);

	students_data.forEach((student) => {
		if (student.admission_date) {
			const admission_date = new Date(student.admission_date);
			if (admission_date.getFullYear() === current_year) {
				const month = admission_date.getMonth();
				enrollment_by_month[month]++;
			}
		}
	});

	// Calculate cumulative enrollment
	const cumulative_enrollment = enrollment_by_month.reduce((acc, count, index) => {
		const previous = index > 0 ? acc[index - 1] : 0;
		acc.push(previous + count);
		return acc;
	}, [] as number[]);

	// Calculate assignment submission statistics
	let submitted_count = 0;
	let late_count = 0;
	let missing_count = 0;

	// Get all submissions for assignments
	const submission_promises = assignments_data.map(async (assignment) => {
		const result = await database.get_assignment_submissions(assignment.id);
		return result.success ? result.data : [];
	});

	const all_submissions = (await Promise.all(submission_promises)).flat();

	all_submissions.forEach((submission) => {
		if (submission.status === "graded" || submission.status === "submitted") {
			submitted_count++;
		} else if (submission.status === "late") {
			late_count++;
		}
	});

	// Estimate missing assignments (total expected - submitted)
	const expected_submissions = assignments_data.length * students_data.length;
	missing_count = Math.max(0, expected_submissions - all_submissions.length);

	// Get active students by status
	const active_students = students_data.filter(s => s.status === "active").length;
	const graduated_students = students_data.filter(s => s.status === "graduated").length;
	const expelled_students = students_data.filter(s => s.status === "expelled").length;

	// Format upcoming events from recent announcements
	const upcoming_events = announcements_data.slice(0, 5).map((announcement) => ({
		id: announcement.id,
		title: announcement.title,
		date: new Date(announcement.created_at).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		}),
		type: announcement.type || "announcement",
	}));

	return {
		total_students: students_data.length,
		total_staff: staff_data.length,
		total_assignments: assignments_data.length,
		active_students,
		graduated_students,
		expelled_students,
		enrollment_by_month: cumulative_enrollment,
		submission_stats: {
			submitted: submitted_count,
			late: late_count,
			missing: missing_count,
		},
		upcoming_events,
	};
};
