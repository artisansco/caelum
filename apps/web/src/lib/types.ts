export type CurrentUser = {
	id: string;
	email?: string;
	name?: string;
	school_id: string;
};

export type Staff = {
	id: number;
	first_name: string;
	middle_name?: string;
	last_name: string;
	email: string;
	contact: string;
	address: string;
	staff_id: string;
	role: "staff" | "admin";
	department: string;
	status: "active" | "on leave";
	permissions: string[];
	employed_date: string | Date;
	avatar_url?: string;
	notes?: string;
	password?: number;
	school_id: string;
	created_at?: string | Date;
	updated_at?: string | Date;
};
