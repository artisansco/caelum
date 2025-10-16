import { and, desc, eq } from "drizzle-orm";
import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { classes_table, db } from "$lib/db";
import { class_schema } from "$lib/schemas";

export const get_classes = query(v.string(), async (school_id) => {
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
		await db.insert(classes_table).values(parsed);

		// await get_classes(parsed.school_id).refresh();
		return { message: "class created successfully" };
	} catch (_e) {
		console.log(_e);
		// @ts-expect-error
		return { message: _e.message };
	}
});

export const delete_class = command(v.string(), async (class_id) => {
	const { locals } = getRequestEvent();

	try {
		await db
			.delete(classes_table)
			.where(
				and(
					eq(classes_table.id, class_id),
					eq(classes_table.school_id, locals.school_id),
				),
			);

		await get_classes(locals.school_id).refresh();
		return { message: "class deleted successfully" };
	} catch (_e) {
		console.log(_e);
	}
});
