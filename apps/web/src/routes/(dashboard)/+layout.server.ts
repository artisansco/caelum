import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get("token");
	if (!token) {
		redirect(302, "/");
	}

	try {
		const decoded = JSON.parse(
			Buffer.from(token.split(".")[1], "base64").toString(),
		);
		console.log({ decoded });
	} catch (_e) {
		redirect(302, "/");
	}
};
