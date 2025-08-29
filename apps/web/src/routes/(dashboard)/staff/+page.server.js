import { redirect } from "@sveltejs/kit";
import prisma from "../../../lib/utils/prisma.js";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const students = [];
	// await prisma.student.findMany({
	//   include: {
	//     class: {
	//       select: {
	//         name: true,
	//         section: true,
	//       },
	//     },
	//   },
	// });
	return { students };
}

/** @type {import('./$types').Actions} */
export const actions = {
	deleteStudent: async ({ request }) => {
		const form = await request.formData();
		const id = form.get("id");

		const deleted = await prisma.student
			.delete({
				where: {
					id,
				},
			})
			.catch((e) => false);

		throw redirect(302, "/students");
	},
};
