import "dotenv/config";
import { z } from "zod";

const schema = z.object({
	PORT: z
		.string({ error: "PORT must be a number" })
		.transform(Number)
		.default(5000),
	DATABASE_URL: z
		.string({ error: "DATABASE_URL must be a string" })
		.default("./innkeeper.db"),
	JWT_SECRET: z
		.string({ error: "JWT_SECRET must be a string" })
		.default("0198e1fb-f409-7351-a6e2-97cc63e20ae7"),
});

function validate_config() {
	const { success, data, error } = schema.safeParse(process.env);
	if (!success) {
		throw new Error(
			`Invalid environment variables: ${error.issues.at(0)?.message}`,
		);
	}

	return data;
}

export const config = validate_config();
