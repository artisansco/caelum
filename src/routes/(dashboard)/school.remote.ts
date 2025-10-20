import * as v from "valibot";
import { form, query } from "$app/server";
import { school_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const get_school = query(v.string(), async (school_id) => {
	const { success, message, data } = await database.get_school(school_id);

	if (!success) {
		console.error(message);
		return;
	}

	return data;
});

export const update_school = form(school_schema, async (parsed) => {
	const { success, message } = await database.update_school(parsed.school_id, {
		name: parsed.name,
		address: parsed.address,
		city: parsed.city,
		license: parsed.license,
	});

	if (!success) {
		return { message: message || "Failed to update school" };
	}

	await get_school(parsed.school_id).refresh();
});
