import { redirect } from "@sveltejs/kit";
import prisma from "../lib/utils/prisma.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  // await prisma.admin.create({
  // 	data: {
  // 		id: crypto.randomUUID(),
  // 		username: "John",
  // 		email: "john@gmail.com",
  // 		password: "password",
  // 	},
  // });
  if (locals.admin) throw redirect(302, "/dashboard");
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies, request }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");

    const admin = await prisma.admin.findFirst({
      where: {
        username,
        password,
      },
    });

    if (!admin) return { error: "Invalid Username and Password!" };

    await prisma.admin.update({
      data: {
        lastLoggedIn: new Date(),
      },
      where: {
        username,
      },
    });

    cookies.set("session", admin.id, {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    throw redirect(302, "/dashboard");
  },
};
