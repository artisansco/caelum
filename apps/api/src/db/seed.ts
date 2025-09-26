import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { reset, seed } from "drizzle-seed";
import { nanoid } from "nanoid";
import { config } from "../lib/config";
import { default_permissions } from "../lib/constants";
import * as schema from "./schema";

const db = drizzle(config.DATABASE_URL);

async function seed_data() {
	await reset(db, schema);

	await seed(db, {
		staff_table: schema.staff_table,
		schools_table: schema.schools_table,
		students_table: schema.students_table,
		classes_table: schema.classes_table,
		subjects_table: schema.subjects_table,
	}).refine((f) => ({
		schools_table: {
			columns: {
				id: f.uuid(),
				name: f.companyName({ isUnique: true }),
				address: f.streetAddress(),
				license: f.string({ isUnique: true }),
				city: f.default({ defaultValue: "Freetown" }),
				logo_url: f.default({
					defaultValue: `https://robohash.org/${nanoid()}`,
				}),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
			count: 5,
		},

		staff_table: {
			columns: {
				id: f.uuid(),
				staff_id: f.string({ isUnique: true }),
				first_name: f.firstName(),
				middle_name: f.default({ defaultValue: undefined }),
				last_name: f.lastName(),
				email: f.email(),
				password: f.default({ defaultValue: bcrypt.hashSync("password", 12) }),
				avatar_url: f.default({
					defaultValue: `https://robohash.org/${nanoid()}`,
				}),
				contact: f.phoneNumber({ template: "+232########" }),
				address: f.streetAddress(),
				status: f.default({ defaultValue: "active" }),
				employment_type: f.valuesFromArray({
					values: [
						{ values: ["full-time"], weight: 0.8 },
						{ values: ["part-time"], weight: 0.1 },
						{ values: ["contract"], weight: 0.05 },
						{ values: ["intern", "volunteer"], weight: 0.05 },
					],
				}),
				notes: f.loremIpsum(),
				role: f.valuesFromArray({
					values: [
						{ values: ["staff"], weight: 0.7 },
						{ values: ["admin"], weight: 0.3 },
					],
				}),
				permissions: f.default({
					defaultValue: default_permissions.join(","),
				}),
				employed_date: f.date({ maxDate: new Date() }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
			count: 20,
		},

		students_table: {
			columns: {
				id: f.uuid(),
				admission_number: f.string({ isUnique: true }),
				first_name: f.firstName(),
				middle_name: f.default({ defaultValue: undefined }),
				last_name: f.lastName(),
				email: f.email(),
				password: f.default({ defaultValue: bcrypt.hashSync("password", 12) }),
				avatar_url: f.default({
					defaultValue: `https://robohash.org/${nanoid()}`,
				}),
				contact: f.phoneNumber({ template: "+232########" }),
				address: f.streetAddress(),
				status: f.default({ defaultValue: "enrolled" }),
				admission_date: f.date({ maxDate: new Date() }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
			count: 40,
		},

		classes_table: {
			columns: {
				id: f.uuid(),
				name: f.valuesFromArray({
					values: [
						"Class 1",
						"Class 2",
						"Class 3",
						"Class 4",
						"Class 5",
						"Class 6",
						"JSS 1",
						"JSS 2",
						"JSS 3",
						"SSS 1",
						"SSS 2",
						"SSS 3",
					],
				}),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
		},

		subjects_table: {
			columns: {
				id: f.uuid(),
				name: f.valuesFromArray({
					values: [
						"Math",
						"English",
						"Science",
						"Social Studies",
						"History",
						"Geography",
						"Physics",
						"Chemistry",
						"Biology",
						"Economics",
						"Agriculture",
						"Business Studies",
					],
				}),
				code: f.string({ isUnique: true }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
		},

		// end
	}));

	db.$client.close();
}

seed_data();
