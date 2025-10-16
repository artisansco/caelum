import { desc, eq } from "drizzle-orm";
import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { guard_route } from "$lib/auth";
import { announcements_table, db } from "$lib/db";
import { announcement_schema } from "$lib/schemas";

export const get_announcement = query(v.string(), async (_id) => {
	try {
		return {};
	} catch (_e) {
		console.error("Error fetching announcement:", _e);
	}
});

export const get_announcements = query(async () => {
	guard_route();

	const { locals } = getRequestEvent();

	try {
		const announcements = await db
			.select()
			.from(announcements_table)
			.where(eq(announcements_table.school_id, locals.school_id))
			.orderBy(desc(announcements_table.created_at));

		return announcements;
	} catch (_e) {
		console.error("Error fetching announcements:", _e);
		return [];
	}
});

export const add_announcement = form(announcement_schema, async (parsed) => {
	try {
		await db.insert(announcements_table).values(parsed);

		await get_announcements().refresh();
	} catch (_e) {
		return { message: _e.message };
	}
});

export const delete_announcement = command(
	v.string(),
	async (announcement_id) => {
		try {
			await db
				.delete(announcements_table)
				.where(eq(announcements_table.id, announcement_id));

			await get_announcements().refresh();
			return { message: "Announcement deleted successfully" };
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

export const update_announcement = command(
	announcement_schema,
	async (_parsed) => {
		try {
			return { message: "Announcement updated successfully" };

			// await get_announcements(parsed.school_id).refresh();
		} catch (_e) {
			return { message: _e.message };
		}
	},
);
