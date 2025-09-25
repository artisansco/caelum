import { error, redirect } from "@sveltejs/kit";
import z from "zod";
import { getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import type { School } from "$lib/types";
import { get_current_user } from "$lib/user";

export const get_school = query(z.string(), async (id) => {
	if (get_current_user() === null) {
		redirect(302, "/");
	}

	const { fetch } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/schools/${id}`);
		const { message, data } = await res.json();

		if (!res.ok) {
			error(404, { message });
		}

		return data as School;
	} catch (_e) {
		console.log(_e);
		error(500, { message: "error" });
	}
});
