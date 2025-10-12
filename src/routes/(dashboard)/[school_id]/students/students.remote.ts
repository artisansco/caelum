import { error, redirect } from "@sveltejs/kit";
import { desc, eq, getTableColumns } from "drizzle-orm";
import * as v from "valibot";
import { command, form, query } from "$app/server";
import { classes_table, db, students_table } from "$lib/db";
import { student_schema } from "$lib/schemas";

export const get_all_students = query(v.string(), async (school_id) => {
	const students = await db
		.select({
			...getTableColumns(students_table),
			class: getTableColumns(classes_table),
		})
		.from(students_table)
		.leftJoin(
			classes_table,
			eq(classes_table.school_id, students_table.school_id),
		)
		.where(eq(students_table.school_id, school_id))
		.orderBy(desc(students_table.created_at))
		.limit(10);

	return students;
});

export const get_student = query(v.string(), async (student_id) => {
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
	},
);

export const delete_student = command(v.string(), async (student_id) => {
	try {
		await db.delete(students_table).where(eq(students_table.id, student_id));

		// return { message: "User deleted successfully" };
	} catch (_e) {
		console.log(_e);
		return { message: "Student not deleted" };
	}
});
