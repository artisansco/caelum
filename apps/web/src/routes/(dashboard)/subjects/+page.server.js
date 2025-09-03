import { redirect } from "@sveltejs/kit";
import prisma from "../../../lib/utils/prisma.js";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const subjects = await prisma.subject.findMany({
		include: {
			classes: {
				select: {
					name: true,
					section: true,
				},
			},
		},
	});

	return { subjects };
}

/** @type {import('./$types').Actions} */
export const actions = {
	deleteSubject: async ({ request }) => {
		const form = await request.formData();
		const id = form.get("id");

		const deleted = await prisma.subject
			.delete({
				where: {
					id,
				},
			})
			.catch((e) => null);

		throw redirect(302, "/subjects");
	},
};
