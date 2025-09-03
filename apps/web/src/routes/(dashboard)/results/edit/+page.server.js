import { redirect } from "@sveltejs/kit";
import prisma from "../../../../lib/utils/prisma.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const id = url.searchParams.get("id");

	const student = await prisma.student.findUnique({
		where: {
			id,
		},
	});

	// TODO: Throw error if Id is not found...

	return {
		student,
		streamed: { classes: await prisma.class.findMany() },
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const id = form.get("id");
		const name = form.get("name");
		const email = form.get("email");
		const dateOfBirth = form.get("dateOfBirth");
		const classId = form.get("classId") || null;

		const updated = await prisma.student
			.update({
				data: {
					name,
					email,
					dateOfBirth: new Date(dateOfBirth),
					classId,
				},
				where: {
					id,
				},
			})
			.catch((e) => false);

		if (!updated) return { error: "Cannot update student details!!" };

		throw redirect(302, "/students");
	},
};
