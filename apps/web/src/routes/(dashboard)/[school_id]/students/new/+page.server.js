import { redirect } from "@sveltejs/kit";
import prisma from "../../../../lib/utils/prisma.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({}) {
	return { streamed: { classes: await prisma.class.findMany() } };
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const name = form.get("name");
		const email = form.get("email");
		const gender = form.get("gender");
		const dateOfBirth = form.get("dateOfBirth");
		const classId = form.get("classId");

		const student = await prisma.student
			.create({
				data: {
					id: crypto.randomUUID(),
					name,
					email,
					roll: `SRMS${crypto.randomUUID().split("-")[1]}`.toUpperCase(),
					gender,
					dateOfBirth: new Date(dateOfBirth),
					classId,
				},
			})
			.catch((e) => false);

		if (!student) return { error: "Student has already been registered!!" };

		throw redirect(302, "/students");
	},
};
