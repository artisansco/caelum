import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { subject_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const get_subjects_query = query(async () => {
	const { locals } = getRequestEvent();

	const { success, data, message } = await database.get_subjects(
		locals.school_id,
	);

	if (!success) {
		console.error(message);
		return [];
	}

	return data || [];
});

export const add_subject = form(subject_schema, async (parsed) => {
	const { success, message } = await database.create_subject({
		name: parsed.name,
		code: parsed.code,
		school_id: parsed.school_id,
	});

	if (!success) {
		return { message: message || "Failed to create subject" };
	}

	await get_subjects_query().refresh();
	return { message: "Subject created successfully" };
});

export const delete_subject_command = command(
	v.string(),
	async (subject_id) => {
		const { success, message } = await database.delete_subject(subject_id);

		if (!success) {
			return { message: message || "Failed to delete subject" };
		}

		await get_subjects_query().refresh();
	},
);

// Export with original names for backwards compatibility
export const get_subjects = get_subjects_query;
export const delete_subject = delete_subject_command;
