import type { Handle } from "@sveltejs/kit";
import { get_current_user } from "$lib/auth";
import { initialize_cron_jobs, stop_cron_jobs } from "$lib/server/cron/scheduler";

// Initialize cron jobs when server starts
initialize_cron_jobs();

// Graceful shutdown handler
if (typeof process !== "undefined") {
	process.on("SIGTERM", () => {
		console.log("SIGTERM received, stopping cron jobs...");
		stop_cron_jobs();
		process.exit(0);
	});

	process.on("SIGINT", () => {
		console.log("SIGINT received, stopping cron jobs...");
		stop_cron_jobs();
		process.exit(0);
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	const user = get_current_user();

	// Set user in locals if authenticated
	if (user) {
		event.locals.user = user;
	}

	return resolve(event);
};
