import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";
import { command, form, query } from "$app/server";
import { staff_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const get_all_staff = query(v.string(), async (school_id) => {
	const { success, data, message } = await database.get_all_staff(school_id, {
		limit: -1,
	});

	if (!success) {
		console.error(message);
		return [];
	}

	return data || [];
});

export const get_staff = query(v.string(), async (staff_id) => {
	const { success, data, message } = await database.get_staff(staff_id);

	if (!success) {
		console.error(message);
		error(500, { message: message || "Failed to fetch staff" });
	}

	if (!data) {
		error(404, { message: "Staff not found" });
	}

	return data;
});

export const add_staff = form(staff_schema, async (parsed) => {
	const { success, message } = await database.create_staff({
		staff_id: parsed.staff_id,
		first_name: parsed.first_name,
		middle_name: parsed.middle_name,
		last_name: parsed.last_name,
		email: parsed.email,
		password: parsed.password,
		contact: parsed.phone_number,
		address: parsed.address,
		role: parsed.role,
		permissions: parsed.permissions,
		school_id: parsed.school_id,
		employed_date: parsed.employed_on,
	});

	if (!success) {
		return {
			message: message || "An error occurred while creating the staff",
		};
	}

	redirect(308, `./`);
});

export const update_staff = form(
	staff_schema.omit({ employed_on: true }),
	async (parsed) => {
		const { success, message } = await database.update_staff(parsed.staff_id, {
			first_name: parsed.first_name,
			middle_name: parsed.middle_name,
			last_name: parsed.last_name,
			email: parsed.email,
			role: parsed.role,
			permissions: parsed.permissions,
		});

		if (!success) {
			return { message: message || "Could not update staff member" };
		}

		await get_staff(parsed.staff_id).refresh();
		return { message: "Staff member updated successfully" };
	},
);

export const delete_staff = command(v.string(), async (staff_id) => {
	const { success, message } = await database.delete_staff(staff_id);

	if (!success) {
		return { message: message || "Could not delete staff member" };
	}
});
