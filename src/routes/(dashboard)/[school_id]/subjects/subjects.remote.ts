import { desc, eq } from "drizzle-orm";
import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { db, subjects_table } from "$lib/db";
import { subject_schema } from "$lib/schemas";

export const get_subjects = query(async () => {
	const { locals } = getRequestEvent();

	try {
		const subjects = await db.query.subjects_table.findMany({
			where: eq(subjects_table.school_id, locals.school_id),
			orderBy: desc(subjects_table.created_at),
		});

		return subjects;
	} catch (_e) {
		return [];
	}
});

export const add_subject = form(subject_schema, async (parsed) => {
	try {
		await db.insert(subjects_table).values(parsed);

		await get_subjects().refresh();
		return { message: "subject created successfully" };
	} catch (_e) {
		//@ts-expect-error
		return { message: _e.message };
	}
});

export const delete_subject = command(v.string(), async (subject_id) => {
	try {
		await db.delete(subjects_table).where(eq(subjects_table.id, subject_id));
		await get_subjects().refresh();
	} catch (_e) {
		console.log(_e);
	}
});
