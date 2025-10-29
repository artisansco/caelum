import { eq, lt, and, ne } from "drizzle-orm";
import { db } from "../../database";
import { schools_table, cron_runs_table } from "../../database/schema";
import { downgrade_to_free } from "../../subscription-utils";

/**
 * Check for expired subscriptions and downgrade them to free tier
 * Runs daily at 9 AM
 */
export async function check_expired_subscriptions(): Promise<void> {
	const job_name = "check_expired_subscriptions";
	const started_at = new Date().toISOString();

	try {
		console.log(`[CRON] Starting ${job_name}...`);

		// Log job start
		const run_result = await db.insert(cron_runs_table).values({
			job_name,
			status: "started",
			started_at,
		});

		const run_id = run_result.lastInsertRowid.toString();

		// Find schools with expired subscriptions (past grace period)
		const grace_period_date = new Date();
		grace_period_date.setDate(grace_period_date.getDate() - 3); // 3 days ago

		const expired_schools = await db
			.select()
			.from(schools_table)
			.where(
				and(
					ne(schools_table.subscription_tier, "free"),
					lt(schools_table.subscription_expires_at, grace_period_date.toISOString()),
					ne(schools_table.subscription_status, "expired"),
				),
			);

		console.log(`[CRON] Found ${expired_schools.length} expired subscriptions`);

		// Downgrade each expired school
		const downgraded: string[] = [];
		const errors: string[] = [];

		for (const school of expired_schools) {
			try {
				await downgrade_to_free(school.id);
				downgraded.push(school.id);
				console.log(`[CRON] Downgraded school ${school.id} to free tier`);
			} catch (error) {
				const error_msg = `Failed to downgrade school ${school.id}: ${error}`;
				errors.push(error_msg);
				console.error(`[CRON] ${error_msg}`);
			}
		}

		// Log job completion
		const details = JSON.stringify({
			total_expired: expired_schools.length,
			downgraded: downgraded.length,
			errors: errors.length,
			downgraded_school_ids: downgraded,
			error_messages: errors,
		});

		await db
			.update(cron_runs_table)
			.set({
				status: "completed",
				completed_at: new Date().toISOString(),
				details,
			})
			.where(eq(cron_runs_table.id, run_id));

		console.log(
			`[CRON] ${job_name} completed: ${downgraded.length} downgraded, ${errors.length} errors`,
		);
	} catch (error) {
		console.error(`[CRON] ${job_name} failed:`, error);

		// Try to log failure
		try {
			await db.insert(cron_runs_table).values({
				job_name,
				status: "failed",
				started_at,
				completed_at: new Date().toISOString(),
				details: JSON.stringify({ error: String(error) }),
			});
		} catch {
			// Ignore logging errors
		}
	}
}
