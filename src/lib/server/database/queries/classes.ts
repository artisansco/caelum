import { desc, eq } from "drizzle-orm";
import { db } from "../drizzle";
import { classes_table } from "../schema";

export async function get_classes(school_id: string) {
	try {
		const classes = await db.query.classes_table.findMany({
			where: eq(classes_table.school_id, school_id),
			orderBy: desc(classes_table.created_at),
		});

		return { success: true, data: classes };
	} catch (_e) {
		console.error("Error getting classes:", _e);
		return { success: false, message: "Failed to get classes" };
	}
}

export async function get_class(class_id: string) {
	try {
		const class_item = await db.query.classes_table.findFirst({
			where: eq(classes_table.id, class_id),
		});

		return { success: true, data: class_item };
	} catch (_e) {
		console.error("Error getting class:", _e);
		return { success: false, message: "Failed to get class" };
	}
}

export async function create_class(data: typeof classes_table.$inferInsert) {
	try {
		const [class_item] = await db
			.insert(classes_table)
			.values(data)
			.returning();

		return { success: true, data: class_item };
	} catch (_e) {
		console.error("Error creating class:", _e);
		return { success: false, message: "Failed to create class" };
	}
}

export async function update_class(
	class_id: string,
	data: Partial<typeof classes_table.$inferInsert>,
) {
	try {
		const [class_item] = await db
			.update(classes_table)
			.set(data)
			.where(eq(classes_table.id, class_id))
			.returning();

		return { success: true, data: class_item };
	} catch (_e) {
		console.error("Error updating class:", _e);
		return { success: false, message: "Failed to update class" };
	}
}

export async function delete_class(class_id: string) {
	try {
		await db.delete(classes_table).where(eq(classes_table.id, class_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting class:", _e);
		return { success: false, message: "Failed to delete class" };
	}
}
