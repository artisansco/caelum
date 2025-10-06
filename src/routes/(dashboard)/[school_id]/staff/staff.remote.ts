import { error, redirect } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { command, form, query } from "$app/server";
import { db } from "$lib/db/drizzle";
import { staff_table } from "$lib/db/schema";
import { staff_schema } from "$lib/schema/staff";

export const get_all_staff = query(z.string(), async (school_id) => {
	// const limit = Number(c.req.query("limit")) || 10;

	const staff = await db.query.staff_table.findMany({
		where: eq(staff_table.school_id, school_id),
		orderBy: desc(staff_table.created_at),
		limit: 10,
	});

	// return { message: "All staff fetched successfully" };

	return staff;
});

export const get_staff_by_id = query(z.string().trim(), async (staff_id) => {
	try {
		const staff = await db.query.staff_table.findFirst({
			where: eq(staff_table.id, staff_id),
		});

		if (!staff) {
			error(404, { message: "staff not found" });
		}

		return {
			...staff,
			permissions: staff.permissions?.split(","),
		};
	} catch (_e) {
		console.error(_e);
		error(404, { message: "staff not found" });
	}
});

export const add_staff = form(staff_schema, async (parsed) => {
	try {
		await db
			.insert(staff_table)
			.values({
				staff_id: parsed.staff_id,
				first_name: parsed.first_name,
				middle_name: parsed.middle_name,
				last_name: parsed.last_name,
				email: parsed.email,
				employed_date: parsed.employed_on,
				role: parsed.role,
				permissions: parsed.permissions,
				password: parsed.password,
				contact: parsed.phone_number,
				address: parsed.address,
				school_id: parsed.school_id,
			})
			.returning();
	} catch (_e) {
		console.log(_e);
		return { message: "An error occurred while creating the staff" };
	}

	redirect(308, `./`);
});

export const update_staff = form(
	staff_schema.omit({ employed_on: true, password: true }),
	async (parsed) => {
		try {
			await db
				.update(staff_table)
				.set({
					first_name: parsed.first_name,
					middle_name: parsed.middle_name,
					last_name: parsed.last_name,
					email: parsed.email,
					role: parsed.role,
					permissions: parsed.permissions,
					// password: parsed.password,
				})
				.where(eq(staff_table.id, parsed.staff_id))
				.returning();

			await get_staff_by_id(parsed.staff_id).refresh();
			return { message: "Staff member updated successfully" };
		} catch (_e) {
			console.log(_e);
			return { message: "could not update staff member" };
		}
	},
);

export const delete_staff = command(z.string(), async (staff_id) => {
	try {
		await db
			.delete(staff_table)
			.where(eq(staff_table.id, staff_id))
			.returning();
	} catch (_e) {
		console.log(_e);
		return { message: "could not delete staff member" };
	}
});
