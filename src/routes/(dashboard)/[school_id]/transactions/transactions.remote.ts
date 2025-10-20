import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { transaction_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const get_transactions_query = query(async () => {
	const { locals } = getRequestEvent();

	const { success, data, message } = await database.get_transactions(
		locals.school_id,
	);

	if (!success) {
		console.error(message);
		return [];
	}

	return data || [];
});

export const add_transaction = form(transaction_schema, async (parsed) => {
	const { success, message } = await database.create_transaction({
		school_id: parsed.school_id,
		subscription_id: parsed.subscription_id,
		amount: parsed.amount,
		transaction_type: parsed.transaction_type,
		payment_method: parsed.payment_method,
		description: parsed.description,
	});

	if (!success) {
		return { message: message || "Failed to record transaction" };
	}

	await get_transactions_query().refresh();
	return { message: "Transaction recorded successfully" };
});

export const create_subscription_transaction_command = command(
	v.object({
		subscription_id: v.string(),
		amount: v.number(),
		description: v.optional(v.string()),
	}),
	async ({ subscription_id, amount, description }) => {
		const { params } = getRequestEvent();
		const school_id = params.school_id as string;

		const { success, data, message } = await database.create_transaction({
			school_id: school_id,
			subscription_id: subscription_id,
			amount: amount,
			description: description,
		});

		if (!success) {
			return {
				success: false,
				message: message || "Failed to create subscription transaction",
			};
		}

		return { success: true, transaction_id: data?.id };
	},
);

// Export with original names for backwards compatibility
export const get_transactions = get_transactions_query;
export const create_subscription_transaction_exported =
	create_subscription_transaction_command;
