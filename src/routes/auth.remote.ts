import { redirect } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as v from "valibot";
import * as z from "zod";
import { command, form, getRequestEvent } from "$app/server";
import { set_token } from "$lib/auth";
import { config } from "$lib/config";
import {
	check_rate_limit,
	reset_rate_limit,
} from "$lib/rate-limit";
import { school_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const login = form(
	v.object({ email: v.pipe(v.string(), v.email()), password: v.string() }),
	async (parsed) => {
		// Get client IP for rate limiting
		const { request } = getRequestEvent();
		const client_ip =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("x-real-ip") ||
			"unknown";

		// Check rate limit
		const rate_limit = check_rate_limit(client_ip);
		if (!rate_limit.allowed) {
			const minutes_until_reset = rate_limit.blocked_until
				? Math.ceil(
						(rate_limit.blocked_until.getTime() - Date.now()) / 1000 / 60,
					)
				: 30;
			return {
				message: `Too many login attempts. Please try again in ${minutes_until_reset} minutes.`,
			};
		}

		const { success, data } = await database.get_staff_by_email(parsed.email);

		if (!success || !data) {
			return { message: "Invalid email or password" };
		}

		const password_match = await bcrypt.compare(
			parsed.password,
			String(data.password),
		);

		if (!password_match) {
			return { message: "Invalid email or password" };
		}

		// Reset rate limit on successful login
		reset_rate_limit(client_ip);

		// Create JWT with full user data
		const token = jwt.sign(
			{
				id: data.id,
				school_id: data.school_id,
				role: data.role,
				permissions: data.permissions,
				email: data.email,
			},
			config.JWT_SECRET,
			{ expiresIn: "1d" },
		);

		set_token("token", token);
		redirect(302, data.school_id as string);
	},
);

export const register = form(
	school_schema.extend({
		password: z.string(),
	}),
	async (parsed) => {
		const { success, message } = await database.register_school({
			name: parsed.name,
			address: parsed.address,
			city: parsed.city,
			email: parsed.email as string,
			password: parsed.password,
		});

		if (!success) {
			return { message: message || "Failed to register new school" };
		}

		redirect(302, "/");
	},
);

export const logout = command(async () => {
	const { cookies } = getRequestEvent();

	cookies.delete("token", { path: "/" });
});
