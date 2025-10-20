import { database } from "$lib/server/database/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const [
		{ success: assignmentsSuccess, data: assignments },
		{ success: classesSuccess, data: classes },
	] = await Promise.all([
		database.get_assignments(params.school_id),
		database.get_classes(params.school_id),
	]);

	const assignmentsData = assignmentsSuccess ? assignments || [] : [];
	const classesData = classesSuccess ? classes || [] : [];

	return {
		assignments: assignmentsData,
		classes: classesData,
	};
};
