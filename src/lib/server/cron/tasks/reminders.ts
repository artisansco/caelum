import { eq, lt, gt, and } from "drizzle-orm";
import { db } from "../../database";
import { schools_table, cron_runs_table } from "../../database/schema";

// TODO: Import email/SMS sending functions
// import { send_email } from "../../email";
// import { send_sms } from "../../sms";

/**
 * Send renewal reminders to schools with expiring subscriptions
 * Runs daily at 8 AM
 */
export async function send_renewal_reminders(): Promise<void> {
	const job_name = "send_renewal_reminders";
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

		const now = new Date();
		const reminders_sent: string[] = [];
		const errors: string[] = [];

		// 7 days before expiry
		const seven_days_from_now = new Date(now);
		seven_days_from_now.setDate(seven_days_from_now.getDate() + 7);

		const schools_7_days = await db
			.select()
			.from(schools_table)
			.where(
				and(
					lt(
						schools_table.subscription_expires_at,
						seven_days_from_now.toISOString(),
					),
					gt(schools_table.subscription_expires_at, now.toISOString()),
				),
			);

		for (const school of schools_7_days) {
			const expires_at = new Date(school.subscription_expires_at!);
			const days_until_expiry = Math.ceil(
				(expires_at.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
			);

			// Only send if exactly 7, 3, 1 days, at expiry, or 3 days after
			if ([7, 3, 1].includes(days_until_expiry)) {
				try {
					// TODO: Send email reminder
					// await send_email({
					//   to: school.email,
					//   subject: `Your subscription expires in ${days_until_expiry} days`,
					//   body: `...`
					// });

					console.log(
						`[CRON] Would send reminder to school ${school.id}: ${days_until_expiry} days until expiry`,
					);
					reminders_sent.push(`${school.id}:${days_until_expiry}d`);
				} catch (error) {
					errors.push(`School ${school.id}: ${error}`);
					console.error(
						`[CRON] Failed to send reminder to school ${school.id}:`,
						error,
					);
				}
			}
		}

		// At expiry (grace period starts)
		const today_start = new Date(now);
		today_start.setHours(0, 0, 0, 0);
		const today_end = new Date(now);
		today_end.setHours(23, 59, 59, 999);

		const schools_expired_today = await db
			.select()
			.from(schools_table)
			.where(
				and(
					gt(schools_table.subscription_expires_at, today_start.toISOString()),
					lt(schools_table.subscription_expires_at, today_end.toISOString()),
				),
			);

		for (const school of schools_expired_today) {
			try {
				// TODO: Send expiry notification
				console.log(
					`[CRON] Would send expiry notice to school ${school.id}: grace period started`,
				);
				reminders_sent.push(`${school.id}:expired`);
			} catch (error) {
				errors.push(`School ${school.id}: ${error}`);
				console.error(
					`[CRON] Failed to send expiry notice to school ${school.id}:`,
					error,
				);
			}
		}

		// 3 days after expiry (final reminder)
		const three_days_ago = new Date(now);
		three_days_ago.setDate(three_days_ago.getDate() - 3);
		const four_days_ago = new Date(now);
		four_days_ago.setDate(four_days_ago.getDate() - 4);

		const schools_3_days_past = await db
			.select()
			.from(schools_table)
			.where(
				and(
					lt(schools_table.subscription_expires_at, three_days_ago.toISOString()),
					gt(schools_table.subscription_expires_at, four_days_ago.toISOString()),
				),
			);

		for (const school of schools_3_days_past) {
			try {
				// TODO: Send final reminder
				console.log(
					`[CRON] Would send final reminder to school ${school.id}: grace period ending`,
				);
				reminders_sent.push(`${school.id}:final`);
			} catch (error) {
				errors.push(`School ${school.id}: ${error}`);
				console.error(
					`[CRON] Failed to send final reminder to school ${school.id}:`,
					error,
				);
			}
		}

		// Log job completion
		const details = JSON.stringify({
			reminders_sent: reminders_sent.length,
			errors: errors.length,
			reminder_details: reminders_sent,
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
			`[CRON] ${job_name} completed: ${reminders_sent.length} reminders, ${errors.length} errors`,
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
