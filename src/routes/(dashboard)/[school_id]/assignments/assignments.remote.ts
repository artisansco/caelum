import { error } from "@sveltejs/kit";
import { desc, eq, getTableColumns } from "drizzle-orm";
import z from "zod";
import { command, form, query } from "$app/server";
import { db } from "$lib/db/drizzle";
import { assignments_table, classes_table } from "$lib/db/schema";
import { assignment_schema } from "$lib/schema/assignments";
import { upload_file } from "$lib/upload";

export const get_assignments = query(z.string(), async (school_id) => {
	try {
		const assignments = await db
			.select({
				...getTableColumns(assignments_table),
				class_name: classes_table.name,
			})
			.from(assignments_table)
			.where(eq(assignments_table.school_id, school_id))
			.leftJoin(classes_table, eq(assignments_table.class_id, classes_table.id))
			.orderBy(desc(assignments_table.created_at));

		return assignments.map((assignment) => ({
			...assignment,
			download_url: `/uploads/${assignment.file_name}`,
		}));
	} catch (_e) {
		console.log(_e);
		error(500, { message: "could not load assignments" });
	}
});

export const upload_assignment = form(assignment_schema, async (parsed) => {
	try {
		await db.insert(assignments_table).values({
			title: parsed.title,
			due_date: parsed.due_date,
			file_name: await upload_file(parsed.file),
			class_id: parsed.class_id,
			description: parsed.description,
			school_id: parsed.school_id,
		});

		await get_assignments(parsed.school_id).refresh();
		return { message: "assignment uploaded successfully" };
	} catch (_e) {
		console.log(_e);
		return { message: "failed to upload assignments" };
	}
});

export const delete_assignment = command(
	z.object({
		assignment_id: z.string(),
		school_id: z.string(),
	}),
	async (parsed) => {
		try {
			await db
				.delete(assignments_table)
				.where(eq(assignments_table.id, parsed.assignment_id));

			await get_assignments(parsed.school_id).refresh();
		} catch (_e) {
			console.log(_e);
			return { message: _e.message };
		}
	},
);
