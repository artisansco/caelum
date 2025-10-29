/**
 * Import Remote Functions
 * Handles bulk CSV imports for students and staff
 */

import { getRequestEvent } from "$app/server";
import { get_current_user } from "$lib/auth";
import { database } from "$lib/server/database/queries";
import {
	parse_student_csv,
	parse_staff_csv,
	hash_password,
	generate_student_csv_template,
	generate_staff_csv_template,
	type StudentCSVRow,
	type StaffCSVRow,
	type ValidationError,
} from "$lib/imports/csv";

/**
 * Preview student CSV before importing
 * Validates the CSV and returns preview data without saving
 */
export async function preview_student_csv(csv_content: string) {
	const user = get_current_user();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const result = await parse_student_csv(csv_content);

	return {
		success: result.success,
		data: result.data,
		errors: result.errors,
		total_rows: result.total_rows,
		valid_rows: result.valid_rows,
		invalid_rows: result.invalid_rows,
	};
}

/**
 * Import students from CSV
 */
export async function import_students(csv_content: string) {
	const user = get_current_user();
	const { locals } = getRequestEvent();
	const school_id = locals.school_id;

	if (!user || !school_id) {
		throw new Error("Unauthorized");
	}

	// Parse and validate CSV
	const parse_result = await parse_student_csv(csv_content);
	if (!parse_result.success || !parse_result.data) {
		return {
			success: false,
			message: "CSV validation failed",
			errors: parse_result.errors,
		};
	}

	const imported: string[] = [];
	const failed: Array<{ row: number; admission_number: string; error: string }> = [];

	// Get all classes for the school to map class names
	const classes_result = await database.get_classes(school_id);
	if (!classes_result.success) {
		return {
			success: false,
			message: "Failed to fetch classes",
		};
	}

	const class_map = new Map<string, string>();
	classes_result.data.forEach((c) => {
		class_map.set(c.name.toLowerCase(), c.id);
	});

	// Process each student
	for (let i = 0; i < parse_result.data.length; i++) {
		const student_data = parse_result.data[i];

		try {
			// Find class ID
			const class_id = class_map.get(student_data.class_name.toLowerCase());
			if (!class_id) {
				failed.push({
					row: i + 2,
					admission_number: student_data.admission_number,
					error: `Class "${student_data.class_name}" not found`,
				});
				continue;
			}

			// Check if admission number already exists
			const existing = await database.get_student_by_admission_number(
				student_data.admission_number,
			);
			if (existing.success && existing.data) {
				failed.push({
					row: i + 2,
					admission_number: student_data.admission_number,
					error: "Admission number already exists",
				});
				continue;
			}

			// Hash password if provided
			let password_hash: string | undefined;
			if (student_data.default_password) {
				password_hash = await hash_password(student_data.default_password);
			}

			// Create student
			const create_result = await database.create_student({
				admission_number: student_data.admission_number,
				first_name: student_data.first_name,
				last_name: student_data.last_name,
				date_of_birth: student_data.date_of_birth,
				gender: student_data.gender,
				email: student_data.email || null,
				phone_number: student_data.phone_number || null,
				address: student_data.address || null,
				class_id,
				school_id,
				admission_date: student_data.admission_date || new Date().toISOString().split("T")[0],
				status: "active",
				password: password_hash || null,
			});

			if (!create_result.success || !create_result.data) {
				failed.push({
					row: i + 2,
					admission_number: student_data.admission_number,
					error: create_result.message || "Failed to create student",
				});
				continue;
			}

			imported.push(student_data.admission_number);

			// Create guardian if parent info provided
			if (student_data.parent_name && student_data.parent_phone) {
				const name_parts = student_data.parent_name.split(" ");
				const first_name = name_parts[0];
				const last_name = name_parts.slice(1).join(" ") || first_name;

				await database.create_guardian({
					first_name,
					last_name,
					phone_number: student_data.parent_phone,
					email: student_data.parent_email || null,
					relationship: "parent",
					is_primary_contact: true,
					is_emergency_contact: true,
					student_id: create_result.data.id,
					school_id,
				});
			}
		} catch (error) {
			console.error("Error importing student:", error);
			failed.push({
				row: i + 2,
				admission_number: student_data.admission_number,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	return {
		success: failed.length === 0,
		message:
			failed.length === 0
				? `Successfully imported ${imported.length} students`
				: `Imported ${imported.length} students, ${failed.length} failed`,
		imported_count: imported.length,
		failed_count: failed.length,
		imported,
		failed,
	};
}

/**
 * Preview staff CSV before importing
 */
export async function preview_staff_csv(csv_content: string) {
	const user = get_current_user();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const result = await parse_staff_csv(csv_content);

	return {
		success: result.success,
		data: result.data,
		errors: result.errors,
		total_rows: result.total_rows,
		valid_rows: result.valid_rows,
		invalid_rows: result.invalid_rows,
	};
}

/**
 * Import staff from CSV
 */
export async function import_staff(csv_content: string) {
	const user = get_current_user();
	const { locals } = getRequestEvent();
	const school_id = locals.school_id;

	if (!user || !school_id) {
		throw new Error("Unauthorized");
	}

	// Parse and validate CSV
	const parse_result = await parse_staff_csv(csv_content);
	if (!parse_result.success || !parse_result.data) {
		return {
			success: false,
			message: "CSV validation failed",
			errors: parse_result.errors,
		};
	}

	const imported: string[] = [];
	const failed: Array<{ row: number; employee_id: string; error: string }> = [];

	// Process each staff member
	for (let i = 0; i < parse_result.data.length; i++) {
		const staff_data = parse_result.data[i];

		try {
			// Check if email already exists
			const existing = await database.get_staff_by_email(staff_data.email);
			if (existing.success && existing.data) {
				failed.push({
					row: i + 2,
					employee_id: staff_data.employee_id,
					error: "Email already exists",
				});
				continue;
			}

			// Hash password
			const password_hash = await hash_password(staff_data.default_password);

			// Create staff
			const create_result = await database.create_staff({
				employee_id: staff_data.employee_id,
				first_name: staff_data.first_name,
				last_name: staff_data.last_name,
				email: staff_data.email,
				phone_number: staff_data.phone_number || null,
				role: staff_data.role,
				password: password_hash,
				school_id,
			});

			if (!create_result.success) {
				failed.push({
					row: i + 2,
					employee_id: staff_data.employee_id,
					error: create_result.message || "Failed to create staff",
				});
				continue;
			}

			imported.push(staff_data.employee_id);
		} catch (error) {
			console.error("Error importing staff:", error);
			failed.push({
				row: i + 2,
				employee_id: staff_data.employee_id,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	return {
		success: failed.length === 0,
		message:
			failed.length === 0
				? `Successfully imported ${imported.length} staff members`
				: `Imported ${imported.length} staff, ${failed.length} failed`,
		imported_count: imported.length,
		failed_count: failed.length,
		imported,
		failed,
	};
}

/**
 * Download student CSV template
 */
export function get_student_template() {
	const template = generate_student_csv_template();
	return {
		success: true,
		data: {
			content: template,
			filename: "student_import_template.csv",
			mime_type: "text/csv",
		},
	};
}

/**
 * Download staff CSV template
 */
export function get_staff_template() {
	const template = generate_staff_csv_template();
	return {
		success: true,
		data: {
			content: template,
			filename: "staff_import_template.csv",
			mime_type: "text/csv",
		},
	};
}
