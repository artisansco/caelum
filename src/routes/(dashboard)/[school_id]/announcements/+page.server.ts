import { error } from "@sveltejs/kit";
import { ensure_authenticated } from "$lib/auth";
import { database } from "$lib/server/database/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	ensure_authenticated();
	const { success, data, message } = await database.get_announcements(
		params.school_id,
	);

	if (!success) {
		error(500, message);
	}

	return {
		announcements: data || [],
	};
};
