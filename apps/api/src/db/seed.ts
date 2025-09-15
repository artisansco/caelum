import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { reset, seed } from "drizzle-seed";
import { nanoid } from "nanoid";
import { config } from "../lib/config";
import * as schema from "./schema";

const db = drizzle(config.DATABASE_URL);

async function seed_data() {
	await reset(db, schema);

	await seed(
		db,
		// schema,
		{
			staff: schema.staff_table,
			schools: schema.schools_table,
			students: schema.students_table,
		},
	).refine(async (funcs) => ({
		schools: {
			columns: {
				name: funcs.companyName(),
				address: funcs.streetAddress(),
				license: funcs.string({ isUnique: true }),
				city: funcs.default({ defaultValue: "Freetown" }),
				logo_url: funcs.default({ defaultValue: undefined }),
				created_at: funcs.date(),
				updated_at: funcs.date(),
			},
			count: 5,
		},

		staff: {
			columns: {
				staff_id: nanoid(),
				first_name: funcs.firstName(),
				middle_name: funcs.default({ defaultvalue: undefined }),
				last_name: funcs.lastName(),
				email: funcs.email(),
				password: await bcrypt.hash("password", 12),
				avatar_url: funcs.default({ defaultValue: undefined }),
				contact: funcs.phoneNumber(),
				address: funcs.streetAddress(),
				status: funcs.default({ defaultValue: "active" }),
				employment_type: funcs.valuesFromArray({
					values: [
						{ values: ["full-time"], weight: 0.8 },
						{ values: ["part-time"], weight: 0.1 },
						{ values: ["contract"], weight: 0.05 },
						{ values: ["intern"], weight: 0.02 },
						{ values: ["volunteer"], weight: 0.01 },
					],
				}),
				notes: funcs.loremIpsum(),
				role: funcs.default({ defaultValue: "staff" }),
				permissions: funcs.default({
					defaultValue: "students:view,subjects:view,class:view",
				}),
				employed_date: funcs.timestamp(),
				created_at: funcs.timestamp(),
				updated_at: funcs.timestamp(),
			},
		},

		students: {
			columns: {
				admission_number: funcs.default({ defaultValue: nanoid() }),
				first_name: funcs.firstName(),
				middle_name: funcs.default({ defaultvalue: undefined }),
				last_name: funcs.lastName(),
				email: funcs.email(),
				password: await bcrypt.hash("password", 12),
				avatar_url: funcs.default({ defaultValue: "" }),
				contact: funcs.phoneNumber(),
				address: funcs.streetAddress(),
				status: funcs.default({ defaultValue: "active" }),
				admission_date: funcs.timestamp(),
				created_at: funcs.timestamp(),
				updated_at: funcs.timestamp(),
			},
		},

		// end
	}));

	await seed_admin();
	db.$client.close();
}

async function seed_admin() {
	await db.insert(schema.staff_table).values({
		first_name: "Admin",
		last_name: "User",
		email: "admin@acme.com",
		password: await bcrypt.hash("password", 12),
		role: "admin",
		permissions: "students:view,staff:view,subjects:view,class:view",
		employed_date: new Date().toISOString(),
		address: "",
		contact: "",
		staff_id: nanoid(),
		school_id: (await db.select().from(schema.schools_table).limit(1)).at(0)
			?.id,
	});
}

seed_data();
