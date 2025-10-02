import { validator } from "hono/validator";
import z from "zod";

const assignment_schema = z.object({
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
		.max(10 * 1024 * 1024, {
			error: "File size too large. Maximum size is 10MB",
		})
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

export const validate_assignment = validator("form", (value, c) => {
	const { success, data, error } = assignment_schema.safeParse(value);
	if (!success) {
		const message = error.issues.at(0)?.message as string;
		return c.json({ status: "fail", message }, 401);
	}

	return data;
});
