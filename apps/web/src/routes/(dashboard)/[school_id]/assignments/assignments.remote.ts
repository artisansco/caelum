import { query } from "$app/server";

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

export const get_assignments = query(async () => {
	const assignments = await getAssignments();

	return assignments;
});
