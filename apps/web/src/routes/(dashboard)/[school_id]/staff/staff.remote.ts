import { error, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import { staff_roles } from "$lib/constants";
import type { Staff } from "$lib/types";

const staff_schema = z.object({
	first_name: z
		.string({ error: "First name is required" })
		.trim()
		.min(2, { error: "First name must be at least 2 characters long" }),
	middle_name: z
		.string({ error: "Middle name is required" })
		.trim()
		.min(2, { error: "Middle name must be at least 2 characters long" })
		.optional(),
	last_name: z
		.string({ error: "Last name is required" })
		.trim()
		.min(2, { error: "Last name must be at least 2 characters long" }),
	staff_id: z
		.string({ error: "Staff ID is required" })
		.trim()
		.min(2, { error: "Staff ID must be at least 2 characters long" }),
	email: z.email({ error: "Invalid email address" }),
	employed_on: z.iso.date({ error: "Invalid date format" }),
	address: z
		.string({ error: "Invalid address" })
		.trim()
		.min(2, { error: "Address must be at least 2 characters long" }),
	phone_number: z
		.string({ error: "Invalid phone number" })
		.trim()
		.min(6, { error: "Phone number must be at least 6 characters long" }),
	password: z
		.string({ error: "Invalid password" })
		.trim()
		.min(6, { error: "Password must be at least 6 characters long" }),
	permissions: z
		.array(z.string().trim(), { error: "Permissions are required" })
		.min(1, { error: "At least one permission is required" }),
	role: z.enum(staff_roles),
	school_id: z
		.string({ error: "Invalid school ID" })
		.trim()
		.min(2, { error: "School ID must be at least 2 characters long" }),
});

export const get_all_staff = query(z.string(), async (school_id) => {
	const { fetch } = getRequestEvent();

	const res = await fetch(`${API_ENDPOINT}/api/v1/schools/${school_id}/staff`);
	if (!res.ok) {
		console.log(res.statusText);
	}
	const { data } = await res.json();
	return data.staff as Staff[];
});

export const get_staff_by_id = query(z.string().trim(), async (staff_id) => {
	const { fetch } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff/${staff_id}`);
		const { data, message } = await res.json();
		if (!res.ok) {
			error(404, { message });
		}

		return data as Staff;
	} catch (_e) {
		console.error(_e);
		// @ts-expect-error
		error(500, { message: _e.message });
	}
});

export const add_staff = form(staff_schema, async (parsed) => {
	const { cookies, fetch } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
			body: JSON.stringify(parsed),
		});
		const { message } = await res.json();
		if (!res.ok) {
			return { message };
		}
	} catch (_e) {
		console.error(_e);
		// @ts-expect-error
		return { message: _e.message };
	}

	redirect(302, `/${parsed.school_id}/staff`);
});

export const update_staff = form(
	staff_schema.omit({ employed_on: true, password: true }),
	async (parsed) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/staff/${parsed.staff_id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
					body: JSON.stringify(parsed),
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_staff_by_id(parsed.staff_id).refresh();
			return { message: "Staff member updated successfully" };
		} catch (_e) {
			// @ts-expect-error
			return { message: _e.message };
		}
	},
);

export const delete_staff = command(z.string(), async (id) => {
	const { cookies, fetch } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
		});
		const { message, data } = await res.json();
		if (!res.ok) {
			return { message };
		}
		console.log({ data });
	} catch (_e) {
		// @ts-expect-error
		return { message: _e.message };
	}
});
