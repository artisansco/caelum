import { type Handle, redirect } from "@sveltejs/kit";
import { get_current_user } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
	const user = get_current_user();

	// Guard: If no user and not on public route, redirect early
	if (!user && event.url.pathname !== "/" && event.url.pathname !== "/register") {
		throw redirect(302, "/");
	}

	// Guard: If no user, allow on public routes
	if (!user) {
		return resolve(event);
	}

	// Authenticated path
	event.locals.user = user;
	return resolve(event);
};
