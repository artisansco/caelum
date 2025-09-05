import { error, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import type { Staff } from "$lib/types";

const staff = [
	{
		id: 1,
		name: "Sarah Johnson",
		email: "sarah.johnson@hotel.com",
		contact: "+1 (555) 123-4567",
		username: "sjohnson",
		employee_id: "EMP001",
		role: "front-desk",
		department: "Front Office",
		shift: "morning",
		status: "active",
		hire_date: "2023-01-15",
		salary: 18.5,
		avatar: "https://randomuser.me/api/portraits/thumb/women/75.jpg",
		certifications: ["Guest Services", "PMS Training"],
		notes: "Excellent customer service skills, fluent in Spanish",
	},
	{
		id: 2,
		name: "Michael Chen",
		email: "michael.chen@hotel.com",
		contact: "+1 (555) 234-5678",
		username: "mchen",
		employee_id: "EMP002",
		role: "housekeeping",
		department: "Housekeeping",
		shift: "morning",
		status: "active",
		hire_date: "2023-03-10",
		salary: 16.75,
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		certifications: ["Safety Training", "Chemical Handling"],
		notes: "Team supervisor, 5 years experience",
	},
	{
		id: 3,
		name: "Emily Rodriguez",
		email: "emily.rodriguez@hotel.com",
		contact: "+1 (555) 345-6789",
		username: "erodriguez",
		employee_id: "EMP003",
		role: "manager",
		department: "Front Office",
		shift: "rotating",
		status: "active",
		hire_date: "2022-08-01",
		salary: 65000,
		avatar:
			"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
		certifications: [
			"Hotel Management",
			"Leadership Training",
			"Revenue Management",
		],
		notes: "Front Office Manager with 8 years hospitality experience",
	},
	{
		id: 4,
		name: "David Thompson",
		email: "david.thompson@hotel.com",
		contact: "+1 (555) 456-7890",
		username: "dthompson",
		employee_id: "EMP004",
		role: "maintenance",
		department: "Maintenance",
		shift: "morning",
		status: "active",
		hire_date: "2023-05-20",
		salary: 22.0,
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		certifications: ["HVAC Certification", "Electrical Safety", "Plumbing"],
		notes: "Licensed electrician and HVAC technician",
	},
	{
		id: 5,
		name: "Lisa Park",
		email: "lisa.park@hotel.com",
		contact: "+1 (555) 567-8901",
		username: "lpark",
		employee_id: "EMP005",
		role: "concierge",
		department: "Guest Services",
		shift: "afternoon",
		status: "active",
		hire_date: "2023-02-14",
		salary: 19.25,
		avatar:
			"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
		certifications: ["Local Tourism", "Customer Service Excellence"],
		notes: "Multilingual - English, Korean, Japanese",
	},
	{
		id: 6,
		name: "James Wilson",
		email: "james.wilson@hotel.com",
		contact: "+1 (555) 678-9012",
		username: "jwilson",
		employee_id: "EMP006",
		role: "security",
		department: "Security",
		shift: "night",
		status: "active",
		hire_date: "2023-04-01",
		salary: 17.5,
		avatar:
			"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
		certifications: ["Security Guard License", "First Aid", "CPR"],
		notes: "Former police officer, 10 years law enforcement experience",
	},
	{
		id: 7,
		name: "Maria Garcia",
		email: "maria.garcia@hotel.com",
		contact: "+1 (555) 789-0123",
		username: "mgarcia",
		employee_id: "EMP007",
		role: "restaurant",
		department: "Food & Beverage",
		shift: "evening",
		status: "on-break",
		hire_date: "2022-11-30",
		salary: 15.0,
		avatar:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
		certifications: ["Food Safety", "Alcohol Service"],
		notes: "Head server at hotel restaurant, currently on lunch break",
	},
	{
		id: 8,
		name: "Robert Kim",
		email: "robert.kim@hotel.com",
		contact: "+1 (555) 890-1234",
		username: "rkim",
		employee_id: "EMP008",
		role: "valet",
		department: "Guest Services",
		shift: "afternoon",
		status: "active",
		hire_date: "2023-06-15",
		salary: 16.0,
		avatar: "https://randomuser.me/api/portraits/thumb/women/50.jpg",
		certifications: ["Defensive Driving", "Customer Service"],
		notes: "Clean driving record, experienced with luxury vehicles",
	},
];

const staff_schema = z.object({
	first_name: z
		.string({ error: "First name is required" })
		.trim()
		.min(2, { error: "First name must be at least 2 characters long" }),
	middle_name: z
		.string({ error: "Middle name is required" })
		.trim()
		.min(2, { error: "Middle name must be at least 2 characters long" })
		.optional(),
	last_name: z
		.string({ error: "Last name is required" })
		.trim()
		.min(2, { error: "Last name must be at least 2 characters long" }),
	staff_id: z
		.string({ error: "Staff ID is required" })
		.trim()
		.min(2, { error: "Staff ID must be at least 2 characters long" }),
	email: z.email({ error: "Invalid email address" }),
	employed_on: z.iso.date({ error: "Invalid date format" }),
	address: z
		.string({ error: "Invalid address" })
		.trim()
		.min(2, { error: "Address must be at least 2 characters long" }),
	phone_number: z
		.string({ error: "Invalid phone number" })
		.trim()
		.min(6, { error: "Phone number must be at least 6 characters long" }),
	password: z
		.string({ error: "Invalid password" })
		.trim()
		.min(6, { error: "Password must be at least 6 characters long" }),
	permissions: z
		.array(z.string().trim(), { error: "Permissions are required" })
		.min(1, { error: "At least one permission is required" }),
	role: z.enum(["admin", "staff"]),
	school_id: z
		.string({ error: "Invalid school ID" })
		.trim()
		.min(2, { error: "School ID must be at least 2 characters long" }),
});

export const get_all_staff = query(async () => {
	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff`);
		const { data, message } = await res.json();
		if (!res.ok) {
			return { message };
		}

		return data.staff;
	} catch (_e) {
		console.error(_e);
		return { message: "failed to fetch staff" };
	}
});

export const get_staff_by_id = query(
	z
		.string()
		.trim()
		.min(2, { error: "Staff ID must be at least 2 characters long" }),
	async (staff_id) => {
		try {
			const res = await fetch(`${API_ENDPOINT}/api/v1/staff/${staff_id}`);
			const { data, message } = await res.json();
			if (!res.ok) {
				error(404, { message });
			}

			return data as Staff;
		} catch (_e) {
			console.error(_e);
			error(500, { message: _e.message });
		}
	},
);

export const add_staff = form(async (form_data) => {
	const form = Object.fromEntries(form_data);
	form.permissions = (form_data.getAll("permissions") ||
		[]) as unknown as FormDataEntryValue;
	const { success, data: parsed, error } = staff_schema.safeParse(form);

	if (!success) {
		const message = error.issues.at(0)?.message as string;
		return { message, errors: z.treeifyError(error).properties };
	}

	const { cookies } = getRequestEvent();

	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + cookies.get("token"),
			},
			body: JSON.stringify(parsed),
		});
		const { data, message } = await res.json();
		if (!res.ok) {
			return { message };
		}

		console.log("new_staff", data);
	} catch (error) {
		console.error(error);
		return { message: "Failed to add staff member" };
	}

	redirect(302, "/" + parsed.school_id + "/staff");
});

export const update_staff = form(async (form_data) => {
	const form = Object.fromEntries(form_data);
	form.permissions = (form_data.getAll("permissions") ||
		[]) as unknown as FormDataEntryValue;
	const {
		success,
		data: parsed,
		error,
	} = staff_schema
		.partial({ password: true })
		.omit({ employed_on: true })
		.safeParse(form);

	if (!success) {
		const message = error.issues.at(0)?.message as string;
		return { message, errors: z.treeifyError(error).properties };
	}

	const { cookies } = getRequestEvent();
	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/staff/${parsed.staff_id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("token")}`,
			},
			body: JSON.stringify(parsed),
		});
		const { message, data } = await res.json();
		if (!res.ok) {
			return { message };
		}
		console.log({ data });
		return { message: "Staff member updated successfully" };
	} catch (_e) {
		// @ts-expect-error
		return { message: _e.message };
	}
});

export const delete_staff = form((form_data) => {
	const id = parseInt(form_data.get("id"));
	const staffIndex = staff.findIndex((person) => person.id === id);

	if (staffIndex === -1) {
		throw new Error("Staff member not found");
	}

	const deletedStaff = staff.splice(staffIndex, 1)[0];
	console.log("Deleted staff member:", deletedStaff);

	return deletedStaff;
});
