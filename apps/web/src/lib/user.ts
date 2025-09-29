import { redirect } from "@sveltejs/kit";
import z from "zod";
import { getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import type { CurrentUser, School } from "./types";

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

/** @deprecated - use the one in the $lib/auth.ts */
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
