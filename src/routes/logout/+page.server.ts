import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  throw redirect(302, "/");
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies }) => {
    cookies.set("session", "", {
      path: "/",
      expires: new Date(0),
    });

    throw redirect(302, "/");
  },
};
