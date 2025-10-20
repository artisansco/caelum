import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { class_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const get_classes = query(v.string(), async (school_id) => {
	const { success, data, message } = await database.get_classes(school_id);

	if (!success) {
		console.error(message);
		return [];
	}

	return data || [];
});

export const add_class = form(class_schema, async (parsed) => {
	const { success, message } = await database.create_class({
		name: parsed.name,
		school_id: parsed.school_id,
	});

	if (!success) {
		return { message: message || "Failed to create class" };
	}

	return { message: "Class created successfully" };
});

export const delete_class = command(v.string(), async (class_id) => {
	const { locals } = getRequestEvent();

	const { success, message } = await database.delete_class(class_id);

	if (!success) {
		return { message: message || "Failed to delete class" };
	}

	await get_classes(locals.school_id).refresh();
	return { message: "Class deleted successfully" };
});
