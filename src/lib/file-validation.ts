/**
 * File upload validation utilities
 * Validates file size, type, and content
 */

const ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/gif",
];

const ALLOWED_DOCUMENT_TYPES = [
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"text/plain",
	"text/csv",
];

const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

// File size limits
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

interface ValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Validate file size
 */
export function validate_file_size(
	size: number,
	max_size: number,
): ValidationResult {
	if (size > max_size) {
		const max_mb = (max_size / 1024 / 1024).toFixed(1);
		return {
			valid: false,
			error: `File size exceeds ${max_mb}MB limit`,
		};
	}
	return { valid: true };
}

/**
 * Validate file MIME type
 */
export function validate_file_type(
	mime_type: string,
	allowed_types: string[],
): ValidationResult {
	if (!allowed_types.includes(mime_type)) {
		return {
			valid: false,
			error: `Invalid file type. Allowed types: ${allowed_types.join(", ")}`,
		};
	}
	return { valid: true };
}

/**
 * Validate file extension matches MIME type
 */
export function validate_file_extension(
	filename: string,
	mime_type: string,
): ValidationResult {
	const ext = filename.split(".").pop()?.toLowerCase();
	if (!ext) {
		return { valid: false, error: "File has no extension" };
	}

	const mime_to_ext: Record<string, string[]> = {
		"image/jpeg": ["jpg", "jpeg"],
		"image/png": ["png"],
		"image/webp": ["webp"],
		"image/gif": ["gif"],
		"application/pdf": ["pdf"],
		"application/msword": ["doc"],
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
			"docx",
		],
		"application/vnd.ms-excel": ["xls"],
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
			"xlsx",
		],
		"text/plain": ["txt"],
		"text/csv": ["csv"],
	};

	const expected_extensions = mime_to_ext[mime_type];
	if (!expected_extensions || !expected_extensions.includes(ext)) {
		return {
			valid: false,
			error: "File extension does not match file type",
		};
	}

	return { valid: true };
}

/**
 * Validate image file
 */
export function validate_image(
	file: { size: number; type: string; name: string },
	max_size = MAX_IMAGE_SIZE,
): ValidationResult {
	const size_check = validate_file_size(file.size, max_size);
	if (!size_check.valid) return size_check;

	const type_check = validate_file_type(file.type, ALLOWED_IMAGE_TYPES);
	if (!type_check.valid) return type_check;

	const ext_check = validate_file_extension(file.name, file.type);
	if (!ext_check.valid) return ext_check;

	return { valid: true };
}

/**
 * Validate document file
 */
export function validate_document(
	file: { size: number; type: string; name: string },
	max_size = MAX_DOCUMENT_SIZE,
): ValidationResult {
	const size_check = validate_file_size(file.size, max_size);
	if (!size_check.valid) return size_check;

	const type_check = validate_file_type(file.type, ALLOWED_DOCUMENT_TYPES);
	if (!type_check.valid) return type_check;

	const ext_check = validate_file_extension(file.name, file.type);
	if (!ext_check.valid) return ext_check;

	return { valid: true };
}

/**
 * Validate avatar upload
 */
export function validate_avatar(file: {
	size: number;
	type: string;
	name: string;
}): ValidationResult {
	return validate_image(file, MAX_AVATAR_SIZE);
}

/**
 * Validate assignment upload (images or documents)
 */
export function validate_assignment_file(file: {
	size: number;
	type: string;
	name: string;
}): ValidationResult {
	const size_check = validate_file_size(file.size, MAX_DOCUMENT_SIZE);
	if (!size_check.valid) return size_check;

	const type_check = validate_file_type(file.type, ALL_ALLOWED_TYPES);
	if (!type_check.valid) return type_check;

	const ext_check = validate_file_extension(file.name, file.type);
	if (!ext_check.valid) return ext_check;

	return { valid: true };
}

/**
 * Check if file appears to be malicious
 * Basic checks - not comprehensive security
 */
export function check_suspicious_file(filename: string): ValidationResult {
	const dangerous_extensions = [
		".exe",
		".bat",
		".cmd",
		".com",
		".pif",
		".scr",
		".vbs",
		".js",
		".jar",
		".sh",
		".app",
	];

	const ext = filename.toLowerCase();
	for (const danger_ext of dangerous_extensions) {
		if (ext.endsWith(danger_ext)) {
			return {
				valid: false,
				error: "Executable files are not allowed",
			};
		}
	}

	// Check for double extensions (e.g., file.pdf.exe)
	const parts = filename.split(".");
	if (parts.length > 2) {
		for (let i = 0; i < parts.length - 1; i++) {
			if (dangerous_extensions.some((ext) => `.${parts[i]}` === ext)) {
				return {
					valid: false,
					error: "Suspicious file name detected",
				};
			}
		}
	}

	return { valid: true };
}
