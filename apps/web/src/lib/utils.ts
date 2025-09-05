export function format_permissions(permission: string) {
	const [category, verb] = permission.split(":");
	return `${verb} ${category}`;
}

export function get_status_pill(status: "active" | "inactive" | "on leave") {
	switch (status) {
		case "active":
			return "badge";
		case "inactive":
			return "badge bg-gray-500";
		case "on leave":
			return "badge-secondary";
		default:
			return "badge-outline";
	}
}
