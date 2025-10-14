import { and, desc, eq } from "drizzle-orm";
import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import {
	db,
	plans_table,
	subscriptions_table,
	transactions_table,
} from "$lib/db";
import { transaction_schema } from "$lib/schemas";

export const get_transactions = query(async () => {
	const { params } = getRequestEvent();
	const school_id = params.school_id as string;

	const transactions = await db
		.select({
			id: transactions_table.id,
			amount: transactions_table.amount,
			transaction_type: transactions_table.transaction_type,
			payment_method: transactions_table.payment_method,
			// transaction_status: transactions_table.transaction_status,
			// reference_number: transactions_table.reference_number,
			description: transactions_table.description,
			// processed_date: transactions_table.processed_date,
			created_at: transactions_table.created_at,
			subscription_id: transactions_table.subscription_id,
			plan_name: plans_table.name,
			plan_duration_days: plans_table.duration_days,
		})
		.from(transactions_table)
		.leftJoin(
			subscriptions_table,
			eq(transactions_table.subscription_id, subscriptions_table.id),
		)
		.leftJoin(plans_table, eq(subscriptions_table.plan_id, plans_table.id))
		.where(eq(transactions_table.school_id, school_id))
		.orderBy(desc(transactions_table.created_at));

	return transactions;
});

export const get_transaction_by_id = query(
	v.string(),
	async (transaction_id) => {
		const { params } = getRequestEvent();
		const school_id = params.school_id as string;

		const [transaction] = await db
			.select({
				id: transactions_table.id,
				amount: transactions_table.amount,
				transaction_type: transactions_table.transaction_type,
				payment_method: transactions_table.payment_method,
				// transaction_status: transactions_table.transaction_status,
				// reference_number: transactions_table.reference_number,
				description: transactions_table.description,
				// processed_date: transactions_table.processed_date,
				created_at: transactions_table.created_at,
				subscription_id: transactions_table.subscription_id,
				plan_name: plans_table.name,
				plan_duration_days: plans_table.duration_days,
				plan_price: plans_table.price,
			})
			.from(transactions_table)
			.leftJoin(
				subscriptions_table,
				eq(transactions_table.subscription_id, subscriptions_table.id),
			)
			.leftJoin(plans_table, eq(subscriptions_table.plan_id, plans_table.id))
			.where(
				and(
					eq(transactions_table.id, transaction_id),
					eq(transactions_table.school_id, school_id),
				),
			);

		return transaction;
	},
);

export const add_transaction = form(transaction_schema, async (parsed) => {
	try {
		const { params } = getRequestEvent();
		const school_id = params.school_id as string;

		await db.insert(transactions_table).values({
			...parsed,
			school_id,
			amount: 0,
		});

		await get_transactions().refresh();
		return { message: "Transaction recorded successfully" };
	} catch (error) {
		console.error("Error recording transaction:", error);
		return {
			message: error?.message || "Failed to record transaction",
		};
	}
});

export const create_subscription_transaction = command(
	v.object({
		subscription_id: v.string(),
		amount: v.number(),
		description: v.optional(v.string()),
	}),
	async ({ subscription_id, amount, description }) => {
		try {
			const { params } = getRequestEvent();
			const school_id = params.school_id as string;

			const reference_number = `SUB${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

			await db.insert(transactions_table).values({
				school_id,
				subscription_id,
				amount,
				transaction_type: "subscription",
				payment_method: "bank_transfer",
				description: description || "Subscription payment",
			});

			return { success: true, reference_number };
		} catch (error: unknown) {
			console.error("Error creating subscription transaction:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to create subscription transaction";
			throw new Error(errorMessage);
		}
	},
);
