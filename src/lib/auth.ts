import { redirect } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";
import type { CurrentUser } from "./types";

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
	const { cookies, locals } = getRequestEvent();
	const token = cookies.get("token");
	if (!token) return null;

	try {
		const decoded = JSON.parse(
			Buffer.from(token.split(".")[1], "base64").toString(),
		);

		const user = decoded as CurrentUser;

		locals.school_id = user.school_id;
		return user;
	} catch (_e) {
		return null;
	}
}

export function guard_route(to = "/") {
	const user = get_current_user();
	if (!user) {
		redirect(308, to);
	}
}
