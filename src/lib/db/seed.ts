import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { reset, seed } from "drizzle-seed";
import { nanoid } from "nanoid";
import { config } from "../config";
import {
	announcement_audience,
	announcement_priority,
	announcement_types,
	default_permissions,
	grade_types,
	payment_methods,
	payment_types,
	school_terms,
	transaction_types,
} from "../constants";
import * as schema from "./schema";

const db = drizzle(config.DATABASE_URL);
const dummy_subjects = [
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
];

async function seed_data() {
	await reset(db, schema);

	await seed(db, {
		staff_table: schema.staff_table,
		schools_table: schema.schools_table,
		students_table: schema.students_table,
		classes_table: schema.classes_table,
		subjects_table: schema.subjects_table,
		subscriptions_table: schema.subscriptions_table,
		plans_table: schema.plans_table,
		announcements_table: schema.announcements_table,
		grades_table: schema.grades_table,
		payments_table: schema.payments_table,
		transactions_table: schema.transactions_table,
	}).refine((f) => ({
		plans_table: {
			columns: {
				id: f.uuid(),
				name: f.valuesFromArray({ values: ["free", "basic", "pro"] }),
				description: f.loremIpsum(),
				duration_days: f.default({ defaultValue: 30 }),
				price: f.number({ minValue: 0, maxValue: 499 }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
			count: 3,
		},

		subscriptions_table: {
			columns: {
				id: f.uuid(),
				start_date: f.timestamp(),
				end_date: f.default({
					defaultValue: (() => {
						const startDate = new Date();
						startDate.setMonth(startDate.getMonth() + 1);
						return startDate.toISOString();
					})(),
				}),
				status: f.valuesFromArray({ values: ["active", "inactive"] }),
				// price_paid: f.number({ minValue: 0 }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
			// count: 3,
		},

		schools_table: {
			columns: {
				id: f.uuid(),
				name: f.companyName({ isUnique: true }),
				address: f.streetAddress(),
				license: f.string({ isUnique: true }),
				city: f.default({ defaultValue: "Freetown" }),
				logo_url: f.default({
					defaultValue: `https://placehold.co/150?text=${nanoid().at(0)}`,
				}),
				contact: f.phoneNumber({ template: "+232########" }),
				email: f.email(),
				website: f.default({ defaultValue: undefined }),
				founded_on: f.date({ maxDate: new Date() }),
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
						{ values: ["full-time"], weight: 0.7 },
						{ values: ["part-time"], weight: 0.2 },
						{ values: ["intern", "volunteer", "contract"], weight: 0.1 },
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
			count: 50,
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

		students_table: {
			columns: {
				id: f.uuid(),
				admission_number: f.string({ isUnique: true }),
				first_name: f.firstName(),
				middle_name: f.default({ defaultValue: undefined }),
				last_name: f.lastName(),
				email: f.email(),
				gender: f.valuesFromArray({ values: ["male", "female"] }),
				phone_number: f.phoneNumber({ template: "+232########" }),
				date_of_birth: f.date({
					maxDate: (() => {
						const date = new Date();
						date.setFullYear(date.getFullYear() - 3);
						return date;
					})(),
				}),
				avatar_url: f.default({
					defaultValue: `https://robohash.org/${nanoid()}`,
				}),
				address: f.streetAddress(),
				status: f.default({ defaultValue: "enrolled" }),
				admission_date: f.date({ maxDate: new Date() }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
			count: 300,
		},

		subjects_table: {
			columns: {
				id: f.uuid(),
				name: f.valuesFromArray({ values: dummy_subjects }),
				code: f.string({ isUnique: true }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
		},

		announcements_table: {
			columns: {
				id: f.uuid(),
				title: f.loremIpsum(),
				content: f.loremIpsum({ sentencesCount: 3 }),
				priority: f.valuesFromArray({ values: [...announcement_priority] }),
				type: f.valuesFromArray({ values: [...announcement_types] }),
				target_audience: f.valuesFromArray({
					values: [...announcement_audience],
				}),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
		},

		grades_table: {
			columns: {
				id: f.uuid(),
				name: f.valuesFromArray({ values: dummy_subjects }),
				grade_type: f.valuesFromArray({ values: [...grade_types] }),
				max_score: f.number({ minValue: 100, maxValue: 100 }),
				actual_score: f.number({ minValue: 0, maxValue: 100 }),
				term: f.valuesFromArray({ values: [...school_terms] }),
				academic_year: f.year(),
				notes: f.loremIpsum({ sentencesCount: 2 }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
			count: 100,
		},

		payments_table: {
			columns: {
				id: f.uuid(),
				amount: f.number({ minValue: 1 }),
				payment_type: f.valuesFromArray({ values: [...payment_types] }),
				payment_method: f.valuesFromArray({ values: [...payment_methods] }),
				term: f.default({ defaultValue: undefined }),
				academic_year: f.default({ defaultValue: undefined }),
				payment_date: f.date({ maxDate: new Date() }),
				notes: f.loremIpsum({ sentencesCount: 2 }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
			count: 100,
		},

		transactions_table: {
			columns: {
				id: f.uuid(),
				amount: f.number({ minValue: 1 }),
				transaction_type: f.valuesFromArray({ values: [...transaction_types] }),
				payment_method: f.valuesFromArray({ values: [...payment_methods] }),
				// payment_date: f.date({ maxDate: new Date() }),
				description: f.loremIpsum({ sentencesCount: 2 }),
				created_at: f.timestamp(),
				updated_at: f.default({ defaultValue: undefined }),
			},
			count: 20,
		},

		// end
	}));

	db.$client.close();
}

seed_data();
