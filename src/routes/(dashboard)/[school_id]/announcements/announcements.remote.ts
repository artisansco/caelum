import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { announcement_schema } from "$lib/schemas";
import { database } from "$lib/server/database/queries";

export const get_announcement = query(v.string(), async (_id) => {
	const { success, data, message } = await database.get_announcement(_id);

	if (!success) {
		console.error(message);
		return {};
	}

	return data || {};
});

export const get_announcements_query = query(async () => {
	const { locals } = getRequestEvent();

	const { success, data, message } = await database.get_announcements(
		locals.school_id,
	);

	if (!success) {
		console.error(message);
		return [];
	}

	return data || [];
});

export const add_announcement = form(announcement_schema, async (parsed) => {
	const { success, message } = await database.create_announcement({
		school_id: parsed.school_id,
		title: parsed.title,
		content: parsed.content,
		priority: parsed.priority,
		type: parsed.type,
		target_audience: parsed.target_audience,
	});

	if (!success) {
		return { message: message || "Failed to create announcement" };
	}

	await get_announcements_query().refresh();
});

export const delete_announcement_command = command(
	v.string(),
	async (announcement_id) => {
		const { success, message } =
			await database.delete_announcement(announcement_id);

		if (!success) {
			return { message: message || "Failed to delete announcement" };
		}

		await get_announcements_query().refresh();
		return { message: "Announcement deleted successfully" };
	},
);

export const update_announcement_command = command(
	v.object({
		announcement_id: v.string(),
		school_id: v.string(),
		title: v.string(),
		content: v.string(),
		priority: v.optional(
			v.union([v.literal("low"), v.literal("medium"), v.literal("high")]),
		),
		type: v.optional(
			v.union([
				v.literal("general"),
				v.literal("urgent"),
				v.literal("event"),
				v.literal("academic"),
				v.literal("administrative"),
			]),
		),
		target_audience: v.optional(
			v.union([v.literal("students"), v.literal("staff"), v.literal("all")]),
		),
	}),
	async (parsed) => {
		const { success, message } = await database.update_announcement(
			parsed.announcement_id,
			{
				school_id: parsed.school_id,
				title: parsed.title,
				content: parsed.content,
				priority: parsed.priority,
				type: parsed.type,
				target_audience: parsed.target_audience,
			},
		);

		if (!success) {
			return { message: message || "Failed to update announcement" };
		}

		await get_announcements_query().refresh();
		return { message: "Announcement updated successfully" };
	},
);

// Export with original names for backwards compatibility
export const get_announcements = get_announcements_query;
export const delete_announcement = delete_announcement_command;
export const update_announcement = update_announcement_command;
