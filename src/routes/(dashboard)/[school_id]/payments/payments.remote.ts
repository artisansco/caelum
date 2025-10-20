import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { payment_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const get_payments_query = query(v.string(), async (school_id) => {
	const { success, data, message } = await database.get_payments(school_id, -1);

	if (!success) {
		console.error(message);
		return [];
	}

	return data || [];
});

export const add_payment = form(payment_schema, async (parsed) => {
	const { success, message } = await database.create_payment({
		student_id: parsed.student_id,
		received_by: parsed.received_by,
		school_id: parsed.school_id,
		amount: parsed.amount,
		payment_type: parsed.payment_type,
		payment_method: parsed.payment_method,
		term: parsed.term,
		academic_year: parsed.academic_year,
		payment_date: parsed.payment_date,
		notes: parsed.notes,
	});

	if (!success) {
		return { message: message || "Failed to record payment" };
	}

	await get_payments_query(parsed.school_id).refresh();
	return { message: "Payment recorded successfully" };
});

export const delete_payment_command = command(
	v.string(),
	async (payment_id) => {
		const { locals } = getRequestEvent();

		const { success, message } = await database.delete_payment(payment_id);

		if (!success) {
			return { message: message || "Failed to delete payment" };
		}
	},
);

// Export with original names for backwards compatibility
export const get_payments = get_payments_query;
export const delete_payment = delete_payment_command;
