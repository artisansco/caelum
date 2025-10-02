import { redirect } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";
import type { CurrentUser } from "./types";

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

export function guard_route(to = "/") {
	const user = get_current_user();
	if (!user) {
		redirect(308, to);
	}
}
