import { eq } from "drizzle-orm";
import * as z from "zod";
import { command, form, query } from "$app/server";
import { db } from "$lib/db/drizzle";
import { subjects_table } from "$lib/db/schema";
import { subject_schema } from "$lib/schemas";

export const get_subjects = query(z.string(), async (school_id) => {
	try {
		const subjects = await db.query.subjects_table.findMany({
			where: eq(subjects_table.school_id, school_id),
		});

		return subjects;
	} catch (_e) {
		return [];
	}
});

export const add_subject = form(subject_schema, async (parsed) => {
	try {
		await db.insert(subjects_table).values(parsed);

		await get_subjects(parsed.school_id).refresh();
		return { message: "subject created successfully" };
	} catch (_e) {
		//@ts-expect-error
		return { message: _e.message };
	}
});

export const delete_subject = command(z.string(), async (subject_id) => {
	try {
		await db.delete(subjects_table).where(eq(subjects_table.id, subject_id));

		// await get_subjects().refresh();
	} catch (_e) {
		console.log(_e);
	}
});
