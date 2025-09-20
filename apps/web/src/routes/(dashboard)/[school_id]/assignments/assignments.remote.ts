import z from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import type { Assignment } from "$lib/types";

const assignment_schema = z.object({
	school_id: z.string(),
	class_id: z.string(),
	title: z.string().trim().min(2),
	description: z.string().trim().optional(),
	due_date: z.iso.date(),
	file: z.file().optional(),
});

/*
if (!allowedTypes.includes(file.type)) {
			return fail(400, {
				error:
					"Invalid file type. Only PDF, DOC, DOCX, PPT, and PPTX files are allowed",
				title,
				description,
				classId,
				dueDate,
			});
		}

		// Validate file size (10MB limit)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return fail(400, {
				error: "File size too large. Maximum size is 10MB",
				title,
				description,
				classId,
				dueDate,
			});
		}
*/

export const get_assignments = query(
	z.string().trim().min(5),
	async (school_id) => {
		// TODO: collect the school_id from getRequestEvent when supported

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/assignments`,
			);
			const { message, data } = await res.json();

			if (!res.ok) {
				return { message };
			}

			return data.assignments as Assignment[];
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

export const upload_assignment = form(async (form_data) => {
	const form = Object.fromEntries(form_data);
	const { success, data: parsed, error } = assignment_schema.safeParse(form);

	if (!success) {
		const message = error.issues.at(0)?.message;
		return { message };
	}

	const { cookies } = getRequestEvent();
	try {
		const res = await fetch(
			`${API_ENDPOINT}/api/v1/schools/${parsed.school_id}/assignments`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authentication: `Bearer ${cookies.get("token")}`,
				},
				body: JSON.stringify(parsed),
			},
		);
		const { message } = await res.json();

		if (!res.ok) {
			return { message };
		}

		get_assignments(parsed.school_id).refresh();
	} catch (_e) {
		console.log(_e);
	}
});

export const delete_assignment = command(
	z.object({
		school_id: z.string().trim(),
		assignment_id: z.string().trim(),
	}),
	async ({ school_id, assignment_id }) => {
		const { cookies } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/assignments/${assignment_id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authentication: `Bearer ${cookies.get("token")}`,
					},
				},
			);
			const { message } = await res.json();

			if (!res.ok) {
				return { message };
			}

			get_assignments(school_id).refresh();
		} catch (_e) {
			console.log(_e);
		}
	},
);

const classes = [
	{
		id: crypto.randomUUID(),
		name: "Grade 10",
		schoolId: "019962d7-0dbc-7732-a799-0f533a2d49fd",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: crypto.randomUUID(),
		name: "Grade 9",
		schoolId: "019962d7-2af0-72f2-9145-ebc06e942d38",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: crypto.randomUUID(),
		name: "Grade 11",
		schoolId: "019962d7-4d3c-71a0-b310-83949279c6a3",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: crypto.randomUUID(),
		name: "Grade 8",
		schoolId: "019962d7-65e2-7ac3-b694-245b7b6a902b",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: crypto.randomUUID(),
		name: "Grade 12",
		schoolId: "0199686e-8fa9-70b3-8e7c-299a2462f469",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: crypto.randomUUID(),
		name: "Grade 13",
		schoolId: "0199686e-a7ad-7241-9615-507db33645aa",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

export const get_classes = query(async () => classes);
