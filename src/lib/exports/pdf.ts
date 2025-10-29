/**
 * PDF Export Utility
 * Generates student result reports using PDFKit
 */

import PDFDocument from "pdfkit";
import type { Readable } from "stream";

export interface StudentResultData {
	student: {
		name: string;
		admission_number: string;
		class_name: string;
		term: string;
		academic_year: string;
	};
	school: {
		name: string;
		address?: string;
		logo_url?: string;
	};
	grades: Array<{
		subject_name: string;
		grade_type: string;
		actual_score: number;
		max_score: number;
		percentage: number;
		grade?: string;
	}>;
	summary: {
		total_subjects: number;
		average_percentage: number;
		total_marks: number;
		max_possible_marks: number;
	};
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
 * Generate PDF report for student results
 * Returns a readable stream that can be piped to response or saved to file
 */
export function generate_student_result_pdf(
	data: StudentResultData,
): PDFKit.PDFDocument {
	const doc = new PDFDocument({
		size: "A4",
		margins: {
			top: 50,
			bottom: 50,
			left: 50,
			right: 50,
		},
	});

	// Header section with school info
	doc.fontSize(20).font("Helvetica-Bold").text(data.school.name, {
		align: "center",
	});

	if (data.school.address) {
		doc.fontSize(10).font("Helvetica").text(data.school.address, {
			align: "center",
		});
	}

	doc.moveDown(0.5);
	doc
		.fontSize(16)
		.font("Helvetica-Bold")
		.text("STUDENT RESULT REPORT", { align: "center" });
	doc.moveDown(1);

	// Student information section
	const student_info_y = doc.y;
	doc.fontSize(11).font("Helvetica-Bold");

	// Left column
	doc.text(`Student Name:`, 50, student_info_y);
	doc.text(`Admission No:`, 50, student_info_y + 20);
	doc.text(`Class:`, 50, student_info_y + 40);

	// Right column
	doc.font("Helvetica");
	doc.text(data.student.name, 170, student_info_y);
	doc.text(data.student.admission_number, 170, student_info_y + 20);
	doc.text(data.student.class_name, 170, student_info_y + 40);

	// Term and year on the right side
	doc.font("Helvetica-Bold");
	doc.text(`Term:`, 350, student_info_y);
	doc.text(`Academic Year:`, 350, student_info_y + 20);

	doc.font("Helvetica");
	doc.text(data.student.term, 460, student_info_y);
	doc.text(data.student.academic_year, 460, student_info_y + 20);

	doc.moveDown(3);

	// Draw a line separator
	doc
		.moveTo(50, doc.y)
		.lineTo(545, doc.y)
		.stroke();
	doc.moveDown(1);

	// Grades table
	const table_top = doc.y;
	const col_widths = {
		subject: 200,
		type: 80,
		score: 70,
		percentage: 70,
		grade: 60,
	};

	// Table header
	doc.fontSize(10).font("Helvetica-Bold");
	doc.text("Subject", 50, table_top);
	doc.text("Type", 250, table_top);
	doc.text("Score", 330, table_top);
	doc.text("Percentage", 400, table_top);
	doc.text("Grade", 470, table_top);

	// Header underline
	doc
		.moveTo(50, table_top + 15)
		.lineTo(545, table_top + 15)
		.stroke();

	// Table rows
	doc.font("Helvetica").fontSize(9);
	let current_y = table_top + 25;

	for (const grade of data.grades) {
		// Check if we need a new page
		if (current_y > 700) {
			doc.addPage();
			current_y = 50;
		}

		const grade_letter = grade.grade || calculate_grade(grade.percentage);

		doc.text(grade.subject_name, 50, current_y, { width: 190 });
		doc.text(grade.grade_type, 250, current_y);
		doc.text(
			`${grade.actual_score}/${grade.max_score}`,
			330,
			current_y,
		);
		doc.text(`${grade.percentage.toFixed(1)}%`, 400, current_y);
		doc.text(grade_letter, 470, current_y);

		current_y += 20;
	}

	// Summary section
	doc.moveDown(2);
	doc
		.moveTo(50, doc.y)
		.lineTo(545, doc.y)
		.stroke();
	doc.moveDown(1);

	doc.fontSize(11).font("Helvetica-Bold").text("SUMMARY", { align: "center" });
	doc.moveDown(0.5);

	const summary_y = doc.y;
	doc.fontSize(10).font("Helvetica-Bold");

	// Summary left column
	doc.text("Total Subjects:", 50, summary_y);
	doc.text("Total Marks:", 50, summary_y + 20);
	doc.text("Average:", 50, summary_y + 40);

	// Summary right column
	doc.font("Helvetica");
	doc.text(data.summary.total_subjects.toString(), 170, summary_y);
	doc.text(
		`${data.summary.total_marks}/${data.summary.max_possible_marks}`,
		170,
		summary_y + 20,
	);
	doc.text(
		`${data.summary.average_percentage.toFixed(2)}%`,
		170,
		summary_y + 40,
	);

	// Overall grade
	const overall_grade = calculate_grade(data.summary.average_percentage);
	doc.font("Helvetica-Bold");
	doc.text("Overall Grade:", 350, summary_y + 20);
	doc.fontSize(16).text(overall_grade, 460, summary_y + 15);

	// Footer
	doc.moveDown(3);
	doc
		.fontSize(8)
		.font("Helvetica")
		.text(
			`Generated on: ${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}`,
			{ align: "center" },
		);

	doc.end();
	return doc;
}

/**
 * Generate bulk PDF for multiple students (class report)
 */
export function generate_class_results_pdf(
	class_name: string,
	term: string,
	academic_year: string,
	students: Array<{
		name: string;
		admission_number: string;
		average: number;
		total_subjects: number;
		grade: string;
	}>,
	school: { name: string; address?: string },
): PDFKit.PDFDocument {
	const doc = new PDFDocument({
		size: "A4",
		margins: { top: 50, bottom: 50, left: 50, right: 50 },
		layout: "landscape",
	});

	// Header
	doc.fontSize(20).font("Helvetica-Bold").text(school.name, { align: "center" });
	if (school.address) {
		doc.fontSize(10).font("Helvetica").text(school.address, { align: "center" });
	}

	doc.moveDown(0.5);
	doc.fontSize(16).font("Helvetica-Bold").text("CLASS RESULTS SUMMARY", {
		align: "center",
	});
	doc.moveDown(0.5);

	// Class info
	doc.fontSize(11).font("Helvetica");
	doc.text(`Class: ${class_name}    Term: ${term}    Academic Year: ${academic_year}`, {
		align: "center",
	});
	doc.moveDown(1);

	// Draw separator
	doc
		.moveTo(50, doc.y)
		.lineTo(792 - 50, doc.y)
		.stroke();
	doc.moveDown(1);

	// Table header
	const table_top = doc.y;
	doc.fontSize(10).font("Helvetica-Bold");
	doc.text("#", 50, table_top);
	doc.text("Admission No", 100, table_top);
	doc.text("Student Name", 220, table_top);
	doc.text("Subjects", 450, table_top);
	doc.text("Average", 550, table_top);
	doc.text("Grade", 650, table_top);

	// Header underline
	doc
		.moveTo(50, table_top + 15)
		.lineTo(792 - 50, table_top + 15)
		.stroke();

	// Table rows
	doc.font("Helvetica").fontSize(9);
	let current_y = table_top + 25;
	let row_number = 1;

	for (const student of students) {
		if (current_y > 500) {
			doc.addPage();
			current_y = 50;
		}

		doc.text(row_number.toString(), 50, current_y);
		doc.text(student.admission_number, 100, current_y);
		doc.text(student.name, 220, current_y, { width: 220 });
		doc.text(student.total_subjects.toString(), 450, current_y);
		doc.text(`${student.average.toFixed(2)}%`, 550, current_y);
		doc.text(student.grade, 650, current_y);

		current_y += 20;
		row_number++;
	}

	// Footer
	doc.moveDown(3);
	doc
		.fontSize(8)
		.font("Helvetica")
		.text(
			`Generated on: ${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}`,
			{ align: "center" },
		);

	doc.end();
	return doc;
}

/**
 * Convert PDF stream to buffer for easier handling
 */
export async function pdf_to_buffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		doc.on("data", (chunk: Buffer) => chunks.push(chunk));
		doc.on("end", () => resolve(Buffer.concat(chunks)));
		doc.on("error", reject);
	});
}
