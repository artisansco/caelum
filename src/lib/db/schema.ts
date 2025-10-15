import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import {
	announcement_audience,
	announcement_priority,
	announcement_types,
	cities,
	default_permissions,
	employment_types,
	grade_types,
	payment_method,
	payment_type,
	staff_roles,
	staff_statuses,
	student_statuses,
} from "../constants";

const terms = ["first", "second", "third"] as const;

export const students_table = sqliteTable("students", {
	id: text().primaryKey().$defaultFn(nanoid),
	admission_number: text().notNull().unique(),
	first_name: text().notNull(),
	middle_name: text(),
	last_name: text().notNull(),
	email: text(),
	gender: text({ enum: ["male", "female"] }).notNull(),
	phone_number: text(),
	address: text(),
	date_of_birth: text(),
	avatar_url: text(),
	status: text({ enum: student_statuses }).notNull().default("enrolled"),
	school_id: text().references(() => schools_table.id, {
		onDelete: "cascade",
	}),
	class_id: text().references(() => classes_table.id, {
		onDelete: "cascade",
	}),
	admission_date: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const staff_table = sqliteTable("staff", {
	id: text().primaryKey().$defaultFn(nanoid),
	staff_id: text().notNull().unique(),
	first_name: text().notNull(),
	middle_name: text(),
	last_name: text().notNull(),
	email: text(),
	password: text().notNull(),
	avatar_url: text(),
	contact: text().notNull(),
	address: text().notNull(),
	status: text({ enum: staff_statuses }).default("active"),
	employment_type: text({ enum: employment_types })
		.notNull()
		.default("full-time"),
	notes: text(),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	role: text({ enum: staff_roles }).notNull().default("staff"),
	permissions: text().default(default_permissions.join(",")),
	employed_date: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const schools_table = sqliteTable("schools", {
	id: text().primaryKey().$defaultFn(nanoid),
	name: text().notNull(),
	address: text(),
	license: text().unique(),
	city: text({ enum: cities }).default("Freetown"),
	logo_url: text(),
	contact: text().unique(),
	email: text().unique(),
	website: text().unique(),
	founded_on: text(),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const subjects_table = sqliteTable("subjects", {
	id: text().primaryKey().$defaultFn(nanoid),
	name: text().notNull(),
	code: text(),
	school_id: text().references(() => schools_table.id, { onDelete: "cascade" }),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const assignments_table = sqliteTable("assignments", {
	id: text().primaryKey().$defaultFn(nanoid),
	title: text().notNull(),
	description: text(),
	due_date: text().notNull(),
	file_name: text().notNull(),
	class_id: text().references(() => classes_table.id, {
		onDelete: "cascade",
	}),
	school_id: text().references(() => schools_table.id, {
		onDelete: "cascade",
	}),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const classes_table = sqliteTable("classes", {
	id: text().primaryKey().$defaultFn(nanoid),
	name: text().notNull(),
	school_id: text().references(() => schools_table.id, {
		onDelete: "cascade",
	}),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const announcements_table = sqliteTable("announcements", {
	id: text().primaryKey().$defaultFn(nanoid),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	title: text().notNull(),
	content: text().notNull(),
	priority: text({ enum: announcement_priority }).notNull().default("medium"),
	type: text({ enum: announcement_types }).notNull().default("general"),
	target_audience: text({ enum: announcement_audience })
		.notNull()
		.default("all"),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// subscription table for schools
export const subscriptions_table = sqliteTable("subscriptions", {
	id: text().primaryKey().$defaultFn(nanoid),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	plan_id: text()
		.notNull()
		.references(() => plans_table.id, { onDelete: "cascade" }),
	start_date: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	end_date: text(),
	status: text({ enum: ["active", "inactive"] })
		.notNull()
		.default("active"),
	// payment_id: text().references(() => payments_table.id),
	// price_paid: int().notNull(),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// plans table for subscriptions
export const plans_table = sqliteTable("plans", {
	id: text().primaryKey().$defaultFn(nanoid),
	name: text().notNull().unique(),
	description: text(),
	duration_days: int().notNull().default(30), // plan length in days
	price: int().notNull().default(0),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// grades table for student academic performance
export const grades_table = sqliteTable("grades", {
	id: text().primaryKey().$defaultFn(nanoid),
	student_id: text()
		.notNull()
		.references(() => students_table.id, { onDelete: "cascade" }),
	subject_id: text()
		.notNull()
		.references(() => subjects_table.id, { onDelete: "cascade" }),
	grade_type: text({ enum: grade_types }).notNull().default("assignment"),
	max_score: int().default(100),
	actual_score: int().notNull(),
	graded_by: text()
		.notNull()
		.references(() => staff_table.id, { onDelete: "cascade" }),
	term: text({ enum: terms }).notNull().default("first"),
	academic_year: text().notNull(),
	notes: text(),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// payments table for student fee payments
export const payments_table = sqliteTable("payments", {
	id: text().primaryKey().$defaultFn(nanoid),
	student_id: text()
		.notNull()
		.references(() => students_table.id, { onDelete: "cascade" }),
	amount: int().notNull(),
	payment_type: text({ enum: payment_type }).notNull().default("tuition"),
	payment_method: text({ enum: payment_method }).notNull().default("cash"),
	term: text({ enum: terms }).notNull().default("first"),
	academic_year: text().notNull(),
	due_date: text(),
	paid_date: text().default(sql`CURRENT_TIMESTAMP`),
	notes: text(),
	received_by: text()
		.notNull()
		.references(() => staff_table.id, { onDelete: "cascade" }),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// transactions table for school payments to the platform
export const transactions_table = sqliteTable("transactions", {
	id: text().primaryKey().$defaultFn(nanoid),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	subscription_id: text().references(() => subscriptions_table.id, {
		onDelete: "cascade",
	}),
	amount: int().notNull(),
	transaction_type: text({
		enum: ["subscription", "upgrade", "addon", "penalty"],
	})
		.notNull()
		.default("subscription"),
	payment_method: text({ enum: payment_method })
		.notNull()
		.default("bank_transfer"),
	description: text(),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
