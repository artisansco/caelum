/**
 * Excel Export Utility
 * Generates student results and grade reports in Excel format
 */

import * as XLSX from "xlsx";

export interface ExcelGradeData {
	admission_number: string;
	student_name: string;
	class_name: string;
	subject: string;
	grade_type: string;
	actual_score: number;
	max_score: number;
	percentage: number;
	grade: string;
	term: string;
	academic_year: string;
}

export interface ExcelStudentSummary {
	admission_number: string;
	student_name: string;
	class_name: string;
	total_subjects: number;
	total_marks: number;
	max_possible_marks: number;
	average_percentage: number;
	overall_grade: string;
	term: string;
	academic_year: string;
}

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
 * Generate Excel workbook for individual student results
 * Returns buffer that can be sent as file download
 */
export function generate_student_result_excel(data: {
	student: {
		name: string;
		admission_number: string;
		class_name: string;
	};
	grades: Array<{
		subject_name: string;
		grade_type: string;
		actual_score: number;
		max_score: number;
		percentage: number;
		term: string;
		academic_year: string;
	}>;
	school_name: string;
}): Buffer {
	const workbook = XLSX.utils.book_new();

	// Prepare grades data
	const grades_data = data.grades.map((grade) => ({
		Subject: grade.subject_name,
		Type: grade.grade_type,
		Score: `${grade.actual_score}/${grade.max_score}`,
		Percentage: `${grade.percentage.toFixed(1)}%`,
		Grade: calculate_grade(grade.percentage),
		Term: grade.term,
		"Academic Year": grade.academic_year,
	}));

	// Create grades worksheet
	const grades_worksheet = XLSX.utils.json_to_sheet(grades_data);

	// Add student info header rows
	XLSX.utils.sheet_add_aoa(
		grades_worksheet,
		[
			[data.school_name],
			["Student Result Report"],
			[],
			["Student Name:", data.student.name],
			["Admission Number:", data.student.admission_number],
			["Class:", data.student.class_name],
			[],
		],
		{ origin: "A1" },
	);

	// Calculate summary
	const total_marks = data.grades.reduce(
		(sum, g) => sum + g.actual_score,
		0,
	);
	const max_marks = data.grades.reduce((sum, g) => sum + g.max_score, 0);
	const average = max_marks > 0 ? (total_marks / max_marks) * 100 : 0;

	// Add summary at the bottom
	const summary_start_row = grades_data.length + 9;
	XLSX.utils.sheet_add_aoa(
		grades_worksheet,
		[
			[],
			["SUMMARY"],
			["Total Subjects:", data.grades.length],
			["Total Marks:", `${total_marks}/${max_marks}`],
			["Average Percentage:", `${average.toFixed(2)}%`],
			["Overall Grade:", calculate_grade(average)],
		],
		{ origin: `A${summary_start_row}` },
	);

	// Set column widths
	grades_worksheet["!cols"] = [
		{ wch: 25 }, // Subject
		{ wch: 15 }, // Type
		{ wch: 12 }, // Score
		{ wch: 12 }, // Percentage
		{ wch: 10 }, // Grade
		{ wch: 10 }, // Term
		{ wch: 15 }, // Academic Year
	];

	XLSX.utils.book_append_sheet(workbook, grades_worksheet, "Student Results");

	// Generate buffer
	return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

/**
 * Generate Excel workbook for class results with multiple sheets
 */
export function generate_class_results_excel(data: {
	class_name: string;
	term: string;
	academic_year: string;
	students: ExcelStudentSummary[];
	detailed_grades?: ExcelGradeData[];
	school_name: string;
}): Buffer {
	const workbook = XLSX.utils.book_new();

	// Sheet 1: Student Summary
	const summary_data = data.students.map((student) => ({
		"Admission No": student.admission_number,
		"Student Name": student.student_name,
		Class: student.class_name,
		"Total Subjects": student.total_subjects,
		"Total Marks": `${student.total_marks}/${student.max_possible_marks}`,
		"Average %": student.average_percentage.toFixed(2),
		Grade: student.overall_grade,
	}));

	const summary_worksheet = XLSX.utils.json_to_sheet(summary_data);

	// Add header
	XLSX.utils.sheet_add_aoa(
		summary_worksheet,
		[
			[data.school_name],
			["Class Results Summary"],
			[
				`Class: ${data.class_name}  |  Term: ${data.term}  |  Academic Year: ${data.academic_year}`,
			],
			[],
		],
		{ origin: "A1" },
	);

	// Set column widths for summary
	summary_worksheet["!cols"] = [
		{ wch: 15 }, // Admission No
		{ wch: 25 }, // Student Name
		{ wch: 15 }, // Class
		{ wch: 15 }, // Total Subjects
		{ wch: 15 }, // Total Marks
		{ wch: 12 }, // Average %
		{ wch: 10 }, // Grade
	];

	XLSX.utils.book_append_sheet(workbook, summary_worksheet, "Summary");

	// Sheet 2: Detailed Grades (if provided)
	if (data.detailed_grades && data.detailed_grades.length > 0) {
		const detailed_data = data.detailed_grades.map((grade) => ({
			"Admission No": grade.admission_number,
			"Student Name": grade.student_name,
			Class: grade.class_name,
			Subject: grade.subject,
			Type: grade.grade_type,
			Score: `${grade.actual_score}/${grade.max_score}`,
			"Percentage": `${grade.percentage.toFixed(1)}%`,
			Grade: grade.grade,
			Term: grade.term,
			"Academic Year": grade.academic_year,
		}));

		const detailed_worksheet = XLSX.utils.json_to_sheet(detailed_data);

		// Add header
		XLSX.utils.sheet_add_aoa(
			detailed_worksheet,
			[
				[data.school_name],
				["Detailed Grade Report"],
				[
					`Class: ${data.class_name}  |  Term: ${data.term}  |  Academic Year: ${data.academic_year}`,
				],
				[],
			],
			{ origin: "A1" },
		);

		// Set column widths for detailed view
		detailed_worksheet["!cols"] = [
			{ wch: 15 }, // Admission No
			{ wch: 25 }, // Student Name
			{ wch: 15 }, // Class
			{ wch: 20 }, // Subject
			{ wch: 15 }, // Type
			{ wch: 12 }, // Score
			{ wch: 12 }, // Percentage
			{ wch: 10 }, // Grade
			{ wch: 10 }, // Term
			{ wch: 15 }, // Academic Year
		];

		XLSX.utils.book_append_sheet(
			workbook,
			detailed_worksheet,
			"Detailed Grades",
		);
	}

	// Generate buffer
	return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

/**
 * Generate Excel template for bulk grade import
 */
export function generate_grade_import_template(
	students: Array<{ admission_number: string; name: string }>,
	subjects: Array<{ name: string }>,
): Buffer {
	const workbook = XLSX.utils.book_new();

	// Instructions sheet
	const instructions_data = [
		["Grade Import Template"],
		[],
		["Instructions:"],
		["1. Fill in the grades for each student in the respective subject columns"],
		["2. Grade types: Exam, Quiz, Assignment, Project, Midterm, Final"],
		["3. Enter scores as numbers (e.g., 85)"],
		["4. Do not modify the Admission Number or Student Name columns"],
		["5. Save the file and upload it to the system"],
		[],
		["Grade Scale:"],
		["A+ = 90-100%"],
		["A  = 80-89%"],
		["B  = 70-79%"],
		["C  = 60-69%"],
		["D  = 50-59%"],
		["E  = 40-49%"],
		["F  = 0-39%"],
	];

	const instructions_worksheet = XLSX.utils.aoa_to_sheet(instructions_data);
	instructions_worksheet["!cols"] = [{ wch: 60 }];
	XLSX.utils.book_append_sheet(
		workbook,
		instructions_worksheet,
		"Instructions",
	);

	// Grade entry sheet
	const headers = ["Admission Number", "Student Name"];
	subjects.forEach((subject) => {
		headers.push(`${subject.name} - Score`);
		headers.push(`${subject.name} - Max Score`);
		headers.push(`${subject.name} - Type`);
	});

	const grade_data: any[][] = [headers];

	students.forEach((student) => {
		const row: any[] = [student.admission_number, student.name];
		subjects.forEach(() => {
			row.push(""); // Score
			row.push(100); // Default max score
			row.push("Exam"); // Default type
		});
		grade_data.push(row);
	});

	const grade_worksheet = XLSX.utils.aoa_to_sheet(grade_data);

	// Set column widths
	const col_widths = [{ wch: 18 }, { wch: 25 }];
	subjects.forEach(() => {
		col_widths.push({ wch: 12 }); // Score
		col_widths.push({ wch: 12 }); // Max Score
		col_widths.push({ wch: 15 }); // Type
	});
	grade_worksheet["!cols"] = col_widths;

	XLSX.utils.book_append_sheet(workbook, grade_worksheet, "Grades");

	return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

/**
 * Parse grades from uploaded Excel file
 */
export function parse_grade_import(
	buffer: Buffer,
): Array<{
	admission_number: string;
	subject: string;
	actual_score: number;
	max_score: number;
	grade_type: string;
}> {
	const workbook = XLSX.read(buffer, { type: "buffer" });
	const worksheet = workbook.Sheets["Grades"];

	if (!worksheet) {
		throw new Error("Grades sheet not found in uploaded file");
	}

	const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

	if (data.length < 2) {
		throw new Error("No data found in uploaded file");
	}

	const headers = data[0] as string[];
	const results: Array<{
		admission_number: string;
		subject: string;
		actual_score: number;
		max_score: number;
		grade_type: string;
	}> = [];

	// Parse each row (skip header)
	for (let i = 1; i < data.length; i++) {
		const row = data[i];
		const admission_number = row[0]?.toString().trim();

		if (!admission_number) continue;

		// Parse each subject (starting from column 2, groups of 3)
		for (let j = 2; j < headers.length; j += 3) {
			const subject_header = headers[j];
			if (!subject_header) continue;

			const subject_name = subject_header.replace(" - Score", "").trim();
			const actual_score = parseFloat(row[j]);
			const max_score = parseFloat(row[j + 1]) || 100;
			const grade_type = row[j + 2]?.toString().trim() || "Exam";

			if (!isNaN(actual_score) && actual_score >= 0) {
				results.push({
					admission_number,
					subject: subject_name,
					actual_score,
					max_score,
					grade_type,
				});
			}
		}
	}

	return results;
}

/**
 * Generate attendance report Excel
 */
export function generate_attendance_excel(data: {
	class_name: string;
	date_range: { start: string; end: string };
	students: Array<{
		admission_number: string;
		name: string;
		total_days: number;
		present: number;
		absent: number;
		late: number;
		excused: number;
		attendance_rate: number;
	}>;
	school_name: string;
}): Buffer {
	const workbook = XLSX.utils.book_new();

	const attendance_data = data.students.map((student) => ({
		"Admission No": student.admission_number,
		"Student Name": student.name,
		"Total Days": student.total_days,
		Present: student.present,
		Absent: student.absent,
		Late: student.late,
		Excused: student.excused,
		"Attendance Rate": `${student.attendance_rate.toFixed(1)}%`,
	}));

	const worksheet = XLSX.utils.json_to_sheet(attendance_data);

	// Add header
	XLSX.utils.sheet_add_aoa(
		worksheet,
		[
			[data.school_name],
			["Attendance Report"],
			[
				`Class: ${data.class_name}  |  Period: ${data.date_range.start} to ${data.date_range.end}`,
			],
			[],
		],
		{ origin: "A1" },
	);

	// Set column widths
	worksheet["!cols"] = [
		{ wch: 15 }, // Admission No
		{ wch: 25 }, // Student Name
		{ wch: 12 }, // Total Days
		{ wch: 10 }, // Present
		{ wch: 10 }, // Absent
		{ wch: 10 }, // Late
		{ wch: 10 }, // Excused
		{ wch: 15 }, // Attendance Rate
	];

	XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

	return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}
