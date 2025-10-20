import type { RemoteFormField } from "@sveltejs/kit";

export function format_permissions(permission: string) {
	const [category, verb] = permission.split(":");
	return `${verb} ${category}`;
}

export function get_status_pill(status: string) {
	switch (status) {
		case "active":
			return "badge";
		case "vacation":
			return "badge bg-gray-500";
		case "on-leave":
			return "badge-secondary";
		default:
			return "badge-outline";
	}
}

export function get_field_error(
	key: RemoteFormField<string | File | number | string[]>,
) {
	const issues = key.issues();
	if (!issues) return;

	return issues.at(0)?.message;
}

export function format_currency(amount: number): string {
	return new Intl.NumberFormat("en-SL", {
		style: "currency",
		currency: "SLE",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

export function get_priority_color(priority: string) {
	switch (priority) {
		case "high":
			return "bg-red-100 text-red-800";
		case "medium":
			return "bg-yellow-100 text-yellow-800";
		case "low":
			return "bg-green-100 text-green-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

export function get_type_icon(type: string) {
	switch (type) {
		case "urgent":
			return "icon-[mdi--alert-circle]";
		case "event":
			return "icon-[mdi--calendar-star]";
		case "academic":
			return "icon-[mdi--school]";
		case "administrative":
			return "icon-[mdi--office-building]";
		default:
			return "icon-[mdi--bullhorn]";
	}
}
