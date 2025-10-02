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
