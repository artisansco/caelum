import { eq } from "drizzle-orm";
import { db } from "../../database";
import { schools_table, cron_runs_table } from "../../database/schema";

/**
 * Reset SMS quotas for all Pro tier schools
 * Runs monthly on the 1st at midnight
 */
export async function reset_sms_quotas(): Promise<void> {
	const job_name = "reset_sms_quotas";
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

		// Find all schools with Pro tier
		const pro_schools = await db
			.select()
			.from(schools_table)
			.where(eq(schools_table.subscription_tier, "pro"));

		console.log(`[CRON] Found ${pro_schools.length} Pro tier schools`);

		// Reset SMS quota for each
		let reset_count = 0;
		const errors: string[] = [];

		for (const school of pro_schools) {
			try {
				await db
					.update(schools_table)
					.set({ sms_quota_used: 0 })
					.where(eq(schools_table.id, school.id));

				reset_count++;
				console.log(`[CRON] Reset SMS quota for school ${school.id}`);
			} catch (error) {
				const error_msg = `Failed to reset SMS quota for school ${school.id}: ${error}`;
				errors.push(error_msg);
				console.error(`[CRON] ${error_msg}`);
			}
		}

		// Log job completion
		const details = JSON.stringify({
			total_pro_schools: pro_schools.length,
			quotas_reset: reset_count,
			errors: errors.length,
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
			`[CRON] ${job_name} completed: ${reset_count} quotas reset, ${errors.length} errors`,
		);
	} catch (error) {
		console.error(`[CRON] ${job_name} failed:`, error);

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
