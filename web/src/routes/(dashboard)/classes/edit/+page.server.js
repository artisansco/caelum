import { redirect } from "@sveltejs/kit";
import prisma from "$lib/utils/prisma.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const id = url.searchParams.get("id");

  const editClass = await prisma.class.findUnique({
    where: {
      id,
    },
    include: {
      subjects: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // TODO: Throw error if Id is not found...

  return {
    editClass,
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  updateClass: async ({ request }) => {
    const form = await request.formData();
    const id = form.get("id");
    const name = form.get("name");

    const updated = await prisma.class
      .update({
        data: {
          name,
        },
        where: {
          id,
        },
      })
      .catch((e) => null);

    if (!updated) return { error: "Name already exists, cannot update!!" };

    throw redirect(302, "/classes");
  },

  removeSubject: async ({ request }) => {
    const form = await request.formData();
    const subjectId = form.get("subject_id");
    const classId = form.get("classId");

    await prisma.subject.update({
      where: {
        id: subjectId,
      },
      data: {
        classes: {
          disconnect: {
            id: classId,
          },
        },
      },
    });
  },
};
