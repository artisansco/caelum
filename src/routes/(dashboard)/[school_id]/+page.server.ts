import { ensure_authenticated } from "$lib/auth";
import { database } from "$lib/server/database/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	ensure_authenticated();
	const [
		{ success: students_success, data: students },
		{ success: staff_success, data: staff },
		{ success: assignments_success, data: assignments },
	] = await Promise.all([
		database.get_students(params.school_id, { limit: -1 }), // Get all students
		database.get_all_staff(params.school_id, { limit: -1 }), // Get all staff
		database.get_assignments(params.school_id),
	]);

	const students_data = students_success ? students || [] : [];
	const staff_data = staff_success ? staff || [] : [];
	const assignments_data = assignments_success ? assignments || [] : [];

	return {
		total_students: students_data.length,
		total_staff: staff_data.length,
		total_assignments: assignments_data.length,
	};
};
