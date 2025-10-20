import { error } from "@sveltejs/kit";
import { database } from "$lib/server/database/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const { success, data, message } = await database.get_all_staff(
		params.school_id,
		{ limit: -1 },
	);

	if (!success) {
		error(500, message);
	}

	return {
		staff: data || [],
	};
};
