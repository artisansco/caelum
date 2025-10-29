import { eq, and, desc, between } from "drizzle-orm";
import { db } from "../drizzle";
import { audit_logs_table, staff_table } from "../schema";

export async function create_audit_log(
	data: typeof audit_logs_table.$inferInsert,
) {
	try {
		const [log] = await db.insert(audit_logs_table).values(data).returning();

		return { success: true, data: log };
	} catch (_e) {
		console.error("Error creating audit log:", _e);
		return { success: false, message: "Failed to create audit log" };
	}
}

export async function get_audit_logs(
	school_id: string,
	limit = 100,
	offset = 0,
) {
	try {
		const logs = await db
			.select({
				id: audit_logs_table.id,
				action: audit_logs_table.action,
				entity_type: audit_logs_table.entity_type,
				entity_id: audit_logs_table.entity_id,
				changes: audit_logs_table.changes,
				ip_address: audit_logs_table.ip_address,
				created_at: audit_logs_table.created_at,
				user_name: staff_table.first_name,
				user_last_name: staff_table.last_name,
				user_email: staff_table.email,
			})
			.from(audit_logs_table)
			.leftJoin(staff_table, eq(audit_logs_table.user_id, staff_table.id))
			.where(eq(audit_logs_table.school_id, school_id))
			.orderBy(desc(audit_logs_table.created_at))
			.limit(limit)
			.offset(offset);

		return { success: true, data: logs };
	} catch (_e) {
		console.error("Error getting audit logs:", _e);
		return { success: false, message: "Failed to get audit logs" };
	}
}

export async function get_entity_audit_logs(
	entity_type: string,
	entity_id: string,
) {
	try {
		const logs = await db
			.select({
				id: audit_logs_table.id,
				action: audit_logs_table.action,
				changes: audit_logs_table.changes,
				ip_address: audit_logs_table.ip_address,
				created_at: audit_logs_table.created_at,
				user_name: staff_table.first_name,
				user_last_name: staff_table.last_name,
			})
			.from(audit_logs_table)
			.leftJoin(staff_table, eq(audit_logs_table.user_id, staff_table.id))
			.where(
				and(
					eq(audit_logs_table.entity_type, entity_type),
					eq(audit_logs_table.entity_id, entity_id),
				),
			)
			.orderBy(desc(audit_logs_table.created_at));

		return { success: true, data: logs };
	} catch (_e) {
		console.error("Error getting entity audit logs:", _e);
		return { success: false, message: "Failed to get entity audit logs" };
	}
}

export async function get_user_audit_logs(user_id: string, limit = 50) {
	try {
		const logs = await db.query.audit_logs_table.findMany({
			where: eq(audit_logs_table.user_id, user_id),
			orderBy: [desc(audit_logs_table.created_at)],
			limit,
		});

		return { success: true, data: logs };
	} catch (_e) {
		console.error("Error getting user audit logs:", _e);
		return { success: false, message: "Failed to get user audit logs" };
	}
}

export async function get_audit_logs_by_date_range(
	school_id: string,
	start_date: string,
	end_date: string,
) {
	try {
		const logs = await db
			.select({
				id: audit_logs_table.id,
				action: audit_logs_table.action,
				entity_type: audit_logs_table.entity_type,
				entity_id: audit_logs_table.entity_id,
				changes: audit_logs_table.changes,
				created_at: audit_logs_table.created_at,
				user_name: staff_table.first_name,
				user_last_name: staff_table.last_name,
			})
			.from(audit_logs_table)
			.leftJoin(staff_table, eq(audit_logs_table.user_id, staff_table.id))
			.where(
				and(
					eq(audit_logs_table.school_id, school_id),
					between(audit_logs_table.created_at, start_date, end_date),
				),
			)
			.orderBy(desc(audit_logs_table.created_at));

		return { success: true, data: logs };
	} catch (_e) {
		console.error("Error getting audit logs by date:", _e);
		return {
			success: false,
			message: "Failed to get audit logs by date range",
		};
	}
}

export async function get_audit_logs_by_action(
	school_id: string,
	action: string,
	limit = 100,
) {
	try {
		const logs = await db
			.select({
				id: audit_logs_table.id,
				action: audit_logs_table.action,
				entity_type: audit_logs_table.entity_type,
				entity_id: audit_logs_table.entity_id,
				changes: audit_logs_table.changes,
				created_at: audit_logs_table.created_at,
				user_name: staff_table.first_name,
				user_last_name: staff_table.last_name,
			})
			.from(audit_logs_table)
			.leftJoin(staff_table, eq(audit_logs_table.user_id, staff_table.id))
			.where(
				and(
					eq(audit_logs_table.school_id, school_id),
					eq(audit_logs_table.action, action),
				),
			)
			.orderBy(desc(audit_logs_table.created_at))
			.limit(limit);

		return { success: true, data: logs };
	} catch (_e) {
		console.error("Error getting audit logs by action:", _e);
		return { success: false, message: "Failed to get audit logs by action" };
	}
}
