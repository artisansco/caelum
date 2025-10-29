import { redirect } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";
import jwt from "jsonwebtoken";
import { config } from "./config";
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

export function clear_token(key = "token") {
	const { cookies } = getRequestEvent();
	cookies.delete(key, { path: "/" });
}

export function get_current_user() {
	const { cookies, locals } = getRequestEvent();
	const token = cookies.get("token");
	if (!token) return null;

	try {
		// Use proper JWT verification with signature checking
		const decoded = jwt.verify(token, config.JWT_SECRET) as CurrentUser;

		locals.school_id = decoded.school_id;
		return decoded;
	} catch (error) {
		// Token invalid, expired, or signature mismatch
		console.error("JWT verification failed:", error);
		return null;
	}
}

export function ensure_authenticated(to = "/") {
	const user = get_current_user();
	if (!user) {
		redirect(308, to);
	}
}

export function check_permission(
	user: CurrentUser | null,
	permission: string,
): boolean {
	if (!user) return false;
	if (user.role === "admin") return true; // Admins have all permissions

	const permissions = user.permissions?.split(",") || [];
	return permissions.includes(permission);
}

export function ensure_permission(
	user: CurrentUser | null,
	permission: string,
) {
	if (!check_permission(user, permission)) {
		redirect(308, "/unauthorized");
	}
}
