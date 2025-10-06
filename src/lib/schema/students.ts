import { z } from "zod";

export const student_schema = z.object({
	first_name: z
		.string({ error: "First name is required" })
		.trim()
		.min(2, { error: "First name must be at least 2 characters long" }),
	middle_name: z
		.string({ error: "Middle name is required" })
		.trim()
		.min(2, { error: "Middle name must be at least 2 characters long" })
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
	phone_number: z
		.string({ error: "Invalid phone number" })
		.trim()
		.min(6, { error: "Phone number must be at least 6 characters long" }),
	school_id: z.string({ error: "school Id is required" }),
	student_id: z.string({ error: "student id is required" }),
});
