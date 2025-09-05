import { createMiddleware } from "hono/factory";
import * as jwt from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import { config } from "../lib/config";

export const check_jwt = createMiddleware<{
	Variables: { user_id: string; school_id: string };
}>(async (c, next) => {
	const token = c.req.header("Authorization")?.split(" ")[1];
	if (!token) {
		return c.json({ status: "fail", message: "invalid or missing token" }, 401);
	}

	try {
		const decoded = (await jwt.verify(
			token,
			config.JWT_SECRET,
		)) as JWTPayload & { id: string; school_id: string };

		c.set("user_id", decoded.id);
		c.set("school_id", decoded.school_id);

		await next();
	} catch (_e) {
		console.log(_e);
		if (_e instanceof Error) {
			return c.json({ status: "fail", message: _e.message }, 401);
		}
	}
});
