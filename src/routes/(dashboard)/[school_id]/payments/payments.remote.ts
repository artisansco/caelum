import { and, desc, eq } from "drizzle-orm";
import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { db, payments_table, staff_table, students_table } from "$lib/db";
import { payment_schema } from "$lib/schemas";

export const get_payments = query(async () => {
	const { params } = getRequestEvent();
	const school_id = params.school_id as string;

	const payments = await db
		.select({
			id: payments_table.id,
			amount: payments_table.amount,
			payment_type: payments_table.payment_type,
			payment_method: payments_table.payment_method,
			term: payments_table.term,
			academic_year: payments_table.academic_year,
			due_date: payments_table.due_date,
			paid_date: payments_table.paid_date,
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
		.orderBy(desc(payments_table.created_at));

	return payments;
});

export const add_payment = form(payment_schema, async (parsed) => {
	try {
		const { params } = getRequestEvent();
		const school_id = params.school_id as string;

		await db.insert(payments_table).values({
			...parsed,
			school_id,
			amount: 0,
			received_by: "",
			student_id: "",
			academic_year: new Date().getFullYear(),
			paid_date: parsed.paid_date || new Date().toISOString(),
		});

		await get_payments().refresh();
		return { message: "Payment recorded successfully" };
	} catch (error) {
		console.error("Error recording payment:", error);
		return {
			message: error?.message || "Failed to record payment",
		};
	}
});

export const delete_payment = command(v.string(), async (payment_id) => {
	try {
		const { params } = getRequestEvent();
		const school_id = params.school_id as string;

		await db
			.delete(payments_table)
			.where(
				and(
					eq(payments_table.id, payment_id),
					eq(payments_table.school_id, school_id),
				),
			);

		return { success: true };
	} catch (error) {
		console.error("Error deleting payment:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Failed to delete payment";
		throw new Error(errorMessage);
	}
});
