import { redirect } from "@sveltejs/kit";
import { z } from "zod";
import { form, getRequestEvent } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import { cities } from "$lib/constants";

const register_schema = z.object({
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
	city: z.enum(cities, { error: "City is invalid or not in the list" }),
	email: z.email(),
	password: z
		.string()
		.min(8, { error: "Password must be at least 8 characters long" }),
});

export const register = form(async (form_data) => {
	const form = Object.fromEntries(form_data);
	const { success, data: parsed, error } = register_schema.safeParse(form);

	if (!success) {
		const message = error.issues.at(0)?.message;
		return { message, errors: z.treeifyError(error).properties };
	}

	console.log(parsed);

	const { url, cookies } = getRequestEvent();
	let redirect_url = url.pathname;

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/schools`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
			body: JSON.stringify(parsed),
		});
		const { data } = await res.json();
		console.log(data);

		redirect_url = `/business/${data?.id}`;
	} catch (_e) {
		if (_e instanceof Error) {
			console.error(_e.message);
			return { message: _e.message };
		}
	}

	// redirect(302, redirect_url);
});
