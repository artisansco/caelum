import type { LayoutServerLoad } from "./$types";
import { require_student_auth, ensure_student_school } from "$lib/student-auth";
import { database } from "$lib/server/database/queries";

export const load: LayoutServerLoad = async ({ params }) => {
	// Check if student is authenticated
	const student = require_student_auth();

	// Ensure student belongs to this school
	ensure_student_school(student, params.school_id);

	// Get school info
	const school_result = await database.get_school(params.school_id);
	const school = school_result.success && school_result.data
		? school_result.data
		: null;

	// Get class info
	const class_result = await database.get_class(student.class_id);
	const class_info = class_result.success && class_result.data
		? class_result.data
		: null;

	return {
		student: {
			id: student.id,
			admission_number: student.admission_number,
			first_name: student.first_name,
			last_name: student.last_name,
			email: student.email,
		},
		school,
		class_info,
	};
};
