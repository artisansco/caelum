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
			transaction_status: transactions_table.transaction_status,
			reference_number: transactions_table.reference_number,
			description: transactions_table.description,
			processed_date: transactions_table.processed_date,
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
				transaction_status: transactions_table.transaction_status,
				reference_number: transactions_table.reference_number,
				description: transactions_table.description,
				processed_date: transactions_table.processed_date,
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

		// Generate reference number if not provided
		const reference_number =
			parsed.reference_number ||
			`TXN${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

		await db.insert(transactions_table).values({
			...parsed,
			school_id,
			reference_number,
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

export const update_transaction_status = command(
	v.object({
		transaction_id: v.string(),
		status: v.string(),
		processed_date: v.optional(v.string()),
	}),
	async ({ transaction_id, status, processed_date }) => {
		try {
			const { params } = getRequestEvent();
			const school_id = params.school_id as string;

			await db
				.update(transactions_table)
				.set({
					transaction_status: status as
						| "pending"
						| "completed"
						| "failed"
						| "refunded",
					processed_date: processed_date || new Date().toISOString(),
					updated_at: new Date().toISOString(),
				})
				.where(
					and(
						eq(transactions_table.id, transaction_id),
						eq(transactions_table.school_id, school_id),
					),
				);

			return { success: true };
		} catch (error: unknown) {
			console.error("Error updating transaction status:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to update transaction status";
			throw new Error(errorMessage);
		}
	},
);

export const delete_transaction = command(
	v.string(),
	async (transaction_id) => {
		try {
			const { params } = getRequestEvent();
			const school_id = params.school_id as string;

			await db
				.delete(transactions_table)
				.where(
					and(
						eq(transactions_table.id, transaction_id),
						eq(transactions_table.school_id, school_id),
					),
				);

			return { success: true };
		} catch (error: unknown) {
			console.error("Error deleting transaction:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete transaction";
			throw new Error(errorMessage);
		}
	},
);

export const get_transaction_statistics = query(async () => {
	const { params } = getRequestEvent();
	const school_id = params.school_id as string;

	const transactions = await db
		.select()
		.from(transactions_table)
		.where(eq(transactions_table.school_id, school_id));

	const current_year = new Date().getFullYear();
	const current_year_transactions = transactions.filter((t) => {
		const year = new Date(t.created_at).getFullYear();
		return year === current_year;
	});

	const stats = {
		total_transactions: transactions.length,
		total_amount: transactions
			.filter((t) => t.transaction_status === "completed")
			.reduce((sum, transaction) => sum + transaction.amount, 0),
		current_year_total: current_year_transactions
			.filter((t) => t.transaction_status === "completed")
			.reduce((sum, transaction) => sum + transaction.amount, 0),
		by_status: {
			completed: transactions.filter(
				(t) => t.transaction_status === "completed",
			).length,
			pending: transactions.filter((t) => t.transaction_status === "pending")
				.length,
			failed: transactions.filter((t) => t.transaction_status === "failed")
				.length,
			refunded: transactions.filter((t) => t.transaction_status === "refunded")
				.length,
		},
		by_type: {
			subscription: transactions.filter(
				(t) => t.transaction_type === "subscription",
			).length,
			upgrade: transactions.filter((t) => t.transaction_type === "upgrade")
				.length,
			addon: transactions.filter((t) => t.transaction_type === "addon").length,
			penalty: transactions.filter((t) => t.transaction_type === "penalty")
				.length,
		},
		by_method: {
			bank_transfer: transactions.filter(
				(t) => t.payment_method === "bank_transfer",
			).length,
			mobile_money: transactions.filter(
				(t) => t.payment_method === "mobile_money",
			).length,
			card: transactions.filter((t) => t.payment_method === "card").length,
			paypal: transactions.filter((t) => t.payment_method === "paypal").length,
		},
	};

	return stats;
});

export const get_monthly_transaction_summary = query(
	v.string(),
	async (year) => {
		const { params } = getRequestEvent();
		const school_id = params.school_id as string;

		const transactions = await db
			.select()
			.from(transactions_table)
			.where(
				and(
					eq(transactions_table.school_id, school_id),
					eq(transactions_table.transaction_status, "completed"),
				),
			);

		// Filter by year
		const year_transactions = transactions.filter(
			(transaction) =>
				new Date(transaction.created_at).getFullYear().toString() === year,
		);

		const monthly_summary = Array.from({ length: 12 }, (_, i) => {
			const month = i + 1;
			const month_transactions = year_transactions.filter((transaction) => {
				const transaction_month =
					new Date(transaction.created_at).getMonth() + 1;
				return transaction_month === month;
			});

			return {
				month,
				month_name: new Date(0, i).toLocaleString("default", {
					month: "long",
				}),
				total_amount: month_transactions.reduce(
					(sum, transaction) => sum + transaction.amount,
					0,
				),
				transaction_count: month_transactions.length,
			};
		});

		return monthly_summary;
	},
);

export const get_pending_transactions = query(async () => {
	const { params } = getRequestEvent();
	const school_id = params.school_id as string;

	const pending_transactions = await db
		.select({
			id: transactions_table.id,
			amount: transactions_table.amount,
			transaction_type: transactions_table.transaction_type,
			payment_method: transactions_table.payment_method,
			reference_number: transactions_table.reference_number,
			description: transactions_table.description,
			created_at: transactions_table.created_at,
			plan_name: plans_table.name,
		})
		.from(transactions_table)
		.leftJoin(
			subscriptions_table,
			eq(transactions_table.subscription_id, subscriptions_table.id),
		)
		.leftJoin(plans_table, eq(subscriptions_table.plan_id, plans_table.id))
		.where(
			and(
				eq(transactions_table.school_id, school_id),
				eq(transactions_table.transaction_status, "pending"),
			),
		)
		.orderBy(transactions_table.created_at);

	return pending_transactions;
});

export const get_recent_transactions = query(v.number(), async () => {
	const { params } = getRequestEvent();
	const school_id = params.school_id as string;

	const recent_transactions = await db
		.select({
			id: transactions_table.id,
			amount: transactions_table.amount,
			transaction_type: transactions_table.transaction_type,
			transaction_status: transactions_table.transaction_status,
			reference_number: transactions_table.reference_number,
			created_at: transactions_table.created_at,
			plan_name: plans_table.name,
		})
		.from(transactions_table)
		.leftJoin(
			subscriptions_table,
			eq(transactions_table.subscription_id, subscriptions_table.id),
		)
		.leftJoin(plans_table, eq(subscriptions_table.plan_id, plans_table.id))
		.where(eq(transactions_table.school_id, school_id))
		.orderBy(desc(transactions_table.created_at))
		.limit(10);

	return recent_transactions;
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
				transaction_status: "pending",
				reference_number,
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
