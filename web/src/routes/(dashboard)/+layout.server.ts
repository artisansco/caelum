import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  if (!locals.admin) throw redirect(302, "/");

  return { admin: locals.admin };
}
