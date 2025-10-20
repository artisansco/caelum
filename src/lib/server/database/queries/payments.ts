import { desc, eq } from "drizzle-orm";
import { db } from "../drizzle";
import { payments_table, staff_table, students_table } from "../schema";

export async function get_payments(school_id: string, limit?: number) {
	try {
		const payments = await db
			.select({
				id: payments_table.id,
				amount: payments_table.amount,
				payment_type: payments_table.payment_type,
				payment_method: payments_table.payment_method,
				term: payments_table.term,
				academic_year: payments_table.academic_year,
				payment_date: payments_table.payment_date,
				notes: payments_table.notes,
				created_at: payments_table.created_at,
				// TODO: combine student_name in one name
				student_name: students_table.first_name,
				student_last_name: students_table.last_name,
				student_admission_number: students_table.admission_number,
				// TODO: combine received_by in one name
				received_by_name: staff_table.first_name,
				received_by_last_name: staff_table.last_name,
			})
			.from(payments_table)
			.leftJoin(
				students_table,
				eq(payments_table.student_id, students_table.id),
			)
			.leftJoin(staff_table, eq(payments_table.received_by, staff_table.id))
			.where(eq(payments_table.school_id, school_id))
			.orderBy(desc(payments_table.created_at))
			.limit(limit || -1);

		return { success: true, data: payments };
	} catch (_e) {
		console.error("Error getting payments:", _e);
		return { success: false, message: "Failed to get payments" };
	}
}

export async function get_payment(payment_id: string) {
	try {
		const payment = await db.query.payments_table.findFirst({
			where: eq(payments_table.id, payment_id),
		});

		return { success: true, data: payment };
	} catch (_e) {
		console.error("Error getting payment:", _e);
		return { success: false, message: "Failed to get payment" };
	}
}

export async function create_payment(data: typeof payments_table.$inferInsert) {
	try {
		const [payment] = await db.insert(payments_table).values(data).returning();

		return { success: true, data: payment };
	} catch (_e) {
		console.error("Error creating payment:", _e);
		return { success: false, message: "Failed to create payment" };
	}
}

export async function update_payment(
	payment_id: string,
	data: Partial<typeof payments_table.$inferInsert>,
) {
	try {
		const [payment] = await db
			.update(payments_table)
			.set(data)
			.where(eq(payments_table.id, payment_id))
			.returning();

		return { success: true, data: payment };
	} catch (_e) {
		console.error("Error updating payment:", _e);
		return { success: false, message: "Failed to update payment" };
	}
}

export async function delete_payment(payment_id: string) {
	try {
		await db.delete(payments_table).where(eq(payments_table.id, payment_id));

		return { success: true };
	} catch (_e) {
		console.error("Error deleting payment:", _e);
		return { success: false, message: "Failed to delete payment" };
	}
}
