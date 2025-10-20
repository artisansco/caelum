import { error } from "@sveltejs/kit";
import { database } from "$lib/server/database/queries";

export async function load({ params }) {
	const result = await database.get_student(params.student_id);

	if (!result.success) {
		error(404, result.message || "Student not found");
	}

	return {
		student: result.data,
	};
}
