import { and, desc, eq, getTableColumns } from "drizzle-orm";
import z from "zod";
import { command, form, query } from "$app/server";
import { db } from "$lib/db/drizzle";
import {
	classes_table,
	plans_table,
	schools_table,
	subscriptions_table,
} from "$lib/db/schema";
import { school_schema } from "$lib/schema/schools";

export const get_school = query(z.string(), async (school_id) => {
	// guard_route();

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
	try {
		const classes = await db.query.classes_table.findMany({
			where: eq(classes_table.school_id, school_id),
			orderBy: desc(classes_table.created_at),
		});

		return classes;
	} catch (_e) {
		console.log(_e);
		return [];
	}
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
		try {
			await db.insert(classes_table).values(parsed).returning();

			await get_classes(parsed.school_id).refresh();
			return { message: "class created successfully" };
		} catch (_e) {
			console.log(_e);
			// @ts-expect-error
			return { message: _e.message };
		}
	},
);

export const delete_class = command(
	z.object({
		school_id: z.string(),
		class_id: z.string(),
	}),
	async (parsed) => {
		try {
			await db
				.delete(classes_table)
				.where(
					and(
						eq(classes_table.id, parsed.class_id),
						eq(classes_table.school_id, parsed.school_id),
					),
				);

			await get_classes(parsed.school_id).refresh();
			return { message: "class deleted successfully" };
		} catch (_e) {
			console.log(_e);
			// @ts-expect-error
			return { message: _e.message };
		}
	},
);
