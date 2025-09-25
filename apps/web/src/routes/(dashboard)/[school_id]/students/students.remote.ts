import { error, redirect } from "@sveltejs/kit";
import z from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import type { Student } from "$lib/types";

const student_schema = z.object({
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
	school_id: z
		.string({ error: "school Id is required" })
		.trim()
		.min(2, { error: "School ID must be at least 2 characters long" }),
	student_id: z
		.string({ error: "student Id is required" })
		.trim()
		.min(2, { error: "Student ID must be at least 2 characters long" }),
});

export const get_all_students = query(async () => {
	const { fetch } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/students`);
		const { message, data } = await res.json();

		if (!res.ok) {
			return { message };
		}

		return data.students;
	} catch (_e) {
		return { message: _e.message };
	}
});

export const get_student_by_id = query(z.string().trim(), async (id) => {
	const { fetch } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/students/${id}`);
		const { message, data } = await res.json();
		if (!res.ok) {
			console.log(message);
			error(404, { message });
		}

		return data as Student;
	} catch (_e) {
		console.log(_e);
		error(404, { message: _e.message });
	}
});

export const add_student = form(student_schema, async (parsed) => {
	const { fetch, cookies } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/students`, {
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
	} catch (_e) {
		console.log(_e);
		return { message: _e.message };
	}

	redirect(308, "./");
});

export const update_student = form(
	student_schema.omit({ admission_number: true, admission_date: true }),
	async (parsed) => {
		const { fetch, cookies } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/students/${parsed.student_id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
					body: JSON.stringify(parsed),
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_student_by_id(parsed.student_id).refresh();
		} catch (_e) {
			console.log(_e);
			return { message: _e.message };
		}
	},
);

export const delete_student = command(z.string(), async (id) => {
	const { fetch, cookies } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/students/${id}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${cookies.get("token")}` },
		});
		const { message } = await res.json();
		if (!res.ok) {
			return { message };
		}
	} catch (_e) {
		console.log(_e);
	}
});
