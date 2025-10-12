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
			payment_status: payments_table.payment_status,
			reference_number: payments_table.reference_number,
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

export const get_payments_by_student = query(v.string(), async (student_id) => {
	const { params } = getRequestEvent();
	const school_id = params.school_id as string;

	const payments = await db
		.select({
			id: payments_table.id,
			amount: payments_table.amount,
			payment_type: payments_table.payment_type,
			payment_method: payments_table.payment_method,
			payment_status: payments_table.payment_status,
			reference_number: payments_table.reference_number,
			term: payments_table.term,
			academic_year: payments_table.academic_year,
			due_date: payments_table.due_date,
			paid_date: payments_table.paid_date,
			notes: payments_table.notes,
			created_at: payments_table.created_at,
			received_by_name: staff_table.first_name,
			received_by_last_name: staff_table.last_name,
		})
		.from(payments_table)
		.leftJoin(staff_table, eq(payments_table.received_by, staff_table.id))
		.where(
			and(
				eq(payments_table.student_id, student_id),
				eq(payments_table.school_id, school_id),
			),
		)
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

export const update_payment_status = command(
	v.object({ payment_id: v.string(), status: v.string() }),
	async ({ payment_id, status }) => {
		try {
			const { params } = getRequestEvent();
			const school_id = params.school_id as string;

			await db
				.update(payments_table)
				.set({
					payment_status: status as
						| "pending"
						| "completed"
						| "failed"
						| "refunded",
					updated_at: new Date().toISOString(),
					...(status === "completed" && {
						paid_date: new Date().toISOString(),
					}),
				})
				.where(
					and(
						eq(payments_table.id, payment_id),
						eq(payments_table.school_id, school_id),
					),
				);

			return { success: true };
		} catch (error) {
			console.error("Error updating payment status:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to update payment status";
			throw new Error(errorMessage);
		}
	},
);

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

export const get_payment_statistics = query(async () => {
	const { params } = getRequestEvent();
	const school_id = params.school_id as string;

	const payments = await db
		.select()
		.from(payments_table)
		.where(eq(payments_table.school_id, school_id));

	const current_year = new Date().getFullYear().toString();
	const current_year_payments = payments.filter(
		(p) => p.academic_year === current_year,
	);

	const stats = {
		total_payments: payments.length,
		total_amount: payments.reduce((sum, payment) => sum + payment.amount, 0),
		current_year_total: current_year_payments.reduce(
			(sum, payment) => sum + payment.amount,
			0,
		),
		by_status: {
			completed: payments.filter((p) => p.payment_status === "completed")
				.length,
			pending: payments.filter((p) => p.payment_status === "pending").length,
			failed: payments.filter((p) => p.payment_status === "failed").length,
			refunded: payments.filter((p) => p.payment_status === "refunded").length,
		},
		by_type: {
			tuition: payments.filter((p) => p.payment_type === "tuition").length,
			registration: payments.filter((p) => p.payment_type === "registration")
				.length,
			transport: payments.filter((p) => p.payment_type === "transport").length,
			meals: payments.filter((p) => p.payment_type === "meals").length,
			books: payments.filter((p) => p.payment_type === "books").length,
			other: payments.filter((p) => p.payment_type === "other").length,
		},
		by_method: {
			cash: payments.filter((p) => p.payment_method === "cash").length,
			bank_transfer: payments.filter(
				(p) => p.payment_method === "bank_transfer",
			).length,
			mobile_money: payments.filter((p) => p.payment_method === "mobile_money")
				.length,
			cheque: payments.filter((p) => p.payment_method === "cheque").length,
		},
	};

	return stats;
});

export const get_monthly_payment_summary = query(v.string(), async (year) => {
	const { params } = getRequestEvent();
	const school_id = params.school_id as string;

	const payments = await db
		.select()
		.from(payments_table)
		.where(
			and(
				eq(payments_table.school_id, school_id),
				eq(payments_table.academic_year, year),
				eq(payments_table.payment_status, "completed"),
			),
		);

	const monthly_summary = Array.from({ length: 12 }, (_, i) => {
		const month = i + 1;
		const month_payments = payments.filter((payment) => {
			if (!payment.paid_date) return false;
			const payment_month = new Date(payment.paid_date).getMonth() + 1;
			return payment_month === month;
		});

		return {
			month,
			month_name: new Date(0, i).toLocaleString("default", {
				month: "long",
			}),
			total_amount: month_payments.reduce(
				(sum, payment) => sum + payment.amount,
				0,
			),
			payment_count: month_payments.length,
		};
	});

	return monthly_summary;
});

export const get_overdue_payments = query(async () => {
	const { params } = getRequestEvent();
	const school_id = params.school_id as string;
	const today = new Date().toISOString().split("T")[0];

	const overdue_payments = await db
		.select({
			id: payments_table.id,
			amount: payments_table.amount,
			payment_type: payments_table.payment_type,
			due_date: payments_table.due_date,
			term: payments_table.term,
			academic_year: payments_table.academic_year,
			student_name: students_table.first_name,
			student_last_name: students_table.last_name,
			student_admission_number: students_table.admission_number,
		})
		.from(payments_table)
		.leftJoin(students_table, eq(payments_table.student_id, students_table.id))
		.where(
			and(
				eq(payments_table.school_id, school_id),
				eq(payments_table.payment_status, "pending"),
				// Add condition for overdue (due_date < today)
			),
		)
		.orderBy(payments_table.due_date);

	// Filter overdue payments in memory since we need to compare dates
	const overdue = overdue_payments.filter(
		(payment) => payment.due_date && payment.due_date < today,
	);

	return overdue;
});
