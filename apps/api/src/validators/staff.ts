import { validator } from "hono/validator";
import { z } from "zod";

const staff_schema = z.object({
	first_name: z
		.string({ error: "first name must be a string" })
		.trim()
		.min(2, { error: "first name must be at least 2 characters long" }),
	middle_name: z
		.string({ error: "middle name must be a string" })
		.trim()
		.min(2, { error: "middle name must be at least 2 characters long" })
		.optional(),
	last_name: z
		.string({ error: "last name must be a string" })
		.trim()
		.min(2, { error: "last name must be at least 2 characters long" }),
	staff_id: z
		.string({ error: "staff id must be a string" })
		.trim()
		.min(5, { error: "staff id must be at least 5 characters long" }),
	email: z.email({ error: "email must be a string" }).optional(),
	employed_on: z.iso.date({ error: "employed on must be a valid date" }),
	address: z
		.string({ error: "address must be a string" })
		.trim()
		.min(2, { error: "address must be at least 2 characters long" }),
	phone_number: z
		.string({ error: "phone number must be a string" })
		.trim()
		.min(6, { error: "phone number must be at least 6 characters long" }),
	password: z
		.string()
		.min(6, { error: "Password must be at least 6 characters long" }),
	role: z.enum(["admin", "staff"], {
		error: "role is invalid or not in the list",
	}),
	permissions: z
		.array(z.string(), {
			error: "permissions must be an array of strings",
		})
		.transform((val) => val.join(",")),
	school_id: z
		.string({ error: "school id must be a string" })
		.trim()
		.min(5, { error: "school id must be at least 5 characters long" }),
});

export const validate_new_staff = validator("json", (value, c) => {
	const { success, data, error } = staff_schema.safeParse(value);
	if (!success) {
		const message = error.issues.at(0)?.message as string;
		return c.json({ status: "fail", message: message }, 400);
	}

	return data;
});

export const validate_update_staff = validator("json", (value, c) => {
	const { success, data, error } = staff_schema
		.partial({ password: true })
		.omit({ employed_on: true })
		.safeParse(value);
	if (!success) {
		const message = error.issues.at(0)?.message as string;
		return c.json({ status: "fail", message: message }, 400);
	}

	return data;
});
