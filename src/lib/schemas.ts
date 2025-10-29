import * as z from "zod";
import * as v from "valibot";
import {
	announcement_audience,
	announcement_priority,
	announcement_types,
	cities,
	grade_types,
	payment_methods,
	payment_types,
	school_terms,
	transaction_types,
} from "./constants";

// Password validation schema with complexity requirements
export const password_schema = v.pipe(
	v.string("Password is required"),
	v.minLength(8, "Password must be at least 8 characters"),
	v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
	v.regex(/[a-z]/, "Password must contain at least one lowercase letter"),
	v.regex(/[0-9]/, "Password must contain at least one number"),
	v.regex(
		/[^A-Za-z0-9]/,
		"Password must contain at least one special character",
	),
);

export const assignment_schema = z.object({
	school_id: z.string(),
	class_id: z.string({ error: "class is required" }),
	title: z
		.string({ error: "title is required" })
		.trim()
		.min(2, { error: "title must be at least 2 characters long" }),
	description: z
		.string()
		.trim()
		.min(10, { error: "description must be at least 10 characters long" }),
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
		.min(8, { error: "Password must be at least 8 characters long" })
		.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
		.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
		.regex(/[0-9]/, { message: "Password must contain at least one number" })
		.regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
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
	email: z.email().or(z.literal("")).optional(),
	website: z.url().or(z.literal("")).optional(),
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
	gender: z.enum(["male", "female"]),
	phone_number: z
		.string({ error: "Invalid phone number" })
		.trim()
		.min(6, { error: "Phone number must be at least 6 characters long" }),
	school_id: z.string({ error: "school Id is required" }),
	student_id: z.string({ error: "student id is required" }),
	class_id: z.string({ error: "select a class" }),
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
	priority: z
		.enum(announcement_priority, { error: "invalid priority" })
		.default("low"),
	type: z.enum(announcement_types, { error: "Please select a valid type" }),
	target_audience: z.enum(announcement_audience).default("all"),
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
	notes: z
		.string()
		.trim()
		.min(4, { error: "notes is too small, 4 or more characters" })
		.or(z.literal(""))
		.optional(),
});

export const grade_schema = z
	.object({
		student_id: z.string({ error: "Student ID is required" }),
		subject_id: z.string({ error: "Subject ID is required" }),
		school_id: z.string({ error: "School ID is required" }),
		graded_by: z.string({ error: "Grader ID is required" }),
		grade_type: z
			.enum(grade_types, { error: "Please select a valid grade type" })
			.default("assignment"),
		max_score: z.number().int().min(1).max(100).default(100),
		actual_score: z
			.number({ error: "Actual score is required" })
			.min(0, { error: "Score cannot be negative" }),
		term: z.enum(school_terms, { error: "Term is required" }).default("first"),
		academic_year: z
			.string({ error: "Academic year is required" })
			.trim()
			.min(4, { error: "Academic year must be at least 4 characters" })
			.max(4, { error: "Academic year must be at most 4 characters" }),
		notes: z
			.string()
			.trim()
			.min(4, { error: "Notes is too small, 4 or more characters" })
			.or(z.literal(""))
			.optional(),
	})
	.refine((data) => data.actual_score <= data.max_score, {
		message: "Actual score cannot be greater than max score",
		abort: true,
		path: ["actual_score"],
	});

export const payment_schema = z.object({
	student_id: z.string({ error: "Student ID is required" }),
	received_by: z.string({ error: "Receiver ID is required" }),
	school_id: z.string({ error: "School ID is required" }),
	amount: z
		.number({ error: "Amount is required" })
		.min(1, { error: "Amount must be greater than 0" }),
	payment_type: z
		.enum(payment_types, { error: "Please select a valid payment type" })
		.default("tuition"),
	payment_method: z
		.enum(payment_methods, { error: "Please select a valid payment method" })
		.default("cash"),
	term: z
		.enum(school_terms, { error: "Term is required" })
		.default("first")
		.or(z.literal(""))
		.optional(),
	academic_year: z
		.string({ error: "Academic year is required" })
		.trim()
		.min(4, { error: "Academic year must be at least 4 characters" })
		.max(4, { error: "Academic year must be at most 4 characters" })
		.or(z.literal(""))
		.optional(),
	payment_date: z.iso.date(),
	notes: z
		.string()
		.trim()
		.min(10, { error: "Notes is too small, 10 or more characters" })
		.or(z.literal(""))
		.optional(),
});

export const transaction_schema = z.object({
	school_id: z.string({ error: "School ID is required" }),
	subscription_id: z.string({ error: "Subscription ID is required" }),
	amount: z
		.number({ error: "Amount is required" })
		.int()
		.min(1, { error: "Amount must be greater than 0" }),
	transaction_type: z
		.enum(transaction_types, { error: "select a valid transaction type" })
		.default("subscription"),
	payment_method: z
		.enum(payment_methods, { error: "Please select a valid payment method" })
		.default("mobile_money"),
	// reference_number: z.string().trim().optional(),
	description: z
		.string()
		.trim()
		.min(10, { error: "Description is required" })
		.or(z.literal(""))
		.optional(),
});
