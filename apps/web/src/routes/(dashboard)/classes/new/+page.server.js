import { redirect } from "@sveltejs/kit";
import prisma from "$lib/utils/prisma.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({}) {}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const name = form.get("name");

		const newClass = await prisma.class
			.create({
				data: {
					id: crypto.randomUUID(),
					name,
				},
			})
			.catch((e) => null);

		if (!newClass) return { error: "Class already exists!!" };

		throw redirect(302, "/classes");
	},
};
