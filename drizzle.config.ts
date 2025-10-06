import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	verbose: true,
	strict: true,
	dialect: "sqlite",
	breakpoints: true,
	casing: "snake_case",
	out: "./drizzle",
	dbCredentials: {
		url: String(process.env.DATABASE_URL),
	},
});
