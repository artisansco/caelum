export function format_permissions(permission: string) {
	const [category, verb] = permission.split(":");
	return `${verb} ${category}`;
}
