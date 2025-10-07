import * as z from "zod";
import { cities } from "$lib/constants";

export const school_schema = z.object({
	school_id: z.string({ error: "school id is required" }),
	name: z
		.string({ error: "school name must be a string" })
		.trim()
		.min(2, { error: "school name must be at least 2 characters long" }),
	license: z
		.string({ error: "license number must be a string" })
		.trim()
		.min(2, { error: "license number must be at least 2 characters long" }),
	address: z
		.string({ error: "address must be a string" })
		.trim()
		.min(2, { error: "address must be at least 2 characters long" }),
	contact: z
		.string()
		.trim()
		.min(2, { error: "contact must be at least 2 characters long" }),
	city: z.enum(cities, { error: "City is invalid or not in the list" }),
	email: z.email(),
	website: z.url().optional(),
	founded_on: z.iso.date({ error: "Founded on must be a valid date" }),
});

// logo_url: text(),
