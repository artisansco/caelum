import { error, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
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
	role: z.enum(["admin", "staff"]),
	school_id: z
		.string({ error: "Invalid school ID" })
		.trim()
		.min(2, { error: "School ID must be at least 2 characters long" }),
});

export const get_all_staff = query(async () => {
	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff`);
		const { data, message } = await res.json();
		if (!res.ok) {
			return { message };
		}

		return data.staff;
	} catch (_e) {
		console.error(_e);
		return { message: "failed to fetch staff" };
	}
});

export const get_staff_by_id = query(
	z
		.string()
		.trim()
		.min(2, { error: "Staff ID must be at least 2 characters long" }),
	async (staff_id) => {
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
	},
);

export const add_staff = form(async (form_data) => {
	const form = Object.fromEntries(form_data);
	form.permissions = (form_data.getAll("permissions") ||
		[]) as unknown as FormDataEntryValue;
	const { success, data: parsed, error } = staff_schema.safeParse(form);

	if (!success) {
		const message = error.issues.at(0)?.message as string;
		return { message, errors: z.treeifyError(error).properties };
	}

	const { cookies } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
			body: JSON.stringify(parsed),
		});
		const { data, message } = await res.json();
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

export const update_staff = form(async (form_data) => {
	const form = Object.fromEntries(form_data);
	form.permissions = (form_data.getAll("permissions") ||
		[]) as unknown as FormDataEntryValue;
	const {
		success,
		data: parsed,
		error,
	} = staff_schema
		.partial({ password: true })
		.omit({ employed_on: true })
		.safeParse(form);

	if (!success) {
		const message = error.issues.at(0)?.message as string;
		return { message, errors: z.treeifyError(error).properties };
	}

	const { cookies } = getRequestEvent();
	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff/${parsed.staff_id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
			body: JSON.stringify(parsed),
		});
		const { message, data } = await res.json();
		if (!res.ok) {
			return { message };
		}
		return { message: "Staff member updated successfully" };
	} catch (_e) {
		// @ts-expect-error
		return { message: _e.message };
	}
});

export const delete_staff = form(async (form) => {
	const id = form.get("staff_id") as string;

	const { cookies } = getRequestEvent();
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

	redirect(308, "./");
});
