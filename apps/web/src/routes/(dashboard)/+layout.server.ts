import { redirect } from "@sveltejs/kit";
import { get_current_user } from "../auth.remote";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
	const user = get_current_user();
	if (!user) {
		redirect(302, "/");
	}
};
