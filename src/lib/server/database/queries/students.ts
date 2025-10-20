import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "../drizzle";
import { classes_table, students_table } from "../schema";

export async function get_students(
	school_id: string,
	opts: { limit?: number },
) {
	try {
		const students = await db
			.select({
				...getTableColumns(students_table),
				class: getTableColumns(classes_table),
			})
			.from(students_table)
			.leftJoin(classes_table, eq(classes_table.id, students_table.class_id))
			.where(eq(students_table.school_id, school_id))
			.orderBy(desc(students_table.admission_date))
			.limit(opts.limit || -1);
		// .offset(offset);

		return { success: true, data: students };
	} catch (error) {
		console.error("Error getting students:", error);
		return { success: false, message: "Failed to get students" };
	}
}

export async function get_student(student_id: string) {
	try {
		const result = await db
			.select({
				...getTableColumns(students_table),
				class: getTableColumns(classes_table),
			})
			.from(students_table)
			.leftJoin(classes_table, eq(classes_table.id, students_table.class_id))
			.where(eq(students_table.id, student_id))
			.limit(1);

		if (!result.length) {
			return { success: false, message: "Student not found" };
		}

		return { success: true, data: result[0] };
	} catch (error) {
		console.error("Error getting student:", error);
		return { success: false, message: "Failed to get student" };
	}
}

export async function create_student(data: typeof students_table.$inferInsert) {
	try {
		const [student] = await db.insert(students_table).values(data).returning();

		return { success: true, data: student };
	} catch (error) {
		console.error("Error creating student:", error);
		return { success: false, message: "Failed to create student" };
	}
}

export async function update_student(
	student_id: string,
	data: Partial<typeof students_table.$inferInsert>,
) {
	try {
		const [student] = await db
			.update(students_table)
			.set(data)
			.where(eq(students_table.id, student_id))
			.returning();

		return { success: true, data: student };
	} catch (error) {
		console.error("Error updating student:", error);
		return { success: false, message: "Failed to update student" };
	}
}

export async function delete_student(student_id: string) {
	try {
		await db.delete(students_table).where(eq(students_table.id, student_id));

		return { success: true };
	} catch (error) {
		console.error("Error deleting student:", error);
		return { success: false, message: "Failed to delete student" };
	}
}
