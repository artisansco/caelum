import { redirect } from "@sveltejs/kit";
import { z } from "zod";
import { form } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import { set_token } from "$lib/helpers";

const login_schema = z.object({ email: z.email(), password: z.string() });

export const login = form(async (form_data) => {
	const form = Object.fromEntries(form_data);
	const { success, data: parsed, error } = login_schema.safeParse(form);

	if (!success) {
		return {
			message: "Please fix the errors below before submitting.",
			errors: z.treeifyError(error).properties,
		};
	}

	let redirect_to = "/";

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/auth/token`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parsed),
		});
		const { message, data } = await res.json();
		if (!res.ok) {
			console.log(message);
			return { message: String(message) };
		}

		set_token("token", data.token);

		redirect_to = `/${data.school_id}`;
	} catch (_e) {
		if (_e instanceof Error) {
			console.error(_e.message);
			return { message: _e.message };
		}
	}

	redirect(302, redirect_to);
});
