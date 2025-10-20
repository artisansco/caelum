import { error } from "@sveltejs/kit";
import { database } from "$lib/server/database/queries";

export async function load({ params }) {
	const result = await database.get_staff(params.staff_id);

	if (!result.success) {
		error(404, result.message || "Staff not found");
	}

	return {
		staff: result.data,
	};
}
