import { createMiddleware } from "hono/factory";
import * as jwt from "hono/jwt";
import { config } from "../lib/config";

export const check_jwt = createMiddleware(async (c, next) => {
	const token = c.req.header("Authorization")?.split(" ")[1];
	if (!token) {
		return c.json({ status: "fail", message: "invalid or missing token" }, 401);
	}

	try {
		const decoded = await jwt.verify(token, config.JWT_SECRET);
		c.set("jwtPayload", decoded);
	} catch (_e) {
		console.log(_e);
		if (_e instanceof Error) {
			return c.json({ status: "fail", message: _e.message }, 401);
		}
	}

	await next();
});

export const allow_roles = (...roles: ["admin", "staff"]) => {
	return createMiddleware(async (c, next) => {
		const user = c.get("jwtPayload");

		if (!roles.includes(user?.role)) {
			return c.json(
				{ message: "Invalid role to perform action, access denied!!" },
				403,
			);
		}

		await next();
	});
};
