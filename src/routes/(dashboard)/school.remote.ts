import { error } from "@sveltejs/kit";
import { desc, eq, getTableColumns } from "drizzle-orm";
import z from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import { guard_route } from "$lib/auth";
import { db } from "$lib/db/drizzle";
import {
	plans_table,
	schools_table,
	subscriptions_table,
} from "$lib/db/schema";
import { school_schema } from "$lib/schema/schools";
import type { Class } from "$lib/types";

export const get_school = query(z.string(), async (school_id) => {
	guard_route();

	const [school] = await db
		.select({
			...getTableColumns(schools_table),
			// id: schools_table.id,
			// name: schools_table.name,
			// address: schools_table.address,
			// license: schools_table.license,
			// city: schools_table.city,
			// logo_url: schools_table.logo_url,
			// created_at: schools_table.created_at,
			// updated_at: schools_table.updated_at,
			current_plan: {
				id: plans_table.id,
				name: plans_table.name,
			},
		})
		.from(schools_table)
		.leftJoin(
			subscriptions_table,
			eq(subscriptions_table.school_id, schools_table.id),
		)
		.leftJoin(plans_table, eq(plans_table.id, subscriptions_table.plan_id))
		.orderBy(desc(subscriptions_table.created_at))
		.where(eq(schools_table.id, school_id))
		.limit(1);

	// return {
	// 	message: "school fetched successfully"
	// };

	return school;
});

export const update_school = form(school_schema, async (parsed) => {
	try {
		await db
			.update(schools_table)
			.set({
				name: parsed.name,
				address: parsed.address,
				city: parsed.city,
				license: parsed.license,
			})
			.where(eq(schools_table.id, parsed.school_id))
			.returning();

		await get_school(parsed.school_id).refresh();
	} catch (_e) {
		console.log(_e);
		return { message: "failed to update school" };
	}
});

/* ==================== Classes RF for school ============================ */
export const get_classes = query(z.string(), async (school_id) => {
	const { fetch, cookies } = getRequestEvent();

	const res = await fetch(
		`${API_ENDPOINT}/api/v1/schools/${school_id}/classes`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
		},
	);
	const { message, data } = await res.json();

	if (!res.ok) {
		console.log(message);
		return [] as Class[];
	}

	return data.classes as Class[];
});

export const add_class = form(
	z.object({
		school_id: z.string(),
		name: z
			.string()
			.trim()
			.min(2, { error: "Name must be at least 2 characters long" }),
	}),
	async (parsed) => {
		const { cookies, fetch } = getRequestEvent();

		const res = await fetch(
			`${API_ENDPOINT}/api/v1/schools/${parsed.school_id}/classes`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${cookies.get("token")}`,
				},
				body: JSON.stringify({ name: parsed.name }),
			},
		);
		const { message } = await res.json();

		if (!res.ok) {
			return { message };
		}

		await get_classes(parsed.school_id).refresh();

		return { message };
	},
);

export const delete_class = command(
	z.object({
		school_id: z.string(),
		class_id: z.string(),
	}),
	async ({ school_id, class_id }) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/classes/${class_id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_classes(school_id).refresh();
		} catch (_e) {
			//@ts-expect-error
			return { message: _e.message };
		}
	},
);
