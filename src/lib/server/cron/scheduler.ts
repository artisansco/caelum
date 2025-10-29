import cron from "node-cron";
import { check_expired_subscriptions } from "./tasks/subscriptions";
import { send_renewal_reminders } from "./tasks/reminders";
import { reset_sms_quotas } from "./tasks/sms";

let cron_jobs_initialized = false;
const scheduled_tasks: cron.ScheduledTask[] = [];

/**
 * Initialize all cron jobs
 * Should be called once when the server starts
 */
export function initialize_cron_jobs(): void {
	// Prevent double initialization
	if (cron_jobs_initialized) {
		console.log("[CRON] Jobs already initialized, skipping...");
		return;
	}

	console.log("[CRON] Initializing cron jobs...");

	// Check expired subscriptions daily at 9 AM
	const subscription_checker = cron.schedule(
		"0 9 * * *",
		async () => {
			await check_expired_subscriptions();
		},
		{
			timezone: "Africa/Freetown", // Sierra Leone timezone
		},
	);
	scheduled_tasks.push(subscription_checker);
	console.log("[CRON] ✓ Scheduled: check_expired_subscriptions (daily at 9 AM)");

	// Send renewal reminders daily at 8 AM
	const reminder_sender = cron.schedule(
		"0 8 * * *",
		async () => {
			await send_renewal_reminders();
		},
		{
			timezone: "Africa/Freetown",
		},
	);
	scheduled_tasks.push(reminder_sender);
	console.log("[CRON] ✓ Scheduled: send_renewal_reminders (daily at 8 AM)");

	// Reset SMS quotas monthly on the 1st at midnight
	const sms_quota_resetter = cron.schedule(
		"0 0 1 * *",
		async () => {
			await reset_sms_quotas();
		},
		{
			timezone: "Africa/Freetown",
		},
	);
	scheduled_tasks.push(sms_quota_resetter);
	console.log("[CRON] ✓ Scheduled: reset_sms_quotas (monthly on 1st at midnight)");

	cron_jobs_initialized = true;
	console.log(`[CRON] All ${scheduled_tasks.length} cron jobs initialized successfully`);
}

/**
 * Stop all cron jobs (graceful shutdown)
 */
export function stop_cron_jobs(): void {
	if (!cron_jobs_initialized) {
		return;
	}

	console.log("[CRON] Stopping all cron jobs...");

	for (const task of scheduled_tasks) {
		task.stop();
	}

	scheduled_tasks.length = 0;
	cron_jobs_initialized = false;

	console.log("[CRON] All cron jobs stopped");
}

/**
 * Get status of cron jobs
 */
export function get_cron_status(): {
	initialized: boolean;
	active_jobs: number;
} {
	return {
		initialized: cron_jobs_initialized,
		active_jobs: scheduled_tasks.length,
	};
}

/**
 * Manually trigger a cron job (for testing)
 */
export async function trigger_cron_job(job_name: string): Promise<void> {
	console.log(`[CRON] Manually triggering: ${job_name}`);

	switch (job_name) {
		case "check_expired_subscriptions":
			await check_expired_subscriptions();
			break;
		case "send_renewal_reminders":
			await send_renewal_reminders();
			break;
		case "reset_sms_quotas":
			await reset_sms_quotas();
			break;
		default:
			throw new Error(`Unknown cron job: ${job_name}`);
	}
}
