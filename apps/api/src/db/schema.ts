import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { cities } from "../lib/constants";

const _permissions = [
	"students:view",
	"students:create",
	"students:edit",
	"students:delete",
];

export const students_table = sqliteTable("students", {
	id: text().primaryKey().$defaultFn(nanoid),
	admission_number: text().notNull().unique(),
	first_name: text().notNull(),
	middle_name: text(),
	last_name: text().notNull(),
	email: text(),
	avatar_url: text(),
	school_id: text().references(() => schools_table.id, {
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
	school_id: text()
		.notNull()
		.references(() => schools_table.id, {
			onDelete: "cascade",
		}),
	role: text({ enum: ["admin", "staff"] })
		.notNull()
		.default("staff"),
	permissions: text().default("students:view"),
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
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text()
		.notNull()
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
