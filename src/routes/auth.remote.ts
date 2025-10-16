import { redirect } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import * as v from "valibot";
import * as z from "zod";
import { command, form, getRequestEvent } from "$app/server";
import { set_token } from "$lib/auth";
import { config } from "$lib/config";
import { db } from "$lib/db/drizzle";
import { schools_table, staff_table } from "$lib/db/schema";
import { school_schema } from "$lib/schemas";

export const login = form(
	v.object({ email: v.pipe(v.string(), v.email()), password: v.string() }),
	async (parsed) => {
		const user = await db.query.staff_table.findFirst({
			where: eq(staff_table.email, parsed.email),
			columns: { id: true, password: true, school_id: true },
		});

		if (!user || !bcrypt.compare(parsed.password, user.password)) {
			return { message: "invalid email or password" };
		}

		const token = jwt.sign(
			{ id: user.id, school_id: user.school_id },
			config.JWT_SECRET,
			{ expiresIn: "1d" },
		);

		set_token("token", token);
		redirect(302, user.school_id);
	},
);

export const register = form(
	school_schema.extend({
		password: z.string(),
	}),
	async (parsed) => {
		try {
			const [school] = await db
				.insert(schools_table)
				.values({
					name: parsed.name,
					address: parsed.address,
					city: parsed.city,
					logo_url: `https://placehold.co/100?text=${parsed.name[0]}`,
				})
				.returning({ id: schools_table.id });

			await db.insert(staff_table).values({
				staff_id: nanoid(),
				first_name: "School",
				last_name: "Admin",
				role: "admin",
				address: parsed.address,
				contact: "",
				email: parsed.email,
				password: parsed.password,
				school_id: school.id,
				employed_date: new Date().toISOString(),
			});
		} catch (_e) {
			console.log(_e);
			return { message: "failed to register new school" };
		}

		redirect(302, "/");
	},
);

export const logout = command(async () => {
	const { cookies } = getRequestEvent();
	cookies.delete("token", { path: "/" });
});
