import * as z from "zod";
import { command, form, query } from "$app/server";
import { guard_route } from "$lib/auth";
import { announcement_schema } from "$lib/schemas";

export const get_announcement = query(z.string(), async (_id) => {
	try {
		return {};
	} catch (_e) {
		console.error("Error fetching announcement:", _e);
	}
});

export const get_announcements = query(z.string(), async (_school_id) => {
	guard_route();

	try {
		return [];
	} catch (_e) {
		console.error("Error fetching announcements:", _e);
		return [];
	}
});

export const add_announcement = form(announcement_schema, async (parsed) => {
	try {
		console.log("Parsed Announcement:", parsed);

		// await get_announcements(parsed.school_id).refresh();
		return { message: "Announcement created successfully" };
	} catch (_e) {
		return { message: _e.message };
	}
});

export const delete_announcement = command(
	z.object({
		school_id: z.string(),
		announcement_id: z.string(),
	}),
	async (_parsed) => {
		try {
			return { message: "Announcement deleted successfully" };

			// await get_announcements(parsed.school_id).refresh();
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

export const update_announcement = command(
	z.object({
		school_id: z.string(),
		announcement_id: z.string(),
	}),
	async (_parsed) => {
		try {
			return { message: "Announcement updated successfully" };

			// await get_announcements(parsed.school_id).refresh();
		} catch (_e) {
			return { message: _e.message };
		}
	},
);
