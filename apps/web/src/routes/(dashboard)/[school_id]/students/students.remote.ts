import { form, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";

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

export const get_all_students = query(async () => {
	try {
		const res = await fetch(`${API_ENDPOINT}/api/v1/students`);
		const { message, data } = await res.json();

		if (!res.ok) {
			return { message };
		}

		return data.students;
	} catch (_e) {
		return { message: _e.message };
	}
});

export const get_staff = query(() => {
	// Simulate API delay
	// new Promise((r) => setTimeout(() => r, 500));
	return staff;
});

export const add_staff = form((form_data) => {
	const staffData = {
		id: staff.length + 1,
		name: form_data.get("name")?.toString(),
		email: form_data.get("email")?.toString(),
		contact: form_data.get("contact")?.toString(),
		username: form_data.get("username")?.toString(),
		employee_id: form_data.get("employee_id")?.toString(),
		role: form_data.get("role")?.toString(),
		department: form_data.get("department")?.toString(),
		shift: form_data.get("shift")?.toString(),
		status: form_data.get("status")?.toString() || "active",
		hire_date: form_data.get("hire_date")?.toString(),
		// @ts-expect-error
		salary: Number.parseFloat(form_data.get("salary")) || 0,
		avatar: "null", // Will be added later
		certifications: form_data.get("certifications")?.toString().split(","),
		notes: form_data.get("notes")?.toString() || "",
	};

	console.log("Adding new staff member:", staffData);

	// In a real app, this would save to database
	staff.push(staffData);

	return staffData;
});

export const get_staff_by_id = query((id) => {
	return staff.find((person) => person.id === parseInt(id));
});

export const update_staff = form((form_data) => {
	const id = parseInt(form_data.get("id"));
	const staffIndex = staff.findIndex((person) => person.id === id);

	if (staffIndex === -1) {
		throw new Error("Staff member not found");
	}

	const updatedData = {
		...staff[staffIndex],
		name: form_data.get("name") || staff[staffIndex].name,
		email: form_data.get("email") || staff[staffIndex].email,
		contact: form_data.get("contact") || staff[staffIndex].contact,
		role: form_data.get("role") || staff[staffIndex].role,
		department: form_data.get("department") || staff[staffIndex].department,
		shift: form_data.get("shift") || staff[staffIndex].shift,
		status: form_data.get("status") || staff[staffIndex].status,
		salary: form_data.get("salary")
			? parseFloat(form_data.get("salary"))
			: staff[staffIndex].salary,
		certifications: form_data.get("certifications")
			? form_data
					.get("certifications")
					.split(",")
					.map((cert) => cert.trim())
			: staff[staffIndex].certifications,
		notes: form_data.get("notes") || staff[staffIndex].notes,
	};

	staff[staffIndex] = updatedData;
	console.log("Updated staff member:", updatedData);

	return updatedData;
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
