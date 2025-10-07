import * as z from "zod";

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
