import { redirect } from "@sveltejs/kit";
import prisma from "../../../../lib/utils/prisma.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({}) {
	return {
		classes: await prisma.class.findMany({
			include: {
				subjects: true,
			},
		}),
		students: await prisma.student.findMany(),
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const classId = form.get("classId");
		const studentId = form.get("studentId");
		const marks = form.get("marks");
		// const gender = form.get("gender");
		// const dateOfBirth = form.get("dateOfBirth");

		console.log({ classId, studentId, marks });
		// const student = await prisma.student
		// 	.create({
		// 		data: {
		// 			id: crypto.randomUUID(),
		// 			name,
		// 			email,
		// 			roll: `SRMS${crypto.randomUUID().split("-")[1]}`.toUpperCase(),
		// 			gender,
		// 			dateOfBirth: new Date(dateOfBirth),
		// 			classId,
		// 		},
		// 	})
		// 	.catch((e) => false);

		// if (!student) return { error: "Student has already been registered!!" };

		// throw redirect(302, "/students");
	},
};
