import type { staff_statuses } from "./constants";

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
	email?: string;
	contact?: string;
	avatar_url?: string;
	school_id: string;
	class?: string;
	status: "enrolled" | "graduated" | "alumni";
	admission_date: string | Date;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type Assignment = {
	id?: string;
	title: string;
	description?: string;
	class_id: string;
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
