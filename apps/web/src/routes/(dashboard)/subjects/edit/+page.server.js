import { redirect } from "@sveltejs/kit";
import prisma from "../../../../lib/utils/prisma.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const id = url.searchParams.get("id");

	const subject = await prisma.subject.findUnique({
		where: {
			id,
		},
	});

	// TODO: Throw error if Id is not found...

	return {
		subject,
		streamed: { classes: await prisma.class.findMany() },
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const id = form.get("id");
		const name = form.get("subject_name");
		const subjectCode = form.get("subject_code");
		const classId = form.get("classId");

		const updated = await prisma.subject
			.update({
				data: {
					name,
					subjectCode,
					classes: {
						connect: {
							id: classId,
						},
					},
				},
				where: {
					id,
				},
			})
			.catch((e) => false);

		if (!updated) return { error: "Subject already exists, cannot update!!" };

		throw redirect(302, "/subjects");
	},
};
