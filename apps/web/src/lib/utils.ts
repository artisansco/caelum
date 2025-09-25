import type { staff_statuses, student_statuses } from "./constants";

export function format_permissions(permission: string) {
	const [category, verb] = permission.split(":");
	return `${verb} ${category}`;
}

export function get_status_pill(
	status: (typeof staff_statuses)[number] | (typeof student_statuses)[number],
) {
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
