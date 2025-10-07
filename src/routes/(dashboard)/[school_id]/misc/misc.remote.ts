import { eq } from "drizzle-orm";
import { z } from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import { db } from "$lib/db/drizzle";
import { subjects_table } from "$lib/db/schema";

const subject_schema = z.object({
	name: z
		.string()
		.trim()
		.min(2, { error: "subject name is too small, 2 or more characters" }),
	code: z
		.string()
		.trim()
		.min(4, { error: "subject code is too small, 4 or more characters" })
		.optional(),
});

export const get_subjects = query(async () => {
	try {
		const subjects = await db.query.subjects_table.findMany();

		return subjects;
	} catch (_e) {
		return [];
	}
});

export const add_subject = form(subject_schema, async (parsed) => {
	try {
		await db.insert(subjects_table).values(parsed);

		await get_subjects().refresh();
		return { message: "subject created successfully" };
	} catch (_e) {
		//@ts-expect-error
		return { message: _e.message };
	}
});

export const delete_subject = command(z.string(), async (subject_id) => {
	try {
		await db.delete(subjects_table).where(eq(subjects_table.id, subject_id));

		await get_subjects().refresh();
	} catch (_e) {
		//@ts-expect-error
		return { message: _e.message };
	}
});

// School Years
export const get_school_years = query(z.string(), async (school_id) => {
	const { fetch } = getRequestEvent();

	try {
		const res = await fetch(
			`${API_ENDPOINT}/api/v1/schools/${school_id}/years`,
		);
		const { message, data } = await res.json();
		if (!res.ok) {
			return [];
		}

		return data.school_years || [];
	} catch (_e) {
		console.error("Error fetching school years:", _e);
		return [];
	}
});

export const add_school_year = form(
	z.object({
		school_id: z.string(),
		name: z
			.string()
			.trim()
			.min(2, { error: "Name must be at least 2 characters long" }),
		start_date: z.iso.date({ error: "Start date is required" }),
		end_date: z.iso.date({ error: "End date is required" }),
		is_active: z.boolean().optional(),
	}),
	async (parsed) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${parsed.school_id}/years`,
				{
					method: "POST",
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

			await get_school_years(parsed.school_id).refresh();
			return { message: "School year added successfully" };
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

export const delete_school_year = command(
	z.object({
		school_id: z.string(),
		year_id: z.string(),
	}),
	async ({ school_id, year_id }) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/years/${year_id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_school_years(school_id).refresh();
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

export const set_active_school_year = command(
	z.object({
		school_id: z.string(),
		year_id: z.string(),
	}),
	async ({ school_id, year_id }) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/years/${year_id}/activate`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_school_years(school_id).refresh();
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

// Departments
export const get_departments = query(z.string(), async (school_id) => {
	const { fetch } = getRequestEvent();

	try {
		const res = await fetch(
			`${API_ENDPOINT}/api/v1/schools/${school_id}/departments`,
		);
		const { message, data } = await res.json();
		if (!res.ok) {
			return [];
		}

		return data.departments || [];
	} catch (_e) {
		console.error("Error fetching departments:", _e);
		return [];
	}
});

export const add_department = form(
	z.object({
		school_id: z.string(),
		name: z
			.string()
			.trim()
			.min(2, { error: "Department name must be at least 2 characters long" }),
		code: z.string().trim().optional(),
		type: z.enum(["academic", "administrative"], {
			error: "Please select a valid type",
		}),
		head_of_department: z.string().trim().optional(),
		description: z.string().trim().optional(),
	}),
	async (parsed) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${parsed.school_id}/departments`,
				{
					method: "POST",
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

			await get_departments(parsed.school_id).refresh();
			return { message: "Department added successfully" };
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

export const delete_department = command(
	z.object({
		school_id: z.string(),
		department_id: z.string(),
	}),
	async ({ school_id, department_id }) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/departments/${department_id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_departments(school_id).refresh();
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

// Announcements
export const get_announcements = query(z.string(), async (school_id) => {
	const { fetch } = getRequestEvent();

	try {
		const res = await fetch(
			`${API_ENDPOINT}/api/v1/schools/${school_id}/announcements`,
		);
		const { message, data } = await res.json();
		if (!res.ok) {
			return [];
		}

		return data.announcements || [];
	} catch (_e) {
		console.error("Error fetching announcements:", _e);
		return [];
	}
});

export const add_announcement = form(
	z.object({
		school_id: z.string(),
		title: z
			.string()
			.trim()
			.min(3, { error: "Title must be at least 3 characters long" }),
		content: z
			.string()
			.trim()
			.min(10, { error: "Content must be at least 10 characters long" }),
		priority: z.enum(["low", "medium", "high"], {
			error: "Please select a valid priority",
		}),
		type: z.enum(["general", "urgent", "event", "academic", "administrative"], {
			error: "Please select a valid type",
		}),
		target_audience: z.string().optional(),
		expires_at: z.iso.date().optional().or(z.literal("")),
		is_active: z.boolean().optional(),
	}),
	async (parsed) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			// Clean data
			const cleanData = {
				...parsed,
				expires_at: parsed.expires_at || undefined,
			};

			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${parsed.school_id}/announcements`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
					body: JSON.stringify(cleanData),
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_announcements(parsed.school_id).refresh();
			return { message: "Announcement created successfully" };
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

export const delete_announcement = command(
	z.object({
		school_id: z.string(),
		announcement_id: z.string(),
	}),
	async ({ school_id, announcement_id }) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/announcements/${announcement_id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_announcements(school_id).refresh();
		} catch (_e) {
			return { message: _e.message };
		}
	},
);

export const toggle_announcement_status = command(
	z.object({
		school_id: z.string(),
		announcement_id: z.string(),
	}),
	async ({ school_id, announcement_id }) => {
		const { cookies, fetch } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/announcements/${announcement_id}/toggle`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies.get("token")}`,
					},
				},
			);
			const { message } = await res.json();
			if (!res.ok) {
				return { message };
			}

			await get_announcements(school_id).refresh();
		} catch (_e) {
			return { message: _e.message };
		}
	},
);
