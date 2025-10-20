import { desc, eq } from "drizzle-orm";
import { db } from "../drizzle";
import {
	plans_table,
	subscriptions_table,
	transactions_table,
} from "../schema";

export async function get_transactions(school_id: string) {
	try {
		const transactions = await db
			.select({
				id: transactions_table.id,
				amount: transactions_table.amount,
				transaction_type: transactions_table.transaction_type,
				payment_method: transactions_table.payment_method,
				description: transactions_table.description,
				created_at: transactions_table.created_at,
				subscription_id: transactions_table.subscription_id,
				plan_name: plans_table.name,
				plan_duration: plans_table.duration_days,
			})
			.from(transactions_table)
			.leftJoin(
				subscriptions_table,
				eq(transactions_table.subscription_id, subscriptions_table.id),
			)
			.leftJoin(plans_table, eq(subscriptions_table.plan_id, plans_table.id))
			.where(eq(transactions_table.school_id, school_id))
			.orderBy(desc(transactions_table.created_at));

		return { success: true, data: transactions };
	} catch (_e) {
		console.error("Error getting transactions:", _e);
		return { success: false, message: "Failed to get transactions" };
	}
}

export async function get_transaction(transaction_id: string) {
	try {
		const transaction = await db.query.transactions_table.findFirst({
			where: eq(transactions_table.id, transaction_id),
		});

		return { success: true, data: transaction };
	} catch (_e) {
		console.error("Error getting transaction:", _e);
		return { success: false, message: "Failed to get transaction" };
	}
}

export async function create_transaction(
	data: typeof transactions_table.$inferInsert,
) {
	try {
		const [transaction] = await db
			.insert(transactions_table)
			.values(data)
			.returning();

		return { success: true, data: transaction };
	} catch (_e) {
		console.error("Error creating transaction:", _e);
		return { success: false, message: "Failed to create transaction" };
	}
}
