/**
 * Export Remote Functions
 * Handles PDF and Excel generation for student results
 */

import { getRequestEvent } from "$app/server";
import * as v from "valibot";
import { database } from "$lib/server/database/queries";
import {
	generate_student_result_pdf,
	generate_class_results_pdf,
	pdf_to_buffer,
} from "$lib/exports/pdf";
import {
	generate_student_result_excel,
	generate_class_results_excel,
	generate_attendance_excel,
	type ExcelStudentSummary,
	type ExcelGradeData,
} from "$lib/exports/excel";

/**
 * Calculate grade letter from percentage
 */
function calculate_grade(percentage: number): string {
	if (percentage >= 90) return "A+";
	if (percentage >= 80) return "A";
	if (percentage >= 70) return "B";
	if (percentage >= 60) return "C";
	if (percentage >= 50) return "D";
	if (percentage >= 40) return "E";
	return "F";
}

/**
 * Export individual student results as PDF
 */
export async function export_student_pdf(params: {
	student_id: string;
	term: string;
	academic_year: string;
}) {
	const { locals } = getRequestEvent();
	const school_id = locals.school_id;

	if (!school_id) {
		throw new Error("School ID not found");
	}

	// Get student info
	const student_result = await database.get_student(params.student_id);
	if (!student_result.success || !student_result.data) {
		throw new Error("Student not found");
	}
	const student = student_result.data;

	// Get school info
	const school_result = await database.get_school(school_id);
	if (!school_result.success || !school_result.data) {
		throw new Error("School not found");
	}
	const school = school_result.data;

	// Get class info
	const class_result = await database.get_class(student.class_id);
	const class_name = class_result.success && class_result.data
		? class_result.data.name
		: "Unknown";

	// Get grades for the student
	const grades_result = await database.get_student_grades(params.student_id);
	if (!grades_result.success) {
		throw new Error("Failed to fetch grades");
	}

	// Filter grades by term and academic year
	const filtered_grades = grades_result.data.filter(
		(g) =>
			g.term === params.term &&
			g.academic_year === params.academic_year,
	);

	// Get subject names and prepare grade data
	const grades_with_subjects = await Promise.all(
		filtered_grades.map(async (grade) => {
			const subject_result = await database.get_subject(grade.subject_id);
			const subject_name = subject_result.success && subject_result.data
				? subject_result.data.name
				: "Unknown Subject";

			const percentage =
				grade.max_score > 0
					? (grade.actual_score / grade.max_score) * 100
					: 0;

			return {
				subject_name,
				grade_type: grade.grade_type,
				actual_score: grade.actual_score,
				max_score: grade.max_score,
				percentage,
			};
		}),
	);

	// Calculate summary
	const total_marks = grades_with_subjects.reduce(
		(sum, g) => sum + g.actual_score,
		0,
	);
	const max_possible_marks = grades_with_subjects.reduce(
		(sum, g) => sum + g.max_score,
		0,
	);
	const average_percentage =
		max_possible_marks > 0 ? (total_marks / max_possible_marks) * 100 : 0;

	// Generate PDF
	const pdf_doc = generate_student_result_pdf({
		student: {
			name: `${student.first_name} ${student.last_name}`,
			admission_number: student.admission_number,
			class_name,
			term: params.term,
			academic_year: params.academic_year,
		},
		school: {
			name: school.name,
			address: school.address || undefined,
		},
		grades: grades_with_subjects,
		summary: {
			total_subjects: grades_with_subjects.length,
			average_percentage,
			total_marks,
			max_possible_marks,
		},
	});

	// Convert to buffer
	const buffer = await pdf_to_buffer(pdf_doc);

	// Return as base64 for download
	return {
		success: true,
		data: {
			filename: `${student.admission_number}_${params.term}_${params.academic_year}_results.pdf`,
			content: buffer.toString("base64"),
			mime_type: "application/pdf",
		},
	};
}

/**
 * Export individual student results as Excel
 */
export async function export_student_excel(params: {
	student_id: string;
	term: string;
	academic_year: string;
}) {
	const { locals } = getRequestEvent();
	const school_id = locals.school_id;

	if (!school_id) {
		throw new Error("School ID not found");
	}

	// Get student info
	const student_result = await database.get_student(params.student_id);
	if (!student_result.success || !student_result.data) {
		throw new Error("Student not found");
	}
	const student = student_result.data;

	// Get school info
	const school_result = await database.get_school(school_id);
	if (!school_result.success || !school_result.data) {
		throw new Error("School not found");
	}
	const school = school_result.data;

	// Get class info
	const class_result = await database.get_class(student.class_id);
	const class_name = class_result.success && class_result.data
		? class_result.data.name
		: "Unknown";

	// Get grades
	const grades_result = await database.get_student_grades(params.student_id);
	if (!grades_result.success) {
		throw new Error("Failed to fetch grades");
	}

	// Filter and prepare grades
	const filtered_grades = grades_result.data.filter(
		(g) =>
			g.term === params.term &&
			g.academic_year === params.academic_year,
	);

	const grades_with_subjects = await Promise.all(
		filtered_grades.map(async (grade) => {
			const subject_result = await database.get_subject(grade.subject_id);
			const subject_name = subject_result.success && subject_result.data
				? subject_result.data.name
				: "Unknown Subject";

			const percentage =
				grade.max_score > 0
					? (grade.actual_score / grade.max_score) * 100
					: 0;

			return {
				subject_name,
				grade_type: grade.grade_type,
				actual_score: grade.actual_score,
				max_score: grade.max_score,
				percentage,
				term: grade.term,
				academic_year: grade.academic_year,
			};
		}),
	);

	// Generate Excel
	const buffer = generate_student_result_excel({
		student: {
			name: `${student.first_name} ${student.last_name}`,
			admission_number: student.admission_number,
			class_name,
		},
		grades: grades_with_subjects,
		school_name: school.name,
	});

	return {
		success: true,
		data: {
			filename: `${student.admission_number}_${params.term}_${params.academic_year}_results.xlsx`,
			content: buffer.toString("base64"),
			mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		},
	};
}

/**
 * Export class results as PDF
 */
export async function export_class_pdf(params: {
	class_id: string;
	term: string;
	academic_year: string;
}) {
	const { locals } = getRequestEvent();
	const school_id = locals.school_id;

	if (!school_id) {
		throw new Error("School ID not found");
	}

	// Get class info
	const class_result = await database.get_class(params.class_id);
	if (!class_result.success || !class_result.data) {
		throw new Error("Class not found");
	}
	const class_data = class_result.data;

	// Get school info
	const school_result = await database.get_school(school_id);
	if (!school_result.success || !school_result.data) {
		throw new Error("School not found");
	}
	const school = school_result.data;

	// Get all students in the class
	const students_result = await database.get_students_by_class(params.class_id);
	if (!students_result.success) {
		throw new Error("Failed to fetch students");
	}

	// Calculate each student's average
	const students_with_averages = await Promise.all(
		students_result.data.map(async (student) => {
			const grades_result = await database.get_student_grades(student.id);

			if (!grades_result.success) {
				return {
					name: `${student.first_name} ${student.last_name}`,
					admission_number: student.admission_number,
					average: 0,
					total_subjects: 0,
					grade: "F",
				};
			}

			// Filter grades
			const filtered_grades = grades_result.data.filter(
				(g) =>
					g.term === params.term &&
					g.academic_year === params.academic_year,
			);

			const total_marks = filtered_grades.reduce(
				(sum, g) => sum + g.actual_score,
				0,
			);
			const max_marks = filtered_grades.reduce(
				(sum, g) => sum + g.max_score,
				0,
			);
			const average = max_marks > 0 ? (total_marks / max_marks) * 100 : 0;

			return {
				name: `${student.first_name} ${student.last_name}`,
				admission_number: student.admission_number,
				average,
				total_subjects: filtered_grades.length,
				grade: calculate_grade(average),
			};
		}),
	);

	// Sort by average descending
	students_with_averages.sort((a, b) => b.average - a.average);

	// Generate PDF
	const pdf_doc = generate_class_results_pdf(
		class_data.name,
		params.term,
		params.academic_year,
		students_with_averages,
		{
			name: school.name,
			address: school.address || undefined,
		},
	);

	const buffer = await pdf_to_buffer(pdf_doc);

	return {
		success: true,
		data: {
			filename: `${class_data.name}_${params.term}_${params.academic_year}_results.pdf`,
			content: buffer.toString("base64"),
			mime_type: "application/pdf",
		},
	};
}

/**
 * Export class results as Excel
 */
export async function export_class_excel(params: {
	class_id: string;
	term: string;
	academic_year: string;
	include_detailed?: boolean;
}) {
	const { locals } = getRequestEvent();
	const school_id = locals.school_id;

	if (!school_id) {
		throw new Error("School ID not found");
	}

	// Get class info
	const class_result = await database.get_class(params.class_id);
	if (!class_result.success || !class_result.data) {
		throw new Error("Class not found");
	}
	const class_data = class_result.data;

	// Get school info
	const school_result = await database.get_school(school_id);
	if (!school_result.success || !school_result.data) {
		throw new Error("School not found");
	}
	const school = school_result.data;

	// Get all students in the class
	const students_result = await database.get_students_by_class(params.class_id);
	if (!students_result.success) {
		throw new Error("Failed to fetch students");
	}

	// Prepare student summaries
	const student_summaries: ExcelStudentSummary[] = [];
	const detailed_grades: ExcelGradeData[] = [];

	for (const student of students_result.data) {
		const grades_result = await database.get_student_grades(student.id);

		if (!grades_result.success) continue;

		// Filter grades
		const filtered_grades = grades_result.data.filter(
			(g) =>
				g.term === params.term &&
				g.academic_year === params.academic_year,
		);

		const total_marks = filtered_grades.reduce(
			(sum, g) => sum + g.actual_score,
			0,
		);
		const max_marks = filtered_grades.reduce(
			(sum, g) => sum + g.max_score,
			0,
		);
		const average = max_marks > 0 ? (total_marks / max_marks) * 100 : 0;

		student_summaries.push({
			admission_number: student.admission_number,
			student_name: `${student.first_name} ${student.last_name}`,
			class_name: class_data.name,
			total_subjects: filtered_grades.length,
			total_marks,
			max_possible_marks: max_marks,
			average_percentage: average,
			overall_grade: calculate_grade(average),
			term: params.term,
			academic_year: params.academic_year,
		});

		// Add detailed grades if requested
		if (params.include_detailed) {
			for (const grade of filtered_grades) {
				const subject_result = await database.get_subject(
					grade.subject_id,
				);
				const subject_name =
					subject_result.success && subject_result.data
						? subject_result.data.name
						: "Unknown";

				const percentage =
					grade.max_score > 0
						? (grade.actual_score / grade.max_score) * 100
						: 0;

				detailed_grades.push({
					admission_number: student.admission_number,
					student_name: `${student.first_name} ${student.last_name}`,
					class_name: class_data.name,
					subject: subject_name,
					grade_type: grade.grade_type,
					actual_score: grade.actual_score,
					max_score: grade.max_score,
					percentage,
					grade: calculate_grade(percentage),
					term: grade.term,
					academic_year: grade.academic_year,
				});
			}
		}
	}

	// Sort by average descending
	student_summaries.sort(
		(a, b) => b.average_percentage - a.average_percentage,
	);

	// Generate Excel
	const buffer = generate_class_results_excel({
		class_name: class_data.name,
		term: params.term,
		academic_year: params.academic_year,
		students: student_summaries,
		detailed_grades:
			params.include_detailed && detailed_grades.length > 0
				? detailed_grades
				: undefined,
		school_name: school.name,
	});

	return {
		success: true,
		data: {
			filename: `${class_data.name}_${params.term}_${params.academic_year}_results.xlsx`,
			content: buffer.toString("base64"),
			mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		},
	};
}

/**
 * Export attendance report as Excel
 */
export async function export_attendance_excel(params: {
	class_id: string;
	start_date: string;
	end_date: string;
}) {
	const { locals } = getRequestEvent();
	const school_id = locals.school_id;

	if (!school_id) {
		throw new Error("School ID not found");
	}

	// Get class info
	const class_result = await database.get_class(params.class_id);
	if (!class_result.success || !class_result.data) {
		throw new Error("Class not found");
	}
	const class_data = class_result.data;

	// Get school info
	const school_result = await database.get_school(school_id);
	if (!school_result.success || !school_result.data) {
		throw new Error("School not found");
	}
	const school = school_result.data;

	// Get all students in the class
	const students_result = await database.get_students_by_class(params.class_id);
	if (!students_result.success) {
		throw new Error("Failed to fetch students");
	}

	// Calculate attendance for each student
	const students_with_attendance = await Promise.all(
		students_result.data.map(async (student) => {
			const attendance_result = await database.get_student_attendance(
				student.id,
				params.start_date,
				params.end_date,
			);

			if (!attendance_result.success) {
				return {
					admission_number: student.admission_number,
					name: `${student.first_name} ${student.last_name}`,
					total_days: 0,
					present: 0,
					absent: 0,
					late: 0,
					excused: 0,
					attendance_rate: 0,
				};
			}

			const attendance_data = attendance_result.data;
			const present = attendance_data.filter((a) => a.status === "present")
				.length;
			const absent = attendance_data.filter((a) => a.status === "absent")
				.length;
			const late = attendance_data.filter((a) => a.status === "late").length;
			const excused = attendance_data.filter((a) => a.status === "excused")
				.length;
			const total_days = attendance_data.length;
			const attendance_rate =
				total_days > 0 ? (present / total_days) * 100 : 0;

			return {
				admission_number: student.admission_number,
				name: `${student.first_name} ${student.last_name}`,
				total_days,
				present,
				absent,
				late,
				excused,
				attendance_rate,
			};
		}),
	);

	// Generate Excel
	const buffer = generate_attendance_excel({
		class_name: class_data.name,
		date_range: {
			start: params.start_date,
			end: params.end_date,
		},
		students: students_with_attendance,
		school_name: school.name,
	});

	return {
		success: true,
		data: {
			filename: `${class_data.name}_attendance_${params.start_date}_to_${params.end_date}.xlsx`,
			content: buffer.toString("base64"),
			mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		},
	};
}
