import { error, redirect } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
import * as z from "zod";
import { command, form, query } from "$app/server";
import { db } from "$lib/db/drizzle";
import { students_table } from "$lib/db/schema";
import { student_schema } from "$lib/schema/students";

export const get_all_students = query(z.string(), async (school_id) => {
	const students = await db.query.students_table.findMany({
		where: eq(students_table.school_id, school_id),
		orderBy: desc(students_table.created_at),
		limit: 10,
	});

	// return { message: "students fetched successfully" };

	return students;
});

export const get_student = query(z.string().trim(), async (student_id) => {
	const student = await db.query.students_table.findFirst({
		where: eq(students_table.id, student_id),
	});

	if (!student) error(404, { message: "Student not found" });

	return student;
});

export const add_student = form(
	student_schema.omit({ student_id: true }),
	async (parsed) => {
		try {
			await db
				.insert(students_table)
				.values({ ...parsed, gender: "male" })
				.returning();
		} catch (_e) {
			console.error(_e);
			return { message: "Student not created" };
		}

		// return { message: "User created successfully" };

		redirect(308, "./");
	},
);

export const update_student = form(
	student_schema.omit({ admission_number: true, admission_date: true }),
	async (parsed) => {
		try {
			const [student] = await db
				.update(students_table)
				.set({ ...parsed })
				.where(eq(students_table.id, parsed.student_id))
				.returning();

			get_student(parsed.student_id).set(student);
		} catch (_e) {
			console.error(_e);
			return { message: "Student not updated" };
		}

		// return { message: "User updated successfully" };
	},
);

export const delete_student = command(z.string(), async (student_id) => {
	try {
		await db.delete(students_table).where(eq(students_table.id, student_id));

		// return { message: "User deleted successfully" };
	} catch (_e) {
		console.log(_e);
		return { message: "Student not deleted" };
	}
});
