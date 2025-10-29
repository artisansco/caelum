import type { subscription_tiers } from "./constants";

export type Subscription_Tier = (typeof subscription_tiers)[number];

/**
 * Feature access configuration for each subscription tier
 */
export const tier_features = {
	free: {
		// Core CRUD operations
		students: { view: true, create: true, edit: true, delete: true },
		staff: { view: true, create: true, edit: true, delete: true },
		classes: { view: true, create: true, edit: true, delete: true },
		subjects: { view: true, create: true, edit: true, delete: true },
		grades: { view: true, create: true, edit: true, delete: true },
		attendance: { view: true, create: true, edit: true, delete: true },
		announcements: { view: true, create: true, edit: true, delete: true },
		guardians: { view: true, create: true, edit: true, delete: true },

		// Restricted features
		file_uploads: false,
		logo_upload: false,
		assignment_uploads: false,
		student_photos: false,
		pdf_generation: false,
		bulk_imports: false,
		parent_portal: false,
		sms_notifications: false,
		email_notifications: false,
		timetable: false,

		// Limits
		storage_limit_gb: 0,
		sms_quota: 0,

		// Exports
		csv_exports: true,
		excel_exports: true,
		browser_print: true,
	},

	standard: {
		// All free features plus:
		students: { view: true, create: true, edit: true, delete: true },
		staff: { view: true, create: true, edit: true, delete: true },
		classes: { view: true, create: true, edit: true, delete: true },
		subjects: { view: true, create: true, edit: true, delete: true },
		grades: { view: true, create: true, edit: true, delete: true },
		attendance: { view: true, create: true, edit: true, delete: true },
		announcements: { view: true, create: true, edit: true, delete: true },
		guardians: { view: true, create: true, edit: true, delete: true },

		// Standard features
		file_uploads: true,
		logo_upload: true,
		assignment_uploads: true,
		student_photos: false, // Pro only
		pdf_generation: true,
		bulk_imports: true,
		parent_portal: true, // view-only
		sms_notifications: false, // Pro only
		email_notifications: false, // Pro only
		timetable: true,

		// Limits
		storage_limit_gb: 5,
		sms_quota: 0,

		// Exports
		csv_exports: true,
		excel_exports: true,
		browser_print: true,
		pdf_exports: true,
	},

	pro: {
		// All standard features plus:
		students: { view: true, create: true, edit: true, delete: true },
		staff: { view: true, create: true, edit: true, delete: true },
		classes: { view: true, create: true, edit: true, delete: true },
		subjects: { view: true, create: true, edit: true, delete: true },
		grades: { view: true, create: true, edit: true, delete: true },
		attendance: { view: true, create: true, edit: true, delete: true },
		announcements: { view: true, create: true, edit: true, delete: true },
		guardians: { view: true, create: true, edit: true, delete: true },

		// Pro features
		file_uploads: true,
		logo_upload: true,
		assignment_uploads: true,
		student_photos: true,
		pdf_generation: true,
		bulk_imports: true,
		parent_portal: true,
		sms_notifications: true,
		email_notifications: true,
		timetable: true,

		// Limits
		storage_limit_gb: 20,
		sms_quota: 150, // per month

		// Exports
		csv_exports: true,
		excel_exports: true,
		browser_print: true,
		pdf_exports: true,
	},
} as const;

/**
 * Pricing configuration (in USD cents)
 */
export const pricing = {
	standard: {
		monthly: 1000, // $10
		quarterly: 2850, // $28.50 (5% off)
		biannual: 5400, // $54 (10% off)
		annual: 10000, // $100 (20% off = 2 months free)
	},
	pro: {
		monthly: 3000, // $30
		quarterly: 8550, // $85.50 (5% off)
		biannual: 16200, // $162 (10% off)
		annual: 30000, // $300 (20% off = 2 months free)
	},
} as const;

/**
 * Storage limits in bytes
 */
export const storage_limits = {
	free: 0,
	standard: 5 * 1024 * 1024 * 1024, // 5GB
	pro: 20 * 1024 * 1024 * 1024, // 20GB
} as const;

/**
 * SMS quotas per month
 */
export const sms_quotas = {
	free: 0,
	standard: 0,
	pro: 150,
} as const;

/**
 * Check if a tier has access to a specific feature
 */
export function has_feature_access(
	tier: Subscription_Tier,
	feature: keyof typeof tier_features.free,
): boolean {
	const tier_feature_set = tier_features[tier];
	const feature_value = tier_feature_set[feature as keyof typeof tier_feature_set];

	// Handle object features (like students.view)
	if (typeof feature_value === "object") {
		return true; // If it's an object, assume at least view access
	}

	return Boolean(feature_value);
}

/**
 * Get storage limit for a tier in bytes
 */
export function get_storage_limit(tier: Subscription_Tier): number {
	return storage_limits[tier];
}

/**
 * Get SMS quota for a tier
 */
export function get_sms_quota(tier: Subscription_Tier): number {
	return sms_quotas[tier];
}

/**
 * Get human-readable feature list for a tier
 */
export function get_tier_features(tier: Subscription_Tier): string[] {
	const features = tier_features[tier];
	const feature_list: string[] = [];

	if (features.file_uploads) feature_list.push("File uploads");
	if (features.logo_upload) feature_list.push("School logo & branding");
	if (features.assignment_uploads) feature_list.push("Assignment uploads");
	if (features.pdf_generation) feature_list.push("PDF report generation");
	if (features.bulk_imports) feature_list.push("Bulk CSV imports");
	if (features.parent_portal) feature_list.push("Parent portal");
	if (features.sms_notifications) feature_list.push("SMS notifications");
	if (features.email_notifications) feature_list.push("Email notifications");
	if (features.timetable) feature_list.push("Timetable management");

	if (features.storage_limit_gb > 0) {
		feature_list.push(`${features.storage_limit_gb}GB storage`);
	}

	if (features.sms_quota > 0) {
		feature_list.push(`${features.sms_quota} SMS/month`);
	}

	return feature_list;
}
