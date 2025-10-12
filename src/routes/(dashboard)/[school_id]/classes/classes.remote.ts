import { and, desc, eq } from "drizzle-orm";
import * as z from "zod";
import { command, form, query } from "$app/server";
import { db } from "$lib/db/drizzle";
import { classes_table } from "$lib/db/schema";
import { class_schema } from "$lib/schemas";

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

export const add_class = form(class_schema, async (parsed) => {
	try {
		await db.insert(classes_table).values(parsed).returning();

		await get_classes(parsed.school_id).refresh();
		return { message: "class created successfully" };
	} catch (_e) {
		console.log(_e);
		// @ts-expect-error
		return { message: _e.message };
	}
});

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
		}
	},
);
