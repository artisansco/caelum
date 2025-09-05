import { defineConfig } from "drizzle-kit";
import { config } from "./src/lib/config";

export default defineConfig({
	schema: "./src/db/schema.ts",
	verbose: true,
	strict: true,
	dialect: "sqlite",
	breakpoints: true,
	casing: "snake_case",
	out: "./drizzle",
	dbCredentials: {
		url: config.DATABASE_URL,
	},
});
