import * as z from "zod";
import { cities } from "./constants";

export const assignment_schema = z.object({
	school_id: z.string(),
	class_id: z.string(),
	title: z
		.string({ error: "title is required" })
		.trim()
		.min(2, { error: "title must be at least 2 characters long" }),
	description: z.string().trim().optional(),
	due_date: z.iso.date({ error: "please select a valid due date" }),
	file: z
		.file()
		.min(1)
		.max(5 * 1024 * 1024, { error: "File size too large. Maximum size is 5MB" })
		.mime(
			[
				"image/png",
				"image/jpeg",
				"image/webp",
				"application/pdf",
				"application/msword",
			],
			{ error: "Invalid file. Only PDF, Images, DOC, DOCX files are allowed" },
		),
});

export const staff_schema = z.object({
	first_name: z
		.string({ error: "first name must be a string" })
		.trim()
		.min(2, { error: "first name must be at least 2 characters long" }),
	middle_name: z
		.string({ error: "Middle name is required" })
		.trim()
		.min(1, { error: "Middle name must be at least 1 characters long" })
		.or(z.literal(""))
		.optional(),
	last_name: z
		.string({ error: "last name must be a string" })
		.trim()
		.min(2, { error: "last name must be at least 2 characters long" }),
	staff_id: z
		.string({ error: "staff id must be a string" })
		.trim()
		.min(5, { error: "staff id must be at least 5 characters long" }),
	email: z.email({ error: "email must be a string" }).optional(),
	employed_on: z.iso.date({ error: "employed on must be a valid date" }),
	address: z
		.string({ error: "address must be a string" })
		.trim()
		.min(2, { error: "address must be at least 2 characters long" }),
	phone_number: z
		.string({ error: "phone number must be a string" })
		.trim()
		.min(6, { error: "phone number must be at least 6 characters long" }),
	password: z
		.string()
		.min(6, { error: "Password must be at least 6 characters long" }),
	role: z.enum(["admin", "staff"], {
		error: "role is invalid or not in the list",
	}),
	permissions: z
		.array(z.string(), {
			error: "permissions must be an array of strings",
		})
		.transform((val) => val.join(",")),
	school_id: z
		.string({ error: "school id must be a string" })
		.trim()
		.min(5, { error: "school id must be at least 5 characters long" }),
});

export const school_schema = z.object({
	school_id: z.string({ error: "school id is required" }),
	name: z
		.string({ error: "school name must be a string" })
		.trim()
		.min(2, { error: "school name must be at least 2 characters long" }),
	license: z
		.string({ error: "license number must be a string" })
		.trim()
		.min(2, { error: "license number must be at least 2 characters long" }),
	address: z
		.string({ error: "address must be a string" })
		.trim()
		.min(2, { error: "address must be at least 2 characters long" }),
	contact: z
		.string()
		.trim()
		.min(2, { error: "contact must be at least 2 characters long" }),
	city: z.enum(cities, { error: "City is invalid or not in the list" }),
	email: z.email(),
	website: z.url().optional(),
	founded_on: z.iso.date({ error: "Founded on must be a valid date" }),
	// logo_url: text(),
});

export const student_schema = z.object({
	first_name: z
		.string({ error: "First name is required" })
		.trim()
		.min(2, { error: "First name must be at least 2 characters long" }),
	middle_name: z
		.string({ error: "Middle name is required" })
		.trim()
		.min(1, { error: "Middle name must be at least 1 characters long" })
		.or(z.literal(""))
		.optional(),
	last_name: z
		.string({ error: "Last name is required" })
		.trim()
		.min(2, { error: "Last name must be at least 2 characters long" }),
	admission_number: z
		.string({ error: "Admission number is required" })
		.trim()
		.min(2, { error: "Admission number must be at least 2 characters long" }),
	email: z.email({ error: "Invalid email address" }).optional(),
	admission_date: z.iso.date({ error: "Invalid date format" }),
	address: z
		.string({ error: "Invalid address" })
		.trim()
		.min(2, { error: "Address must be at least 2 characters long" }),
	// status: z.enum(student_statuses),
	phone_number: z
		.string({ error: "Invalid phone number" })
		.trim()
		.min(6, { error: "Phone number must be at least 6 characters long" }),
	school_id: z.string({ error: "school Id is required" }),
	student_id: z.string({ error: "student id is required" }),
});

export const class_schema = z.object({
	name: z
		.string({ error: "Class name is required" })
		.trim()
		.min(2, { error: "Class name must be at least 2 characters long" }),
	// teacher_id: z.string({ error: "Teacher id is required" }),
	school_id: z.string(),
});

export const announcement_schema = z.object({
	school_id: z.string(),
	title: z
		.string()
		.trim()
		.min(3, { error: "Title must be at least 3 characters long" }),
	content: z
		.string()
		.trim()
		.min(10, { error: "Content must be at least 10 characters long" }),
	priority: z.enum(["low", "medium", "high"], {
		error: "Please select a valid priority",
	}),
	type: z.enum(["general", "urgent", "event", "academic", "administrative"], {
		error: "Please select a valid type",
	}),
	target_audience: z.string().optional(),
	expires_at: z.iso.date().optional().or(z.literal("")),
	is_active: z.boolean().optional(),
});

export const subject_schema = z.object({
	school_id: z.string(),
	name: z
		.string()
		.trim()
		.min(2, { error: "subject name is too small, 2 or more characters" }),
	code: z
		.string()
		.trim()
		.min(4, { error: "subject code is too small, 4 or more characters" })
		.or(z.literal(""))
		.optional(),
});

// TODO: actual grade should not be greater than max_score
export const grade_schema = z.object({
	student_id: z.string({ error: "Student ID is required" }),
	subject_id: z.string({ error: "Subject ID is required" }),
	assignment_id: z.string().optional(),
	grade_type: z
		.enum(["assignment", "quiz", "exam", "project", "participation"], {
			error: "Please select a valid grade type",
		})
		.default("assignment"),
	max_score: z.number().int().min(1).max(1000).default(100),
	actual_score: z
		.number({ error: "Actual score is required" })
		.int()
		.min(0, { error: "Score cannot be negative" }),
	weight: z.number().int().min(1).default(1),
	graded_by: z.string({ error: "Grader ID is required" }),
	term: z
		.string({ error: "Term is required" })
		.trim()
		.min(1, { error: "Term must be specified" })
		.default("first"),
	academic_year: z
		.string({ error: "Academic year is required" })
		.trim()
		.min(4, { error: "Academic year must be at least 4 characters" })
		.max(4, { error: "Academic year must be at most 4 characters" }),
	notes: z.string().trim().optional(),
	school_id: z.string({ error: "School ID is required" }),
});

export const payment_schema = z.object({
	student_id: z.string({ error: "Student ID is required" }),
	amount: z
		.number({ error: "Amount is required" })
		.int()
		.min(1, { error: "Amount must be greater than 0" }),
	payment_type: z
		.enum(["tuition", "registration", "transport", "meals", "books", "other"], {
			error: "Please select a valid payment type",
		})
		.default("tuition"),
	payment_method: z
		.enum(["cash", "bank_transfer", "mobile_money", "cheque"], {
			error: "Please select a valid payment method",
		})
		.default("cash"),
	payment_status: z
		.enum(["pending", "completed", "failed", "refunded"], {
			error: "Please select a valid payment status",
		})
		.default("completed"),
	reference_number: z.string().trim().optional(),
	term: z
		.string({ error: "Term is required" })
		.trim()
		.min(1, { error: "Term must be specified" })
		.default("first"),
	academic_year: z
		.string({ error: "Academic year is required" })
		.trim()
		.min(4, { error: "Academic year must be at least 4 characters" }),
	due_date: z.iso.date().optional(),
	paid_date: z.iso.date().optional(),
	notes: z.string().trim().optional(),
	received_by: z.string({ error: "Receiver ID is required" }),
	school_id: z.string({ error: "School ID is required" }),
});

export const transaction_schema = z.object({
	school_id: z.string({ error: "School ID is required" }),
	subscription_id: z.string().optional(),
	amount: z
		.number({ error: "Amount is required" })
		.int()
		.min(1, { error: "Amount must be greater than 0" }),
	transaction_type: z
		.enum(["subscription", "upgrade", "addon", "penalty"], {
			error: "Please select a valid transaction type",
		})
		.default("subscription"),
	payment_method: z
		.enum(["bank_transfer", "mobile_money", "card", "paypal"], {
			error: "Please select a valid payment method",
		})
		.default("bank_transfer"),
	transaction_status: z
		.enum(["pending", "completed", "failed", "refunded"], {
			error: "Please select a valid transaction status",
		})
		.default("pending"),
	reference_number: z.string().trim().optional(),
	description: z.string().trim().optional(),
	processed_date: z.iso.date().optional(),
});

export const admission_schema = z.object({
	application_number: z
		.string({ error: "Application number is required" })
		.trim()
		.min(3, { error: "Application number must be at least 3 characters" }),
	first_name: z
		.string({ error: "First name is required" })
		.trim()
		.min(2, { error: "First name must be at least 2 characters long" }),
	middle_name: z.string().trim().optional(),
	last_name: z
		.string({ error: "Last name is required" })
		.trim()
		.min(2, { error: "Last name must be at least 2 characters long" }),
	email: z.email({ error: "Invalid email address" }).optional(),
	phone_number: z
		.string()
		.trim()
		.min(6, { error: "Phone number must be at least 6 characters long" })
		.optional(),
	gender: z.enum(["male", "female"], {
		error: "Please select a valid gender",
	}),
	date_of_birth: z.iso
		.date({ error: "Please select a valid date of birth" })
		.optional(),
	address: z.string().trim().optional(),
	guardian_name: z
		.string({ error: "Guardian name is required" })
		.trim()
		.min(2, { error: "Guardian name must be at least 2 characters long" }),
	guardian_phone: z
		.string({ error: "Guardian phone is required" })
		.trim()
		.min(6, { error: "Guardian phone must be at least 6 characters long" }),
	guardian_email: z
		.email({ error: "Invalid guardian email address" })
		.optional(),
	guardian_relationship: z.string().trim().default("parent"),
	previous_school: z.string().trim().optional(),
	class_applying_for: z.string({ error: "Class applying for is required" }),
	application_status: z
		.enum(["pending", "approved", "rejected", "enrolled"], {
			error: "Please select a valid application status",
		})
		.default("pending"),
	admission_date: z.iso.date().optional(),
	notes: z.string().trim().optional(),
	documents_submitted: z.string().optional(), // JSON string
	reviewed_by: z.string().optional(),
	school_id: z.string({ error: "School ID is required" }),
});
