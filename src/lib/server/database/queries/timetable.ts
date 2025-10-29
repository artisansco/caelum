import { eq, and } from "drizzle-orm";
import { db } from "../drizzle";
import {
	timetable_table,
	classes_table,
	subjects_table,
	staff_table,
} from "../schema";

export async function get_class_timetable(class_id: string) {
	try {
		const timetable = await db
			.select({
				id: timetable_table.id,
				day_of_week: timetable_table.day_of_week,
				start_time: timetable_table.start_time,
				end_time: timetable_table.end_time,
				room: timetable_table.room,
				subject_name: subjects_table.name,
				subject_code: subjects_table.code,
				teacher_name: staff_table.first_name,
				teacher_last_name: staff_table.last_name,
			})
			.from(timetable_table)
			.leftJoin(subjects_table, eq(timetable_table.subject_id, subjects_table.id))
			.leftJoin(staff_table, eq(timetable_table.staff_id, staff_table.id))
			.where(eq(timetable_table.class_id, class_id))
			.orderBy(timetable_table.day_of_week, timetable_table.start_time);

		return { success: true, data: timetable };
	} catch (_e) {
		console.error("Error getting class timetable:", _e);
		return { success: false, message: "Failed to get class timetable" };
	}
}

export async function get_teacher_timetable(staff_id: string) {
	try {
		const timetable = await db
			.select({
				id: timetable_table.id,
				day_of_week: timetable_table.day_of_week,
				start_time: timetable_table.start_time,
				end_time: timetable_table.end_time,
				room: timetable_table.room,
				class_name: classes_table.name,
				subject_name: subjects_table.name,
			})
			.from(timetable_table)
			.leftJoin(classes_table, eq(timetable_table.class_id, classes_table.id))
			.leftJoin(subjects_table, eq(timetable_table.subject_id, subjects_table.id))
			.where(eq(timetable_table.staff_id, staff_id))
			.orderBy(timetable_table.day_of_week, timetable_table.start_time);

		return { success: true, data: timetable };
	} catch (_e) {
		console.error("Error getting teacher timetable:", _e);
		return { success: false, message: "Failed to get teacher timetable" };
	}
}

export async function get_school_timetable(school_id: string) {
	try {
		const timetable = await db
			.select({
				id: timetable_table.id,
				day_of_week: timetable_table.day_of_week,
				start_time: timetable_table.start_time,
				end_time: timetable_table.end_time,
				room: timetable_table.room,
				class_name: classes_table.name,
				subject_name: subjects_table.name,
				teacher_name: staff_table.first_name,
				teacher_last_name: staff_table.last_name,
			})
			.from(timetable_table)
			.leftJoin(classes_table, eq(timetable_table.class_id, classes_table.id))
			.leftJoin(subjects_table, eq(timetable_table.subject_id, subjects_table.id))
			.leftJoin(staff_table, eq(timetable_table.staff_id, staff_table.id))
			.where(eq(timetable_table.school_id, school_id));

		return { success: true, data: timetable };
	} catch (_e) {
		console.error("Error getting school timetable:", _e);
		return { success: false, message: "Failed to get school timetable" };
	}
}

export async function create_timetable_entry(
	data: typeof timetable_table.$inferInsert,
) {
	try {
		const [entry] = await db.insert(timetable_table).values(data).returning();

		return { success: true, data: entry };
	} catch (_e) {
		console.error("Error creating timetable entry:", _e);
		return { success: false, message: "Failed to create timetable entry" };
	}
}

export async function update_timetable_entry(
	entry_id: string,
	data: Partial<typeof timetable_table.$inferInsert>,
) {
	try {
		const [entry] = await db
			.update(timetable_table)
			.set(data)
			.where(eq(timetable_table.id, entry_id))
			.returning();

		return { success: true, data: entry };
	} catch (_e) {
		console.error("Error updating timetable entry:", _e);
		return { success: false, message: "Failed to update timetable entry" };
	}
}

export async function delete_timetable_entry(entry_id: string) {
	try {
		await db.delete(timetable_table).where(eq(timetable_table.id, entry_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting timetable entry:", _e);
		return { success: false, message: "Failed to delete timetable entry" };
	}
}

export async function check_timetable_conflict(
	class_id: string,
	day_of_week: string,
	start_time: string,
	end_time: string,
	exclude_id?: string,
) {
	try {
		const conditions = [
			eq(timetable_table.class_id, class_id),
			eq(timetable_table.day_of_week, day_of_week),
		];

		const entries = await db.query.timetable_table.findMany({
			where: and(...conditions),
		});

		// Check for time overlap
		const conflicts = entries.filter((entry) => {
			if (exclude_id && entry.id === exclude_id) return false;

			const entry_start = entry.start_time;
			const entry_end = entry.end_time;

			// Check if times overlap
			return (
				(start_time >= entry_start && start_time < entry_end) ||
				(end_time > entry_start && end_time <= entry_end) ||
				(start_time <= entry_start && end_time >= entry_end)
			);
		});

		return {
			success: true,
			data: { has_conflict: conflicts.length > 0, conflicts },
		};
	} catch (_e) {
		console.error("Error checking timetable conflict:", _e);
		return { success: false, message: "Failed to check timetable conflict" };
	}
}

export async function check_teacher_conflict(
	staff_id: string,
	day_of_week: string,
	start_time: string,
	end_time: string,
	exclude_id?: string,
) {
	try {
		const conditions = [
			eq(timetable_table.staff_id, staff_id),
			eq(timetable_table.day_of_week, day_of_week),
		];

		const entries = await db.query.timetable_table.findMany({
			where: and(...conditions),
		});

		const conflicts = entries.filter((entry) => {
			if (exclude_id && entry.id === exclude_id) return false;

			const entry_start = entry.start_time;
			const entry_end = entry.end_time;

			return (
				(start_time >= entry_start && start_time < entry_end) ||
				(end_time > entry_start && end_time <= entry_end) ||
				(start_time <= entry_start && end_time >= entry_end)
			);
		});

		return {
			success: true,
			data: { has_conflict: conflicts.length > 0, conflicts },
		};
	} catch (_e) {
		console.error("Error checking teacher conflict:", _e);
		return { success: false, message: "Failed to check teacher conflict" };
	}
}
