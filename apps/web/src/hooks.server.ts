import prisma from "./lib/utils/prisma";

export const handle = async ({ resolve, event }) => {
	const session = event.cookies.get("session");

	if (!session) return await resolve(event);

	const admin = await prisma.admin.findUnique({
		where: {
			id: session,
		},
		select: {
			id: true,
			username: true,
			email: true,
			// dateJoined:true
		},
	});

	if (admin) event.locals.admin = admin;

	return await resolve(event);
};
