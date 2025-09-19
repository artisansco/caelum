import z from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";

// Mock function to get assignments - replace with actual database query
const getAssignments = async () => {
	return [
		{
			id: 1,
			title: "Math Homework Chapter 5",
			description: "Complete exercises 1-20 from Chapter 5",
			className: "Grade 10 - Section A",
			classId: 1,
			dueDate: "2024-01-15",
			uploadedDate: "2024-01-10",
			fileName: "math_homework_ch5.pdf",
			filePath: "/uploads/assignments/math_homework_ch5.pdf",
			fileSize: 1024000,
			uploadedBy: "admin",
			schoolId: "019958a5-b4de-7662-839c-fd3f74e9754b",
		},
		{
			id: 2,
			title: "Science Lab Report",
			description: "Write a detailed lab report on the chemistry experiment",
			className: "Grade 9 - Section B",
			classId: 2,
			dueDate: "2024-01-20",
			uploadedDate: "2024-01-12",
			fileName: "science_lab_report.docx",
			filePath: "/uploads/assignments/science_lab_report.docx",
			fileSize: 512000,
			// uploadedBy: locals?.user?.username,
			schoolId: "019958a5-941a-77b2-8a6c-9d2930e10dc3",
		},
	];
};

const assignment_schema = z.object({
	school_id: z.string(),
	class_id: z.string(),
	title: z.string().trim().min(2),
	description: z.string().trim().optional(),
	due_date: z.iso.date(),
	file: z.file().optional(),
});

/*
if (!allowedTypes.includes(file.type)) {
			return fail(400, {
				error:
					"Invalid file type. Only PDF, DOC, DOCX, PPT, and PPTX files are allowed",
				title,
				description,
				classId,
				dueDate,
			});
		}

		// Validate file size (10MB limit)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return fail(400, {
				error: "File size too large. Maximum size is 10MB",
				title,
				description,
				classId,
				dueDate,
			});
		}
*/

export const get_assignments = query(
	z.string().trim().min(5),
	async (school_id) => {
		// TODO: collect the school_id from getRequestEvent when supported
		const assignments = await getAssignments();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/assignments`,
			);
			const { message, data } = await res.json();

			if (!res.ok) {
				return { message };
			}

			console.log(data.assignments);
			return data.assignments;
		} catch (_e) {}

		console.log({ assignments });
	},
);

export const upload_assignment = form(async (form_data) => {
	const form = Object.fromEntries(form_data);
	const { success, data: parsed, error } = assignment_schema.safeParse(form);

	if (!success) {
		const message = error.issues.at(0)?.message;
		return { message };
	}

	const { cookies } = getRequestEvent();
	try {
		const res = await fetch(
			`${API_ENDPOINT}/api/v1/schools/${parsed.school_id}/assignments`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authentication: `Bearer ${cookies.get("token")}`,
				},
				body: JSON.stringify(parsed),
			},
		);
		const { message } = await res.json();

		if (!res.ok) {
			return { message };
		}

		get_assignments(parsed.school_id).refresh();
	} catch (_e) {
		console.log(_e);
	}
});

export const delete_assignment = command(
	z.object({
		school_id: z.string().trim(),
		assignment_id: z.string().trim(),
	}),
	async ({ school_id, assignment_id }) => {
		const { cookies } = getRequestEvent();

		try {
			const res = await fetch(
				`${API_ENDPOINT}/api/v1/schools/${school_id}/assignments/${assignment_id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authentication: `Bearer ${cookies.get("token")}`,
					},
				},
			);
			const { message } = await res.json();

			if (!res.ok) {
				return { message: message as string };
			}

			// get_assignments(parsed.school_id).refresh();
		} catch (_e) {
			console.log(_e);
		}
	},
);

const classes = [
	{
		id: crypto.randomUUID(),
		name: "Grade 10",
		schoolId: "019962d7-0dbc-7732-a799-0f533a2d49fd",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: crypto.randomUUID(),
		name: "Grade 9",
		schoolId: "019962d7-2af0-72f2-9145-ebc06e942d38",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: crypto.randomUUID(),
		name: "Grade 11",
		schoolId: "019962d7-4d3c-71a0-b310-83949279c6a3",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: crypto.randomUUID(),
		name: "Grade 8",
		schoolId: "019962d7-65e2-7ac3-b694-245b7b6a902b",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

export const get_classes = query(async () => classes);
