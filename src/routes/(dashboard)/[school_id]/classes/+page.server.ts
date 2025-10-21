import { error } from "@sveltejs/kit";
import { database } from "$lib/server/database/queries";
import { ensure_authenticated } from "$lib/auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	ensure_authenticated();
	const { success, data, message } = await database.get_classes(
		params.school_id,
	);

	if (!success) {
		error(500, message);
	}

	return {
		classes: data || [],
	};
};
