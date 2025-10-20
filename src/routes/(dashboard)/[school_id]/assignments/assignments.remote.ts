import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { command, form, query } from "$app/server";
import { assignment_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";
import { upload_file } from "$lib/upload";

export const get_assignments_query = query(v.string(), async (school_id) => {
	const { success, data, message } = await database.get_assignments(school_id);

	if (!success) {
		console.error(message);
		error(500, { message: message || "Failed to fetch assignments" });
	}

	return data || [];
});

export const upload_assignment = form(assignment_schema, async (parsed) => {
	const { success, message } = await database.create_assignment({
		title: parsed.title,
		due_date: parsed.due_date,
		file_name: await upload_file(parsed.file),
		class_id: parsed.class_id,
		description: parsed.description,
		school_id: parsed.school_id,
	});

	if (!success) {
		return { message: message || "Failed to create assignment" };
	}

	await get_assignments_query(parsed.school_id).refresh();
});

export const delete_assignment_command = command(
	v.object({
		assignment_id: v.string(),
		school_id: v.string(),
	}),
	async (parsed) => {
		const { success, message } = await database.delete_assignment(
			parsed.assignment_id,
		);

		if (!success) {
			return { message: message || "Failed to delete assignment" };
		}

		await get_assignments_query(parsed.school_id).refresh();
	},
);

// Export with original names for backwards compatibility
export const get_assignments = get_assignments_query;
export const delete_assignment = delete_assignment_command;
