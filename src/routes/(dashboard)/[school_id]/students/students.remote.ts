import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { student_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const get_all_students = query(v.string(), async (school_id) => {
	const event = getRequestEvent();
	const searchParams = event.url.searchParams;

	const _page = Math.max(1, Number(searchParams.get("page")) || 1);
	const page_size = Math.min(
		Math.max(1, Number(searchParams.get("page_size")) || 10),
		100,
	);

	const { success, data, message } = await database.get_students(school_id, {
		limit: page_size,
	});

	if (!success) {
		error(500, { message: message || "Failed to fetch students" });
	}

	return data;
});

export const get_student = query(v.string(), async (student_id) => {
	const { success, data, message } = await database.get_student(student_id);

	if (!success) {
		error(500, { message: message || "Failed to fetch student" });
	}

	if (!data) {
		error(404, { message: "Student not found" });
	}

	return data;
});

export const add_student = form(
	student_schema.omit({ student_id: true }),
	async (parsed) => {
		const { success, message } = await database.create_student({
			admission_number: parsed.admission_number,
			first_name: parsed.first_name,
			middle_name: parsed.middle_name,
			last_name: parsed.last_name,
			email: parsed.email,
			gender: parsed.gender,
			phone_number: parsed.phone_number,
			address: parsed.address,
			school_id: parsed.school_id,
			class_id: parsed.class_id,
			admission_date: parsed.admission_date,
		});

		if (!success) {
			return { message: message || "Student not created" };
		}

		redirect(308, "./");
	},
);

export const update_student = form(
	student_schema.omit({ admission_number: true, admission_date: true }),
	async (parsed) => {
		const { success, data, message } = await database.update_student(
			parsed.student_id,
			{
				first_name: parsed.first_name,
				middle_name: parsed.middle_name,
				last_name: parsed.last_name,
				email: parsed.email,
				gender: parsed.gender,
				phone_number: parsed.phone_number,
				address: parsed.address,
				school_id: parsed.school_id,
				class_id: parsed.class_id,
			},
		);

		if (!success) {
			return { message: message || "Student not updated" };
		}

		if (success) {
			const { success: refetchSuccess, data: refetchData } =
				await database.get_student(parsed.student_id);
			if (refetchSuccess && refetchData) {
				get_student(parsed.student_id).set(refetchData);
			}
		}
	},
);

export const delete_student = command(v.string(), async (student_id) => {
	const { success, message } = await database.delete_student(student_id);

	if (!success) {
		return { message: message || "Student not deleted" };
	}
});
