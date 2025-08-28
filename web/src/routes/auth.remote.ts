import { redirect } from "@sveltejs/kit";
import { z } from "zod";
import { command, form, getRequestEvent } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";

const login_schema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(4, { error: "password should be more than 4 characters" }),
});

export const login = form(async (form_data) => {
	const {
		success,
		data: parsed,
		error,
	} = login_schema.safeParse(Object.fromEntries(form_data));

	if (!success) {
		return {
			message: "Please fix the errors below before submitting.",
			errors: z.treeifyError(error).properties,
		};
	}

	const { cookies, url } = getRequestEvent();
	let redirect_url = url.pathname;

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/auth/token`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parsed),
		});
		const { data, message } = await res.json();
		if (!res.ok) {
			return { message: String(message) };
		}

		cookies.set("token", data.token, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 1, // 1 days
		});

		redirect_url = "/business/onboarding";
	} catch (_e) {
		if (_e instanceof Error) {
			console.error(_e.message);
			return { message: _e.message };
		}
	}

	redirect(308, redirect_url);
});

export const google_oauth = command(() => ({
	redirect_url: `${API_ENDPOINT}/api/v1/auth/google`,
}));
