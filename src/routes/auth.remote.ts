import { redirect } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as v from "valibot";
import * as z from "zod";
import { command, form, getRequestEvent } from "$app/server";
import { set_token } from "$lib/auth";
import { config } from "$lib/config";
import { school_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const login = form(
	v.object({ email: v.pipe(v.string(), v.email()), password: v.string() }),
	async (parsed) => {
		const { success, data } = await database.get_staff_by_email(parsed.email);

		if (!success) {
			return { message: "Invalid email or password" };
		}

		if (!bcrypt.compare(parsed.password, String(data?.password))) {
			return { message: "Invalid email or password" };
		}

		const token = jwt.sign(
			{ id: data?.id, school_id: data?.school_id },
			config.JWT_SECRET,
			{ expiresIn: "1d" },
		);

		set_token("token", token);
		redirect(302, data?.school_id as string);
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
