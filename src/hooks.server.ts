import { type Handle } from "@sveltejs/kit";
import { get_current_user } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
	const user = get_current_user();

	// Set user in locals if authenticated
	if (user) {
		event.locals.user = user;
	}

	return resolve(event);
};
