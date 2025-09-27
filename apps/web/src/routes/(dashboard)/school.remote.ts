import { error, redirect } from "@sveltejs/kit";
import z from "zod";
import { form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import { cities } from "$lib/constants";
import type { School } from "$lib/types";
import { get_current_user } from "$lib/user";

const school_schema = z.object({
	school_id: z.string().trim().min(5, { error: "School ID is required" }),
	name: z
		.string({ error: "School name is required" })
		.trim()
		.min(2, { error: "School name must be at least 2 characters long" }),
	address: z
		.string({ error: "Address is required" })
		.trim()
		.min(5, { error: "Address must be at least 5 characters long" }),
	city: z.enum(cities, { error: "Please select a valid city" }),
	license: z
		.string({ error: "License is required" })
		.trim()
		.min(3, { error: "License must be at least 3 characters long" }),
	phone: z.string().trim().optional(),
	email: z.email().optional(),
	website: z.url().optional(),
});

export const get_school = query(z.string(), async (id) => {
	if (get_current_user() === null) {
		redirect(302, "/");
	}

	const { fetch } = getRequestEvent();

	const res = await fetch(`${API_ENDPOINT}/api/v1/schools/${id}`);
	const { message, data } = await res.json();

	if (!res.ok) {
		error(404, { message });
	}

	return data as School;
});

export const update_school = form(school_schema, async (parsed) => {
	const { cookies, fetch } = getRequestEvent();

	const res = await fetch(
		`${API_ENDPOINT}/api/v1/schools/${parsed.school_id}`,
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

	await get_school(parsed.school_id).refresh();

	return { message };
});
