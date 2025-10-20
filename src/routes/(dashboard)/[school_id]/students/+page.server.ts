import { error } from "@sveltejs/kit";
import { database } from "$lib/server/database/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const { success, data, message } = await database.get_students(
		params.school_id,
		{ limit: 10 },
	);

	if (!success) {
		error(500, message);
	}

	return {
		students: data || [],
	};
};
