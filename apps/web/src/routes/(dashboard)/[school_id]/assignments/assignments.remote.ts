import { error } from "@sveltejs/kit";
import z from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import { get_current_user } from "$lib/auth";
import type { Assignment } from "$lib/types";

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

export const get_assignments = query(z.string(), async (school_id) => {
	const { fetch, cookies } = getRequestEvent();

	const res = await fetch(
		`${API_ENDPOINT}/api/v1/schools/${school_id}/assignments`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
		},
	);
	const { message, data } = await res.json();

	if (!res.ok) {
		error(404, { message });
	}
	return data.assignments as Assignment[];
});

export const upload_assignment = form(assignment_schema, async (parsed) => {
	const { cookies, fetch } = getRequestEvent();

	const form_data = new FormData();
	for (const [key, value] of Object.entries(parsed)) {
		form_data.append(key, value);
	}

	try {
		const res = await fetch(
			`${API_ENDPOINT}/api/v1/schools/${parsed.school_id}/assignments`,
			{
				method: "POST",
				headers: { Authorization: `Bearer ${cookies.get("token")}` },
				body: form_data,
			},
		);
		const { message } = await res.json();

		if (!res.ok) {
			return { message };
		}

		await get_assignments(parsed.school_id).refresh();
	} catch (_e) {
		console.log(_e);
	}
});

export const delete_assignment = command(
	z.string().trim(),
	async (assignment_id) => {
		const { cookies, fetch } = getRequestEvent();
		// biome-ignore lint/style/noNonNullAssertion: <>
		const { school_id } = get_current_user()!;

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/assignments/${assignment_id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
				},
			);
			const { message } = await res.json();

			if (!res.ok) {
				return { message };
			}

			await get_assignments(school_id).refresh();
		} catch (_e) {
			console.log(_e);
		}
	},
);
