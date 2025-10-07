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

export function get_field_error(key: RemoteFormField<string | File>) {
	const issues = key.issues();
	if (!issues) return;

	return issues.at(0)?.message;
}
