import * as z from "zod";
import { cities, student_statuses } from "./constants";

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
		.string({ error: "middle name must be a string" })
		.trim()
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
		.min(2, { error: "Middle name must be at least 2 characters long" })
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
