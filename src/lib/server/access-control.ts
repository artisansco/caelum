import { eq } from "drizzle-orm";
import { db } from "./database";
import { schools_table } from "./database/schema";
import type { Subscription_Tier } from "$lib/features";
import {
	has_feature_access,
	get_storage_limit,
	get_sms_quota,
	tier_features,
} from "$lib/features";

export type Feature_Name = keyof typeof tier_features.free;

/**
 * Get school's subscription details
 */
export async function get_school_subscription(school_id: string) {
	const school = await db
		.select({
			tier: schools_table.subscription_tier,
			status: schools_table.subscription_status,
			expires_at: schools_table.subscription_expires_at,
			storage_used: schools_table.storage_used,
			sms_quota_used: schools_table.sms_quota_used,
			sms_quota_limit: schools_table.sms_quota_limit,
			referral_code: schools_table.referral_code,
			referral_credits: schools_table.referral_credits,
		})
		.from(schools_table)
		.where(eq(schools_table.id, school_id))
		.limit(1);

	return school[0] || null;
}

/**
 * Check if school has access to a specific feature
 */
export async function check_feature_access(
	school_id: string,
	feature: Feature_Name,
): Promise<{ allowed: boolean; reason?: string }> {
	const subscription = await get_school_subscription(school_id);

	if (!subscription) {
		return { allowed: false, reason: "School not found" };
	}

	// Check if subscription is expired
	if (subscription.expires_at && new Date(subscription.expires_at) < new Date()) {
		// Check if grace period (3 days) has passed
		const grace_period_end = new Date(subscription.expires_at);
		grace_period_end.setDate(grace_period_end.getDate() + 3);

		if (new Date() > grace_period_end) {
			return {
				allowed: false,
				reason: "Subscription expired. Please renew to continue.",
			};
		}
	}

	// Check tier access
	const tier = subscription.tier as Subscription_Tier;
	const has_access = has_feature_access(tier, feature);

	if (!has_access) {
		return {
			allowed: false,
			reason: `This feature requires ${get_required_tier(feature)} tier or higher.`,
		};
	}

	return { allowed: true };
}

/**
 * Check if school has storage quota available
 */
export async function check_storage_quota(
	school_id: string,
	additional_bytes: number,
): Promise<{ allowed: boolean; reason?: string }> {
	const subscription = await get_school_subscription(school_id);

	if (!subscription) {
		return { allowed: false, reason: "School not found" };
	}

	const tier = subscription.tier as Subscription_Tier;
	const storage_limit = get_storage_limit(tier);

	if (storage_limit === 0) {
		return {
			allowed: false,
			reason: "File uploads require Standard tier or higher.",
		};
	}

	const new_storage_used = subscription.storage_used + additional_bytes;

	if (new_storage_used > storage_limit) {
		return {
			allowed: false,
			reason: `Storage limit exceeded. Upgrade to Pro for more storage.`,
		};
	}

	return { allowed: true };
}

/**
 * Check if school has SMS quota available
 */
export async function check_sms_quota(
	school_id: string,
	count: number = 1,
): Promise<{ allowed: boolean; reason?: string }> {
	const subscription = await get_school_subscription(school_id);

	if (!subscription) {
		return { allowed: false, reason: "School not found" };
	}

	const tier = subscription.tier as Subscription_Tier;
	const sms_quota = get_sms_quota(tier);

	if (sms_quota === 0) {
		return {
			allowed: false,
			reason: "SMS notifications require Pro tier.",
		};
	}

	if (subscription.sms_quota_used + count > sms_quota) {
		return {
			allowed: false,
			reason: `SMS quota exceeded. You've used ${subscription.sms_quota_used}/${sms_quota} SMS this month.`,
		};
	}

	return { allowed: true };
}

/**
 * Increment storage used for a school
 */
export async function increment_storage_used(
	school_id: string,
	bytes: number,
): Promise<void> {
	const school = await db
		.select({ storage_used: schools_table.storage_used })
		.from(schools_table)
		.where(eq(schools_table.id, school_id))
		.limit(1);

	if (school[0]) {
		await db
			.update(schools_table)
			.set({ storage_used: school[0].storage_used + bytes })
			.where(eq(schools_table.id, school_id));
	}
}

/**
 * Decrement storage used for a school (when files are deleted)
 */
export async function decrement_storage_used(
	school_id: string,
	bytes: number,
): Promise<void> {
	const school = await db
		.select({ storage_used: schools_table.storage_used })
		.from(schools_table)
		.where(eq(schools_table.id, school_id))
		.limit(1);

	if (school[0]) {
		const new_storage = Math.max(0, school[0].storage_used - bytes);
		await db
			.update(schools_table)
			.set({ storage_used: new_storage })
			.where(eq(schools_table.id, school_id));
	}
}

/**
 * Increment SMS quota used
 */
export async function increment_sms_used(
	school_id: string,
	count: number = 1,
): Promise<void> {
	const school = await db
		.select({ sms_quota_used: schools_table.sms_quota_used })
		.from(schools_table)
		.where(eq(schools_table.id, school_id))
		.limit(1);

	if (school[0]) {
		await db
			.update(schools_table)
			.set({ sms_quota_used: school[0].sms_quota_used + count })
			.where(eq(schools_table.id, school_id));
	}
}

/**
 * Reset SMS quota (called monthly by cron)
 */
export async function reset_sms_quota(school_id: string): Promise<void> {
	await db
		.update(schools_table)
		.set({ sms_quota_used: 0 })
		.where(eq(schools_table.id, school_id));
}

/**
 * Get required tier for a feature
 */
function get_required_tier(feature: Feature_Name): string {
	if (has_feature_access("free", feature)) return "Free";
	if (has_feature_access("standard", feature)) return "Standard";
	if (has_feature_access("pro", feature)) return "Pro";
	return "Unknown";
}

/**
 * Check if school's subscription is active (not expired beyond grace period)
 */
export async function is_subscription_active(school_id: string): Promise<boolean> {
	const subscription = await get_school_subscription(school_id);

	if (!subscription) return false;

	// Free tier is always active
	if (subscription.tier === "free") return true;

	// No expiry date means active
	if (!subscription.expires_at) return true;

	const expiry_date = new Date(subscription.expires_at);
	const grace_period_end = new Date(expiry_date);
	grace_period_end.setDate(grace_period_end.getDate() + 3);

	return new Date() <= grace_period_end;
}

/**
 * Get days remaining until subscription expires
 */
export async function get_days_until_expiry(school_id: string): Promise<number | null> {
	const subscription = await get_school_subscription(school_id);

	if (!subscription || !subscription.expires_at) return null;

	const expiry_date = new Date(subscription.expires_at);
	const now = new Date();
	const diff_time = expiry_date.getTime() - now.getTime();
	const diff_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24));

	return diff_days;
}
