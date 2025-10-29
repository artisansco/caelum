/**
 * HTML sanitization utility using DOMPurify
 * Prevents XSS attacks in rich text content from Tiptap editor
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content from rich text editors
 * @param html - Raw HTML string from Tiptap or other editors
 * @returns Sanitized HTML safe for display
 */
export function sanitize_html(html: string): string {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			"p",
			"br",
			"strong",
			"em",
			"u",
			"s",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"ul",
			"ol",
			"li",
			"blockquote",
			"a",
			"code",
			"pre",
		],
		ALLOWED_ATTR: ["href", "target", "rel", "class"],
		ALLOW_DATA_ATTR: false,
	});
}

/**
 * Strip all HTML tags and return plain text
 * Useful for previews or search indexing
 */
export function strip_html(html: string): string {
	return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

/**
 * Sanitize HTML with stricter rules for user-generated content
 * No links, no formatting - just text structure
 */
export function sanitize_user_content(html: string): string {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li"],
		ALLOWED_ATTR: [],
	});
}
