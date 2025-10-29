/**
 * Audit logging utility
 * Tracks all sensitive operations for compliance and security
 */

import { getRequestEvent } from "$app/server";
import { database } from "./server/database/queries";
import type { CurrentUser } from "./types";

/**
 * Log an audit trail entry
 */
export async function log_audit(
	user: CurrentUser | null,
	action: "create" | "update" | "delete" | "login" | "logout",
	entity_type:
		| "student"
		| "staff"
		| "grade"
		| "payment"
		| "class"
		| "subject"
		| "announcement",
	entity_id: string,
	changes?: Record<string, unknown>,
): Promise<void> {
	if (!user) return;

	try {
		const { request } = getRequestEvent();
		const ip_address =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("x-real-ip") ||
			"unknown";
		const user_agent = request.headers.get("user-agent") || "unknown";

		await database.create_audit_log({
			user_id: user.id,
			action,
			entity_type,
			entity_id,
			changes: changes ? JSON.stringify(changes) : null,
			ip_address,
			user_agent,
			school_id: user.school_id,
		});
	} catch (error) {
		console.error("Failed to create audit log:", error);
		// Don't throw - audit logging should not break the main operation
	}
}

/**
 * Log student creation
 */
export async function log_student_created(
	user: CurrentUser | null,
	student_id: string,
	student_data: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "create", "student", student_id, {
		after: student_data,
	});
}

/**
 * Log student update
 */
export async function log_student_updated(
	user: CurrentUser | null,
	student_id: string,
	before: Record<string, unknown>,
	after: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "update", "student", student_id, { before, after });
}

/**
 * Log student deletion
 */
export async function log_student_deleted(
	user: CurrentUser | null,
	student_id: string,
	student_data: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "delete", "student", student_id, {
		before: student_data,
	});
}

/**
 * Log grade creation
 */
export async function log_grade_created(
	user: CurrentUser | null,
	grade_id: string,
	grade_data: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "create", "grade", grade_id, { after: grade_data });
}

/**
 * Log grade update
 */
export async function log_grade_updated(
	user: CurrentUser | null,
	grade_id: string,
	before: Record<string, unknown>,
	after: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "update", "grade", grade_id, { before, after });
}

/**
 * Log grade deletion
 */
export async function log_grade_deleted(
	user: CurrentUser | null,
	grade_id: string,
	grade_data: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "delete", "grade", grade_id, { before: grade_data });
}

/**
 * Log payment creation
 */
export async function log_payment_created(
	user: CurrentUser | null,
	payment_id: string,
	payment_data: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "create", "payment", payment_id, {
		after: payment_data,
	});
}

/**
 * Log staff creation
 */
export async function log_staff_created(
	user: CurrentUser | null,
	staff_id: string,
	staff_data: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "create", "staff", staff_id, { after: staff_data });
}

/**
 * Log staff update
 */
export async function log_staff_updated(
	user: CurrentUser | null,
	staff_id: string,
	before: Record<string, unknown>,
	after: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "update", "staff", staff_id, { before, after });
}

/**
 * Log staff deletion
 */
export async function log_staff_deleted(
	user: CurrentUser | null,
	staff_id: string,
	staff_data: Record<string, unknown>,
): Promise<void> {
	await log_audit(user, "delete", "staff", staff_id, { before: staff_data });
}

/**
 * Log user login
 */
export async function log_login(user: CurrentUser): Promise<void> {
	try {
		const { request } = getRequestEvent();
		const ip_address =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("x-real-ip") ||
			"unknown";
		const user_agent = request.headers.get("user-agent") || "unknown";

		await database.create_audit_log({
			user_id: user.id,
			action: "login",
			entity_type: "staff",
			entity_id: user.id,
			changes: null,
			ip_address,
			user_agent,
			school_id: user.school_id,
		});
	} catch (error) {
		console.error("Failed to log login:", error);
	}
}

/**
 * Log user logout
 */
export async function log_logout(user: CurrentUser): Promise<void> {
	await log_audit(user, "logout", "staff", user.id);
}
