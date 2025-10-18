export const cities = [
	"Freetown",
	"Kenema",
	"Bo",
	"Makeni",
	"Port Loko",
	"Lunsar",
	"Kabala",
	"Kambia",
	"Moyamba",
	"Kailahun",
	"Magburaka",
	"Yengema",
	"Daru",
	"Pendembu",
	"Shenge",
	"Bonthe",
	"Koidu",
] as const;

export const staff_permissions = [
	"students:view",
	"students:create",
	"students:edit",
	"students:delete",

	"staff:view",
	"staff:create",
	"staff:edit",
	"staff:delete",

	"classes:view",
	"classes:create",
	"classes:edit",
	"classes:delete",

	"subjects:view",
	"subjects:create",
	"subjects:edit",
	"subjects:delete",

	// "reports:view",
	// "reports:export",

	// "settings:view",
	// "settings:edit",
];

export const staff_roles = ["admin", "staff", "volunteer", "intern"] as const;

export const staff_statuses = [
	"active",
	"on-leave",
	"terminated",
	"retired",
	"vacation",
	"sick",
	"resigned",
] as const;

export const student_statuses = [
	"enrolled",
	"graduated",
	"alumni",
	"expelled",
] as const;

export const employment_types = [
	"full-time",
	"part-time",
	"contract",
	"intern",
] as const;

export const default_permissions = [
	"students:view",
	"students:create",
	"students:edit",
	"students:delete",
	"staff:view",
	"subjects:view",
	"classes:view",
];

export const grade_types = [
	"assignment",
	"quiz",
	"exam",
	"project",
	"test",
	"participation",
] as const;

export const payment_types = [
	"tuition",
	"registration",
	"transport",
	"meals",
	"books",
	"other",
] as const;

export const payment_methods = [
	"cash",
	"bank_transfer",
	"mobile_money",
	"cheque",
	"card",
	"paypal",
] as const;

export const announcement_types = [
	"general",
	"urgent",
	"event",
	"academic",
	"administrative",
] as const;

export const announcement_priority = ["low", "medium", "high"] as const;

export const announcement_audience = [
	"all",
	"students",
	"staff",
	// "parents",
] as const;

export const school_terms = ["first", "second", "third"] as const;

export const transaction_types = ["subscription", "upgrade"] as const;

// ------

export function get_error_message(status: number) {
	switch (status) {
		case 401:
			return "You need to be logged in to access this page.";
		case 403:
			return "You don't have permission to access this resource.";
		case 404:
			return "Sorry, the page you're looking for doesn't exist.";
		case 500:
			return "Something went wrong on our end. Please try again.";
		default:
			return "An unexpected error occurred.";
	}
}

export function get_error_icon(status: number) {
	switch (status) {
		case 401:
			return "🔒";
		case 403:
			return "🚫";
		case 404:
			return "🔍";
		case 500:
			return "⚠️";
		default:
			return "❌";
	}
}
