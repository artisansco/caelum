import { and, desc, eq } from "drizzle-orm";
import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { guard_route } from "$lib/auth";
import { db, payments_table, staff_table, students_table } from "$lib/db";
import { payment_schema } from "$lib/schemas";

export const get_payments = query(v.string(), async (school_id) => {
	guard_route();

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
			student_name: students_table.first_name,
			student_last_name: students_table.last_name,
			student_admission_number: students_table.admission_number,
			received_by_name: staff_table.first_name,
			received_by_last_name: staff_table.last_name,
		})
		.from(payments_table)
		.leftJoin(students_table, eq(payments_table.student_id, students_table.id))
		.leftJoin(staff_table, eq(payments_table.received_by, staff_table.id))
		.where(eq(payments_table.school_id, school_id))
		.orderBy(desc(payments_table.created_at))
		.limit(-1);

	return payments;
});

export const add_payment = form(payment_schema, async (parsed) => {
	try {
		await db.insert(payments_table).values(parsed);

		await get_payments(parsed.school_id).refresh();
		return { message: "Payment recorded successfully" };
	} catch (_e) {
		console.error("Error recording payment:", _e);
		return { message: _e?.message || "Failed to record payment" };
	}
});

export const delete_payment = command(v.string(), async (payment_id) => {
	try {
		const { locals } = getRequestEvent();

		await db
			.delete(payments_table)
			.where(
				and(
					eq(payments_table.id, payment_id),
					eq(payments_table.school_id, locals.school_id),
				),
			);
	} catch (_e) {
		console.error("Error deleting payment:", _e);
	}
});
