import { z } from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import { get_classes } from "../assignments/assignments.remote";

const subject_schema = z.object({
	name: z
		.string()
		.trim()
		.min(2, { error: "subject name is too small, 2 or more characters" }),
	code: z
		.string()
		.trim()
		.min(4, { error: "subject code is too small, 4 or more characters" })
		.optional(),
});

export const get_all_subjects = query(async () => {
	const { fetch } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/subjects`);
		const { message, data } = await res.json();
		if (!res.ok) {
			return { message };
		}

		return data.subjects;
	} catch (_e) {
		//@ts-expect-error
		return { message: _e.message };
	}
});

export const add_subject = form(subject_schema, async (parsed) => {
	const { cookies, fetch } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/subjects`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
			body: JSON.stringify(parsed),
		});
		const { message } = await res.json();
		if (!res.ok) {
			return { message };
		}

		await get_all_subjects().refresh();
	} catch (_e) {
		//@ts-expect-error
		return { message: _e.message };
	}
});

export const delete_subject = command("unchecked", async (subject_id) => {
	const { cookies, fetch } = getRequestEvent();
	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/subjects/${subject_id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
		});
		const { message } = await res.json();
		if (!res.ok) {
			return { message };
		}

		await get_all_subjects().refresh();
	} catch (_e) {
		//@ts-expect-error
		return { message: _e.message };
	}
});

export const add_class = form(
	z.object({
		school_id: z.string(),
		name: z
			.string()
			.trim()
			.min(2, { error: "Name must be at least 2 characters long" }),
	}),
	async (parsed) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${parsed.school_id}/classes`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
					body: JSON.stringify({ name: parsed.name }),
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_classes().refresh();
		} catch (_e) {
			//@ts-expect-error
			return { message: _e.message };
		}
	},
);

export const delete_class = command(
	z.object({
		school_id: z.string(),
		class_id: z.string(),
	}),
	async ({ school_id, class_id }) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/classes/${class_id}`,
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

			await get_classes().refresh();
		} catch (_e) {
			//@ts-expect-error
			return { message: _e.message };
		}
	},
);
