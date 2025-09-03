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
		const name = form.get("subject_name");
		const subjectCode = form.get("subject_code");
		const classId = form.get("classId");

		const newClass = await prisma.subject
			.create({
				data: {
					id: crypto.randomUUID(),
					subjectCode,
					name,
					classes: {
						connect: {
							id: classId,
						},
					},
				},
			})
			.catch((e) => false);

		if (!newClass) return { error: "Subject already exists!!" };

		throw redirect(302, "/subjects");
	},
};
