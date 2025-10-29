import type { PageServerLoad } from "./$types";
import { require_student_auth } from "$lib/student-auth";
import { database } from "$lib/server/database/queries";

export const load: PageServerLoad = async () => {
	const student = require_student_auth();

	// Get student's grades
	const grades_result = await database.get_student_grades(student.id);
	const all_grades = grades_result.success ? grades_result.data : [];

	// Get subjects for each grade
	const grades_with_subjects = await Promise.all(
		all_grades.map(async (grade) => {
			const subject_result = await database.get_subject(grade.subject_id);
			const subject_name = subject_result.success && subject_result.data
				? subject_result.data.name
				: "Unknown Subject";

			const percentage = grade.max_score > 0
				? (grade.actual_score / grade.max_score) * 100
				: 0;

			// Calculate grade letter
			let grade_letter = "F";
			if (percentage >= 90) grade_letter = "A+";
			else if (percentage >= 80) grade_letter = "A";
			else if (percentage >= 70) grade_letter = "B";
			else if (percentage >= 60) grade_letter = "C";
			else if (percentage >= 50) grade_letter = "D";
			else if (percentage >= 40) grade_letter = "E";

			return {
				...grade,
				subject_name,
				percentage,
				grade_letter,
			};
		}),
	);

	// Group grades by academic year and term
	const grouped_grades = grades_with_subjects.reduce(
		(acc, grade) => {
			const key = `${grade.academic_year}-${grade.term}`;
			if (!acc[key]) {
				acc[key] = {
					academic_year: grade.academic_year,
					term: grade.term,
					grades: [],
				};
			}
			acc[key].grades.push(grade);
			return acc;
		},
		{} as Record<string, { academic_year: string; term: string; grades: typeof grades_with_subjects }>,
	);

	// Convert to array and sort by year and term
	const periods = Object.values(grouped_grades).sort((a, b) => {
		if (a.academic_year !== b.academic_year) {
			return b.academic_year.localeCompare(a.academic_year);
		}
		return b.term.localeCompare(a.term);
	});

	// Calculate statistics for each period
	const periods_with_stats = periods.map((period) => {
		const total_marks = period.grades.reduce((sum, g) => sum + g.actual_score, 0);
		const max_marks = period.grades.reduce((sum, g) => sum + g.max_score, 0);
		const average = max_marks > 0 ? (total_marks / max_marks) * 100 : 0;

		let overall_grade = "F";
		if (average >= 90) overall_grade = "A+";
		else if (average >= 80) overall_grade = "A";
		else if (average >= 70) overall_grade = "B";
		else if (average >= 60) overall_grade = "C";
		else if (average >= 50) overall_grade = "D";
		else if (average >= 40) overall_grade = "E";

		return {
			...period,
			stats: {
				total_marks,
				max_marks,
				average,
				overall_grade,
				total_subjects: period.grades.length,
			},
		};
	});

	return {
		periods: periods_with_stats,
	};
};
