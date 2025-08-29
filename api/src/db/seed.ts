import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { db } from "./drizzle";
import * as schema from "./schema";

async function seed_admin() {
	await db.delete(schema.staff_table);

	await db.insert(schema.staff_table).values({
		staff_id: nanoid(),
		first_name: "John",
		last_name: "Doe",
		email: "admin@acme.com",
		role: "admin",
		school_id: "",
		password: await bcrypt.hash("password", 12),
	});

	db.$client.close();
}

seed_admin();
