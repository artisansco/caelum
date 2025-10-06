import { z } from "zod";
import { cities } from "$lib/constants";

export const school_schema = z.object({
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
	password: z
		.string()
		.min(8, { error: "Password must be at least 8 characters long" }),
});
