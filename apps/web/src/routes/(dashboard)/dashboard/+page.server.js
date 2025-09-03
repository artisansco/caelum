import prisma from "$lib/utils/prisma";

/** @type {import('./$types').PageServerLoad} */
export async function load({}) {
	return {
		totalClasses: await prisma.class.count(),
		totalSubjects: await prisma.subject.count(),
		totalStudents: await prisma.student.count(),
	};
}
