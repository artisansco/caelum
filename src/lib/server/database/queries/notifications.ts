import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { notifications_table, staff_table } from "../schema";

export async function create_notification(
	data: typeof notifications_table.$inferInsert,
) {
	try {
		const [notification] = await db
			.insert(notifications_table)
			.values(data)
			.returning();

		return { success: true, data: notification };
	} catch (_e) {
		console.error("Error creating notification:", _e);
		return { success: false, message: "Failed to create notification" };
	}
}

export async function get_user_notifications(user_id: string, limit = 50) {
	try {
		const notifications = await db.query.notifications_table.findMany({
			where: eq(notifications_table.user_id, user_id),
			orderBy: [desc(notifications_table.created_at)],
			limit,
		});

		return { success: true, data: notifications };
	} catch (_e) {
		console.error("Error getting user notifications:", _e);
		return { success: false, message: "Failed to get notifications" };
	}
}

export async function get_unread_notifications(user_id: string) {
	try {
		const notifications = await db.query.notifications_table.findMany({
			where: and(
				eq(notifications_table.user_id, user_id),
				eq(notifications_table.read, false),
			),
			orderBy: [desc(notifications_table.created_at)],
		});

		return { success: true, data: notifications };
	} catch (_e) {
		console.error("Error getting unread notifications:", _e);
		return { success: false, message: "Failed to get unread notifications" };
	}
}

export async function get_unread_count(user_id: string) {
	try {
		const result = await db
			.select({
				count: sql<number>`cast(count(*) as integer)`,
			})
			.from(notifications_table)
			.where(
				and(
					eq(notifications_table.user_id, user_id),
					eq(notifications_table.read, false),
				),
			);

		return { success: true, data: result[0]?.count || 0 };
	} catch (_e) {
		console.error("Error getting unread count:", _e);
		return { success: false, message: "Failed to get unread count" };
	}
}

export async function mark_notification_read(notification_id: string) {
	try {
		const [notification] = await db
			.update(notifications_table)
			.set({ read: true })
			.where(eq(notifications_table.id, notification_id))
			.returning();

		return { success: true, data: notification };
	} catch (_e) {
		console.error("Error marking notification read:", _e);
		return { success: false, message: "Failed to mark notification as read" };
	}
}

export async function mark_all_read(user_id: string) {
	try {
		await db
			.update(notifications_table)
			.set({ read: true })
			.where(
				and(
					eq(notifications_table.user_id, user_id),
					eq(notifications_table.read, false),
				),
			);

		return { success: true };
	} catch (_e) {
		console.error("Error marking all notifications read:", _e);
		return {
			success: false,
			message: "Failed to mark all notifications as read",
		};
	}
}

export async function delete_notification(notification_id: string) {
	try {
		await db
			.delete(notifications_table)
			.where(eq(notifications_table.id, notification_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting notification:", _e);
		return { success: false, message: "Failed to delete notification" };
	}
}

export async function create_bulk_notifications(
	user_ids: string[],
	notification_data: Omit<
		typeof notifications_table.$inferInsert,
		"user_id"
	>,
) {
	try {
		const notifications = user_ids.map((user_id) => ({
			...notification_data,
			user_id,
		}));

		await db.insert(notifications_table).values(notifications);

		return { success: true, data: { count: notifications.length } };
	} catch (_e) {
		console.error("Error creating bulk notifications:", _e);
		return { success: false, message: "Failed to create bulk notifications" };
	}
}

export async function get_school_notifications(
	school_id: string,
	limit = 100,
) {
	try {
		const notifications = await db
			.select({
				id: notifications_table.id,
				type: notifications_table.type,
				title: notifications_table.title,
				message: notifications_table.message,
				link: notifications_table.link,
				read: notifications_table.read,
				created_at: notifications_table.created_at,
				user_name: staff_table.first_name,
				user_last_name: staff_table.last_name,
			})
			.from(notifications_table)
			.leftJoin(staff_table, eq(notifications_table.user_id, staff_table.id))
			.where(eq(notifications_table.school_id, school_id))
			.orderBy(desc(notifications_table.created_at))
			.limit(limit);

		return { success: true, data: notifications };
	} catch (_e) {
		console.error("Error getting school notifications:", _e);
		return { success: false, message: "Failed to get school notifications" };
	}
}
