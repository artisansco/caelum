import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	//  if (event.url.pathname.startsWith('/custom')) {
	// 	return new Response('custom response');
	// }
	const token = event.cookies.get("token");

	if (!token) {
		return await resolve(event);
	}

	try {
		const decoded = JSON.parse(
			Buffer.from(token.split(".")[1], "base64").toString(),
		);

		// event.locals.user = decoded as CurrentUser;
		event.locals.school_id = decoded.school_id as string;
	} catch (_) {
		event.cookies.delete("token", { path: "/" }); // extra precaution if token was wrong
		return await resolve(event);
	}

	return await resolve(event);
};
