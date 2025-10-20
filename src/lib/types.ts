import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
	announcements_table,
	assignments_table,
	classes_table,
	grades_table,
	payments_table,
	plans_table,
	schools_table,
	staff_table,
	students_table,
	subjects_table,
	subscriptions_table,
	transactions_table,
} from "./server/database/schema";

export type Student = InferSelectModel<typeof students_table> & {
	class?: Class;
};
export type NewStudent = InferInsertModel<typeof students_table>;

export type Staff = InferSelectModel<typeof staff_table>;
export type NewStaff = InferInsertModel<typeof staff_table>;

export type School = InferSelectModel<typeof schools_table>;
export type NewSchool = InferInsertModel<typeof schools_table>;

export type Subject = InferSelectModel<typeof subjects_table>;
export type NewSubject = InferInsertModel<typeof subjects_table>;

export type Assignment = InferSelectModel<typeof assignments_table>;
export type NewAssignment = InferInsertModel<typeof assignments_table>;

export type Class = InferSelectModel<typeof classes_table>;
export type NewClass = InferInsertModel<typeof classes_table>;

export type Announcement = InferSelectModel<typeof announcements_table>;
export type NewAnnouncement = InferInsertModel<typeof announcements_table>;

export type Subscription = InferSelectModel<typeof subscriptions_table>;
export type NewSubscription = InferInsertModel<typeof subscriptions_table>;

export type Plan = InferSelectModel<typeof plans_table>;
export type NewPlan = InferInsertModel<typeof plans_table>;

export type Transaction = InferSelectModel<typeof transactions_table>;
export type NewTransaction = InferInsertModel<typeof transactions_table>;

export type Grade = InferSelectModel<typeof grades_table>;
export type NewGrade = InferInsertModel<typeof grades_table>;

export type Payment = InferSelectModel<typeof payments_table>;
export type NewPayment = InferInsertModel<typeof payments_table>;

export type CurrentUser = {
	id: string;
	email?: string;
	name?: string;
	school_id: string;
};
