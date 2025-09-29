import type { cities, staff_statuses, student_statuses } from "./constants";

export type CurrentUser = {
	id: string;
	email?: string;
	name?: string;
	school_id: string;
};

export type Staff = {
	id: string;
	first_name: string;
	middle_name?: string;
	last_name: string;
	email: string;
	contact: string;
	address: string;
	staff_id: string;
	role: "staff" | "admin";
	department: string;
	status: (typeof staff_statuses)[number];
	permissions: string[];
	employed_date: string | Date;
	avatar_url?: string;
	notes?: string;
	password?: number;
	school_id: string;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type Student = {
	id?: string;
	first_name: string;
	middle_name?: string;
	last_name: string;
	admission_number: string;
	address: string;
	email?: string;
	phone_number?: string;
	avatar_url?: string;
	school_id: string;
	class?: string;
	status: (typeof student_statuses)[number];
	admission_date: string | Date;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type Assignment = {
	id?: string;
	title: string;
	description?: string;
	class_id: string;
	class_name?:string
	school_id: string;
	file_name: string;
	due_date: Date | string;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type Class = {
	id?: string;
	name: string;
	code?: string;
	school_id: string;
	created_at: string | Date;
	updated_at: string | Date;
};

export type School = {
	id?: string;
	name: string;
	address: string;
	license: string;
	city: (typeof cities)[number];
	logo_url?: string;
	phone?: string;
	email?: string;
	website?: string;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type SchoolYear = {
	id?: string;
	name: string;
	start_date: string | Date;
	end_date: string | Date;
	is_active: boolean;
	school_id: string;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type Department = {
	id?: string;
	name: string;
	code?: string;
	type: "academic" | "administrative";
	head_of_department?: string;
	description?: string;
	school_id: string;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type Announcement = {
	id?: string;
	title: string;
	content: string;
	priority: "low" | "medium" | "high";
	type: "general" | "urgent" | "event" | "academic" | "administrative";
	target_audience?: string;
	expires_at?: string | Date;
	is_active: boolean;
	school_id: string;
	created_at?: string | Date;
	updated_at?: string | Date;
};
