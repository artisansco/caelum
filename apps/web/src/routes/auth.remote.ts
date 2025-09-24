import { redirect } from "@sveltejs/kit";
import { z } from "zod";
import { form, getRequestEvent } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import { cities } from "$lib/constants";
import type { CurrentUser } from "$lib/types";

export const login = form(
	z.object({ email: z.email(), password: z.string() }),
	async (parsed) => {
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
	},
);

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
		.min(6, { error: "Password must be at least 6 characters long" }),
});

export const register = form(register_schema, async (parsed) => {
	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/schools`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parsed),
		});
		const { message, data } = await res.json();
		if (!res.ok) {
			return { message };
		}

		console.log(data);
	} catch (_e) {
		if (_e instanceof Error) {
			console.error(_e.message);
			return { message: _e.message };
		}
	}

	redirect(302, "/");
});

export function set_token(key: string, value: string, days = 1) {
	const { cookies } = getRequestEvent();

	cookies.set(key, value, {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * days, // number of days
	});
}

export function get_current_user() {
	const { cookies } = getRequestEvent();
	const token = cookies.get("token");
	if (!token) return null;

	try {
		const decoded = JSON.parse(
			Buffer.from(token.split(".")[1], "base64").toString(),
		);

		return decoded as CurrentUser;
	} catch (_e) {
		return null;
	}
}
