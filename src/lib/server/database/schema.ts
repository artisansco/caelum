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
	payment_methods,
	payment_types,
	referral_statuses,
	school_terms,
	staff_roles,
	staff_statuses,
	student_statuses,
	subscription_statuses,
	subscription_tiers,
	transaction_types,
} from "../../constants";

export const students_table = sqliteTable("students", {
	id: text().primaryKey().$defaultFn(nanoid),
	admission_number: text().notNull().unique(),
	first_name: text().notNull(),
	middle_name: text(),
	last_name: text().notNull(),
	email: text(),
	password: text(), // For student portal authentication
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
	// Freemium subscription fields
	subscription_tier: text({ enum: subscription_tiers })
		.notNull()
		.default("free"),
	subscription_status: text({ enum: subscription_statuses })
		.notNull()
		.default("active"),
	subscription_expires_at: text(),
	storage_used: int().notNull().default(0), // in bytes
	sms_quota_used: int().notNull().default(0),
	sms_quota_limit: int().notNull().default(0),
	referral_code: text().unique(),
	referred_by: text(), // references another school's referral_code
	referral_credits: int().notNull().default(0), // months earned
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

// subscription payment history table (for tracking all payments)
export const subscriptions_table = sqliteTable("subscriptions", {
	id: text().primaryKey().$defaultFn(nanoid),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	tier: text({ enum: subscription_tiers }).notNull(),
	amount: int().notNull(), // amount in USD cents (e.g., 1000 = $10)
	duration_months: int().notNull(), // 1, 3, 6, or 12
	payment_method: text({ enum: payment_methods })
		.notNull()
		.default("mobile_money"),
	transaction_id: text(), // external payment provider transaction ID
	status: text({ enum: ["pending", "completed", "failed", "refunded"] })
		.notNull()
		.default("pending"),
	referral_code_used: text(), // if user applied a referral code
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// plans table for subscriptions (keeping for backward compatibility)
export const plans_table = sqliteTable("plans", {
	id: text().primaryKey().$defaultFn(nanoid),
	name: text().notNull().unique(),
	description: text(),
	duration_days: int().notNull().default(30), // plan length in days
	price: int().notNull().default(0),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// transactions table for school payments to the platform
export const transactions_table = sqliteTable("transactions", {
	id: text().primaryKey().$defaultFn(nanoid),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	subscription_id: text()
		.notNull()
		.references(() => subscriptions_table.id, { onDelete: "cascade" }),
	amount: int().notNull(),
	transaction_type: text({ enum: transaction_types })
		.notNull()
		.default("subscription"),
	payment_method: text({ enum: payment_methods })
		.notNull()
		.default("mobile_money"),
	description: text(),
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
	max_score: int().notNull().default(100),
	actual_score: int().notNull(),
	graded_by: text()
		.notNull()
		.references(() => staff_table.id, { onDelete: "cascade" }),
	term: text({ enum: school_terms }).notNull().default("first"),
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
	received_by: text()
		.notNull()
		.references(() => staff_table.id, { onDelete: "cascade" }),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	amount: int().notNull(),
	payment_type: text({ enum: payment_types }).notNull().default("tuition"),
	payment_method: text({ enum: payment_methods }).notNull().default("cash"),
	// term: text({ enum: school_terms }).notNull().default("first"),
	term: text(),
	academic_year: text(),
	payment_date: text().default(sql`CURRENT_TIMESTAMP`),
	notes: text(),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// guardians/parents table for student emergency contacts
export const guardians_table = sqliteTable("guardians", {
	id: text().primaryKey().$defaultFn(nanoid),
	first_name: text().notNull(),
	last_name: text().notNull(),
	email: text(),
	phone_number: text().notNull(),
	relationship: text({ enum: ["parent", "guardian", "other"] })
		.notNull()
		.default("parent"),
	is_primary_contact: int({ mode: "boolean" }).notNull().default(false),
	is_emergency_contact: int({ mode: "boolean" }).notNull().default(true),
	address: text(),
	occupation: text(),
	student_id: text()
		.notNull()
		.references(() => students_table.id, { onDelete: "cascade" }),
	school_id: text().references(() => schools_table.id, {
		onDelete: "cascade",
	}),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// attendance tracking table
export const attendance_table = sqliteTable("attendance", {
	id: text().primaryKey().$defaultFn(nanoid),
	student_id: text()
		.notNull()
		.references(() => students_table.id, { onDelete: "cascade" }),
	date: text().notNull(),
	status: text({ enum: ["present", "absent", "late", "excused"] })
		.notNull()
		.default("present"),
	notes: text(),
	marked_by: text().references(() => staff_table.id),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// class timetable/schedule table
export const timetable_table = sqliteTable("timetable", {
	id: text().primaryKey().$defaultFn(nanoid),
	class_id: text()
		.notNull()
		.references(() => classes_table.id, { onDelete: "cascade" }),
	subject_id: text()
		.notNull()
		.references(() => subjects_table.id, { onDelete: "cascade" }),
	staff_id: text().references(() => staff_table.id, { onDelete: "set null" }),
	day_of_week: text({
		enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
	}).notNull(),
	start_time: text().notNull(),
	end_time: text().notNull(),
	room: text(),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// assignment submissions table
export const assignment_submissions_table = sqliteTable(
	"assignment_submissions",
	{
		id: text().primaryKey().$defaultFn(nanoid),
		assignment_id: text()
			.notNull()
			.references(() => assignments_table.id, { onDelete: "cascade" }),
		student_id: text()
			.notNull()
			.references(() => students_table.id, { onDelete: "cascade" }),
		file_url: text(),
		file_name: text(),
		submission_date: text().notNull().default(sql`CURRENT_TIMESTAMP`),
		status: text({ enum: ["submitted", "late", "graded", "returned"] })
			.notNull()
			.default("submitted"),
		grade_id: text().references(() => grades_table.id, {
			onDelete: "set null",
		}),
		feedback: text(),
		school_id: text().references(() => schools_table.id, {
			onDelete: "cascade",
		}),
		created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
		updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
	},
);

// audit logs table for tracking sensitive operations
export const audit_logs_table = sqliteTable("audit_logs", {
	id: text().primaryKey().$defaultFn(nanoid),
	user_id: text().notNull().references(() => staff_table.id),
	action: text({ enum: ["create", "update", "delete", "login", "logout"] })
		.notNull()
		.default("create"),
	entity_type: text({
		enum: [
			"student",
			"staff",
			"grade",
			"payment",
			"class",
			"subject",
			"announcement",
		],
	}).notNull(),
	entity_id: text().notNull(),
	changes: text(), // JSON string of before/after values
	ip_address: text(),
	user_agent: text(),
	school_id: text().references(() => schools_table.id, {
		onDelete: "cascade",
	}),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
});

// notifications table for real-time notifications
export const notifications_table = sqliteTable("notifications", {
	id: text().primaryKey().$defaultFn(nanoid),
	user_id: text().notNull().references(() => staff_table.id),
	type: text({
		enum: [
			"announcement",
			"grade_posted",
			"payment_reminder",
			"assignment_due",
			"absence_alert",
		],
	})
		.notNull()
		.default("announcement"),
	title: text().notNull(),
	message: text().notNull(),
	link: text(),
	read: int({ mode: "boolean" }).notNull().default(false),
	school_id: text().references(() => schools_table.id, {
		onDelete: "cascade",
	}),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
});

// referrals table for tracking school referrals
export const referrals_table = sqliteTable("referrals", {
	id: text().primaryKey().$defaultFn(nanoid),
	referrer_school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	referred_school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	referral_code: text().notNull(),
	status: text({ enum: referral_statuses }).notNull().default("pending"),
	converted_at: text(), // when referred school made first payment
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// feature usage tracking table
export const feature_usage_table = sqliteTable("feature_usage", {
	id: text().primaryKey().$defaultFn(nanoid),
	school_id: text()
		.notNull()
		.references(() => schools_table.id, { onDelete: "cascade" }),
	feature_name: text().notNull(), // e.g., "pdf_generation", "sms_sent", "file_upload"
	usage_count: int().notNull().default(0),
	last_used_at: text(),
	created_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// cron job tracking table
export const cron_runs_table = sqliteTable("cron_runs", {
	id: text().primaryKey().$defaultFn(nanoid),
	job_name: text().notNull(), // e.g., "check_expired_subscriptions", "send_renewal_reminders"
	status: text({ enum: ["started", "completed", "failed"] })
		.notNull()
		.default("started"),
	details: text(), // JSON string with results/errors
	started_at: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	completed_at: text(),
});
