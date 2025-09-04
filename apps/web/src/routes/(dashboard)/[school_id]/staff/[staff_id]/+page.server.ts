import { API_ENDPOINT } from "$env/static/private";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Staff } from "$lib/types";

export const load:PageServerLoad = async ({ params,fetch }) => {

  try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff/${params.staff_id}`, );
		const { data, message } = await res.json();
		if (!res.ok) {
			error(500,{message});
		}

		console.log("staff", data);
    return { staff: data as Staff }
	} catch (_e) {
		console.error(_e);
		error(500,{message:"failed to fetch staff member"})
	}



}
