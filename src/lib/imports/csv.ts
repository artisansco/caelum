/**
 * CSV Import Utility
 * Handles parsing and validation of CSV files for bulk imports
 */

import Papa from "papaparse";
import { hash } from "bcrypt";

export interface StudentCSVRow {
	admission_number: string;
	first_name: string;
	last_name: string;
	date_of_birth: string;
	gender: "male" | "female" | "other";
	email?: string;
	phone_number?: string;
	address?: string;
	class_name: string;
	parent_name?: string;
	parent_phone?: string;
	parent_email?: string;
	admission_date?: string;
	default_password?: string;
}

export interface StaffCSVRow {
	employee_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number?: string;
	role: "admin" | "teacher" | "staff";
	subject?: string;
	default_password: string;
}

export interface ValidationError {
	row: number;
	field: string;
	message: string;
}

export interface CSVImportResult<T> {
	success: boolean;
	data?: T[];
	errors?: ValidationError[];
	total_rows: number;
	valid_rows: number;
	invalid_rows: number;
}

/**
 * Validate student data from CSV
 */
function validate_student_row(
	row: any,
	row_number: number,
): { valid: boolean; data?: StudentCSVRow; errors: ValidationError[] } {
	const errors: ValidationError[] = [];

	// Required fields
	if (!row.admission_number?.trim()) {
		errors.push({
			row: row_number,
			field: "admission_number",
			message: "Admission number is required",
		});
	}
	if (!row.first_name?.trim()) {
		errors.push({
			row: row_number,
			field: "first_name",
			message: "First name is required",
		});
	}
	if (!row.last_name?.trim()) {
		errors.push({
			row: row_number,
			field: "last_name",
			message: "Last name is required",
		});
	}
	if (!row.date_of_birth?.trim()) {
		errors.push({
			row: row_number,
			field: "date_of_birth",
			message: "Date of birth is required",
		});
	}
	if (!row.gender?.trim()) {
		errors.push({
			row: row_number,
			field: "gender",
			message: "Gender is required",
		});
	} else if (!["male", "female", "other"].includes(row.gender.toLowerCase())) {
		errors.push({
			row: row_number,
			field: "gender",
			message: "Gender must be male, female, or other",
		});
	}
	if (!row.class_name?.trim()) {
		errors.push({
			row: row_number,
			field: "class_name",
			message: "Class name is required",
		});
	}

	// Email validation (optional but must be valid if provided)
	if (row.email?.trim()) {
		const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email_regex.test(row.email.trim())) {
			errors.push({
				row: row_number,
				field: "email",
				message: "Invalid email format",
			});
		}
	}

	// Date validation
	if (row.date_of_birth?.trim()) {
		const date = new Date(row.date_of_birth);
		if (isNaN(date.getTime())) {
			errors.push({
				row: row_number,
				field: "date_of_birth",
				message: "Invalid date format (use YYYY-MM-DD)",
			});
		}
	}

	if (errors.length > 0) {
		return { valid: false, errors };
	}

	return {
		valid: true,
		data: {
			admission_number: row.admission_number.trim(),
			first_name: row.first_name.trim(),
			last_name: row.last_name.trim(),
			date_of_birth: row.date_of_birth.trim(),
			gender: row.gender.toLowerCase() as "male" | "female" | "other",
			email: row.email?.trim() || undefined,
			phone_number: row.phone_number?.trim() || undefined,
			address: row.address?.trim() || undefined,
			class_name: row.class_name.trim(),
			parent_name: row.parent_name?.trim() || undefined,
			parent_phone: row.parent_phone?.trim() || undefined,
			parent_email: row.parent_email?.trim() || undefined,
			admission_date: row.admission_date?.trim() || undefined,
			default_password: row.default_password?.trim() || undefined,
		},
		errors: [],
	};
}

/**
 * Validate staff data from CSV
 */
function validate_staff_row(
	row: any,
	row_number: number,
): { valid: boolean; data?: StaffCSVRow; errors: ValidationError[] } {
	const errors: ValidationError[] = [];

	// Required fields
	if (!row.employee_id?.trim()) {
		errors.push({
			row: row_number,
			field: "employee_id",
			message: "Employee ID is required",
		});
	}
	if (!row.first_name?.trim()) {
		errors.push({
			row: row_number,
			field: "first_name",
			message: "First name is required",
		});
	}
	if (!row.last_name?.trim()) {
		errors.push({
			row: row_number,
			field: "last_name",
			message: "Last name is required",
		});
	}
	if (!row.email?.trim()) {
		errors.push({
			row: row_number,
			field: "email",
			message: "Email is required",
		});
	} else {
		const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email_regex.test(row.email.trim())) {
			errors.push({
				row: row_number,
				field: "email",
				message: "Invalid email format",
			});
		}
	}
	if (!row.role?.trim()) {
		errors.push({
			row: row_number,
			field: "role",
			message: "Role is required",
		});
	} else if (!["admin", "teacher", "staff"].includes(row.role.toLowerCase())) {
		errors.push({
			row: row_number,
			field: "role",
			message: "Role must be admin, teacher, or staff",
		});
	}
	if (!row.default_password?.trim()) {
		errors.push({
			row: row_number,
			field: "default_password",
			message: "Default password is required",
		});
	}

	if (errors.length > 0) {
		return { valid: false, errors };
	}

	return {
		valid: true,
		data: {
			employee_id: row.employee_id.trim(),
			first_name: row.first_name.trim(),
			last_name: row.last_name.trim(),
			email: row.email.trim(),
			phone_number: row.phone_number?.trim() || undefined,
			role: row.role.toLowerCase() as "admin" | "teacher" | "staff",
			subject: row.subject?.trim() || undefined,
			default_password: row.default_password.trim(),
		},
		errors: [],
	};
}

/**
 * Parse and validate student CSV file
 */
export async function parse_student_csv(
	csv_content: string,
): Promise<CSVImportResult<StudentCSVRow>> {
	return new Promise((resolve) => {
		Papa.parse(csv_content, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const all_errors: ValidationError[] = [];
				const valid_data: StudentCSVRow[] = [];

				results.data.forEach((row: any, index: number) => {
					const validation = validate_student_row(row, index + 2); // +2 because row 1 is header
					if (validation.valid && validation.data) {
						valid_data.push(validation.data);
					} else {
						all_errors.push(...validation.errors);
					}
				});

				resolve({
					success: all_errors.length === 0,
					data: valid_data,
					errors: all_errors.length > 0 ? all_errors : undefined,
					total_rows: results.data.length,
					valid_rows: valid_data.length,
					invalid_rows: all_errors.length,
				});
			},
			error: (error) => {
				resolve({
					success: false,
					errors: [
						{
							row: 0,
							field: "file",
							message: `CSV parsing error: ${error.message}`,
						},
					],
					total_rows: 0,
					valid_rows: 0,
					invalid_rows: 1,
				});
			},
		});
	});
}

/**
 * Parse and validate staff CSV file
 */
export async function parse_staff_csv(
	csv_content: string,
): Promise<CSVImportResult<StaffCSVRow>> {
	return new Promise((resolve) => {
		Papa.parse(csv_content, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const all_errors: ValidationError[] = [];
				const valid_data: StaffCSVRow[] = [];

				results.data.forEach((row: any, index: number) => {
					const validation = validate_staff_row(row, index + 2);
					if (validation.valid && validation.data) {
						valid_data.push(validation.data);
					} else {
						all_errors.push(...validation.errors);
					}
				});

				resolve({
					success: all_errors.length === 0,
					data: valid_data,
					errors: all_errors.length > 0 ? all_errors : undefined,
					total_rows: results.data.length,
					valid_rows: valid_data.length,
					invalid_rows: all_errors.length,
				});
			},
			error: (error) => {
				resolve({
					success: false,
					errors: [
						{
							row: 0,
							field: "file",
							message: `CSV parsing error: ${error.message}`,
						},
					],
					total_rows: 0,
					valid_rows: 0,
					invalid_rows: 1,
				});
			},
		});
	});
}

/**
 * Generate CSV template for student import
 */
export function generate_student_csv_template(): string {
	const headers = [
		"admission_number",
		"first_name",
		"last_name",
		"date_of_birth",
		"gender",
		"email",
		"phone_number",
		"address",
		"class_name",
		"parent_name",
		"parent_phone",
		"parent_email",
		"admission_date",
		"default_password",
	];

	const example_row = [
		"STU001",
		"John",
		"Doe",
		"2010-05-15",
		"male",
		"john.doe@example.com",
		"+1234567890",
		"123 Main St",
		"Grade 10A",
		"Jane Doe",
		"+0987654321",
		"jane.doe@example.com",
		"2024-01-10",
		"password123",
	];

	return Papa.unparse([headers, example_row]);
}

/**
 * Generate CSV template for staff import
 */
export function generate_staff_csv_template(): string {
	const headers = [
		"employee_id",
		"first_name",
		"last_name",
		"email",
		"phone_number",
		"role",
		"subject",
		"default_password",
	];

	const example_row = [
		"EMP001",
		"Jane",
		"Smith",
		"jane.smith@school.com",
		"+1234567890",
		"teacher",
		"Mathematics",
		"password123",
	];

	return Papa.unparse([headers, example_row]);
}

/**
 * Hash password for imported users
 */
export async function hash_password(password: string): Promise<string> {
	return await hash(password, 10);
}
