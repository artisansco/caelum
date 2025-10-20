import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "../drizzle";
import { assignments_table, classes_table } from "../schema";

export async function get_assignments(school_id: string) {
	try {
		const assignments = await db
			.select({
				...getTableColumns(assignments_table),
				class_name: classes_table.name,
			})
			.from(assignments_table)
			.where(eq(assignments_table.school_id, school_id))
			.leftJoin(classes_table, eq(assignments_table.class_id, classes_table.id))
			.orderBy(desc(assignments_table.created_at));

		return { success: true, data: assignments };
	} catch (_e) {
		console.error("Error getting assignments:", _e);
		return { success: false, message: "Failed to get assignments" };
	}
}

export async function get_assignment(assignment_id: string) {
	try {
		const assignment = await db.query.assignments_table.findFirst({
			where: eq(assignments_table.id, assignment_id),
		});

		return { success: true, data: assignment };
	} catch (_e) {
		console.error("Error getting assignment:", _e);
		return { success: false, message: "Failed to get assignment" };
	}
}

export async function create_assignment(
	data: typeof assignments_table.$inferInsert,
) {
	try {
		const [assignment] = await db
			.insert(assignments_table)
			.values(data)
			.returning();

		return { success: true, data: assignment };
	} catch (_e) {
		console.error("Error creating assignment:", _e);
		return { success: false, message: "Failed to create assignment" };
	}
}

export async function update_assignment(
	assignment_id: string,
	data: Partial<typeof assignments_table.$inferInsert>,
) {
	try {
		const [assignment] = await db
			.update(assignments_table)
			.set(data)
			.where(eq(assignments_table.id, assignment_id))
			.returning();

		return { success: true, data: assignment };
	} catch (_e) {
		console.error("Error updating assignment:", _e);
		return { success: false, message: "Failed to update assignment" };
	}
}

export async function delete_assignment(assignment_id: string) {
	try {
		await db
			.delete(assignments_table)
			.where(eq(assignments_table.id, assignment_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting assignment:", _e);
		return { success: false, message: "Failed to delete assignment" };
	}
}
