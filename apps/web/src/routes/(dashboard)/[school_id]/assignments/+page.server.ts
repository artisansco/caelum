import { error, fail } from "@sveltejs/kit";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const { school_id } = params;

	// if (!locals?.user) {
	// 	throw error(401, "Unauthorized");
	// }

	// Mock function to get classes - replace with actual database query
	const getClasses = async () => {
		// This should be replaced with actual database query
		// Example: return await db.class.findMany({ where: { schoolId: parseInt(school_id) } });
		return [
			{
				id: 1,
				name: "Grade 10",
				section: "A",
				schoolId: parseInt(school_id),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 2,
				name: "Grade 9",
				section: "B",
				schoolId: parseInt(school_id),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 3,
				name: "Grade 11",
				section: "A",
				schoolId: parseInt(school_id),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: 4,
				name: "Grade 8",
				section: "C",
				schoolId: parseInt(school_id),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		];
	};

	// Mock function to get assignments - replace with actual database query
	const getAssignments = async () => {
		// This should be replaced with actual database query
		// Example: return await db.assignment.findMany({ where: { schoolId: parseInt(school_id) }, include: { class: true } });
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
				uploadedBy: locals?.user?.username,
				schoolId: parseInt(school_id),
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
				uploadedBy: locals?.user?.username,
				schoolId: parseInt(school_id),
			},
		];
	};

	return {
		assignments: await getAssignments(),
		classes: getClasses(),
		schoolId: school_id,
	};
};

export const actions: Actions = {
	upload: async ({ request, params, locals }) => {
		if (!locals?.user) {
			return fail(401, { error: "Unauthorized" });
		}

		const { school_id } = params;
		const formData = await request.formData();

		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const classId = formData.get("classId") as string;
		const dueDate = formData.get("dueDate") as string;
		const file = formData.get("file") as File;

		// Validate required fields
		if (!title || !classId || !file) {
			return fail(400, {
				error: "Title, class, and file are required",
				title,
				description,
				classId,
				dueDate,
			});
		}

		// Validate file type
		const allowedTypes = [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.ms-powerpoint",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation",
		];

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

		try {
			// Create unique filename
			const fileExtension = file.name.split(".").pop();
			const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;

			// Create upload directory if it doesn't exist
			const uploadDir = join(
				process.cwd(),
				"static",
				"uploads",
				"assignments",
				school_id,
			);
			await mkdir(uploadDir, { recursive: true });

			// Save file
			const filePath = join(uploadDir, uniqueFileName);
			const fileBuffer = Buffer.from(await file.arrayBuffer());
			await writeFile(filePath, fileBuffer);

			// Create assignment record in database
			// This should be replaced with actual database insertion
			// Example:
			// const assignment = await db.assignment.create({
			//   data: {
			//     title,
			//     description,
			//     classId: parseInt(classId),
			//     dueDate: dueDate ? new Date(dueDate) : null,
			//     fileName: file.name,
			//     filePath: `/uploads/assignments/${school_id}/${uniqueFileName}`,
			//     fileSize: file.size,
			//     uploadedBy: locals?.user?.id,
			//     schoolId: parseInt(school_id),
			//   },
			// });

			const assignment = {
				id: Date.now(), // temporary ID
				title,
				description,
				classId: parseInt(classId),
				dueDate: dueDate || new Date().toISOString().split("T")[0],
				fileName: file.name,
				filePath: `/uploads/assignments/${school_id}/${uniqueFileName}`,
				fileSize: file.size,
				uploadedBy: locals?.user?.username,
				schoolId: parseInt(school_id),
				uploadedDate: new Date().toISOString().split("T")[0],
				className: "Unknown Class", // This should come from the database
			};

			return {
				success: true,
				message: "Assignment uploaded successfully!",
				assignment,
			};
		} catch (err) {
			console.error("Error uploading assignment:", err);
			return fail(500, {
				error: "Failed to upload assignment. Please try again.",
				title,
				description,
				classId,
				dueDate,
			});
		}
	},

	delete: async ({ request, params, locals }) => {
		if (!locals?.user) {
			return fail(401, { error: "Unauthorized" });
		}

		const formData = await request.formData();
		const assignmentId = formData.get("assignmentId") as string;

		if (!assignmentId) {
			return fail(400, { error: "Assignment ID is required" });
		}

		try {
			// Delete assignment from database and file system
			// This should be replaced with actual database deletion
			// Example:
			// const assignment = await db.assignment.findUnique({
			//   where: { id: parseInt(assignmentId) }
			// });
			// if (assignment) {
			//   await unlink(join(process.cwd(), 'static', assignment.filePath));
			//   await db.assignment.delete({ where: { id: parseInt(assignmentId) } });
			// }

			return {
				success: true,
				message: "Assignment deleted successfully!",
			};
		} catch (err) {
			console.error("Error deleting assignment:", err);
			return fail(500, { error: "Failed to delete assignment" });
		}
	},
};
