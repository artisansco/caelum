import { validator } from "hono/validator";
import { z } from "zod";

const token_schema = z.object({
	email: z.email(),
	password: z
		.string({ error: "Password must be at least 6 characters long" })
		.min(6),
});

export const token_validator = validator("json", (value, c) => {
	const { success, data, error } = token_schema.safeParse(value);
	if (!success) {
		const message = error.issues.at(0)?.message;
		return c.json({ status: "fail", message }, 401);
	}

	return data;
});
