import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./database";
import {
	schools_table,
	subscriptions_table,
	referrals_table,
} from "./database/schema";
import type { Subscription_Tier } from "$lib/features";
import { get_sms_quota } from "$lib/features";

/**
 * Generate a unique referral code
 */
export function generate_referral_code(): string {
	return nanoid(8).toUpperCase();
}

/**
 * Create referral code for a school (if not already exists)
 */
export async function create_referral_code(school_id: string): Promise<string | null> {
	const school = await db
		.select({ referral_code: schools_table.referral_code })
		.from(schools_table)
		.where(eq(schools_table.id, school_id))
		.limit(1);

	if (!school[0]) return null;

	// Already has a code
	if (school[0].referral_code) {
		return school[0].referral_code;
	}

	// Generate new code
	let code = generate_referral_code();
	let attempts = 0;
	const max_attempts = 10;

	// Ensure uniqueness
	while (attempts < max_attempts) {
		const existing = await db
			.select()
			.from(schools_table)
			.where(eq(schools_table.referral_code, code))
			.limit(1);

		if (existing.length === 0) break;

		code = generate_referral_code();
		attempts++;
	}

	// Update school with referral code
	await db
		.update(schools_table)
		.set({ referral_code: code })
		.where(eq(schools_table.id, school_id));

	return code;
}

/**
 * Validate referral code
 */
export async function validate_referral_code(
	code: string,
): Promise<{ valid: boolean; school_id?: string }> {
	const school = await db
		.select({ id: schools_table.id })
		.from(schools_table)
		.where(eq(schools_table.referral_code, code))
		.limit(1);

	if (school.length === 0) {
		return { valid: false };
	}

	return { valid: true, school_id: school[0].id };
}

/**
 * Apply referral code during signup
 */
export async function apply_referral_code(
	new_school_id: string,
	referral_code: string,
): Promise<boolean> {
	const validation = await validate_referral_code(referral_code);

	if (!validation.valid || !validation.school_id) {
		return false;
	}

	// Don't allow self-referral
	if (validation.school_id === new_school_id) {
		return false;
	}

	// Update new school with referred_by
	await db
		.update(schools_table)
		.set({ referred_by: referral_code })
		.where(eq(schools_table.id, new_school_id));

	// Create referral tracking entry
	await db.insert(referrals_table).values({
		referrer_school_id: validation.school_id,
		referred_school_id: new_school_id,
		referral_code: referral_code,
		status: "pending",
	});

	return true;
}

/**
 * Convert referral when referred school makes first payment
 */
export async function convert_referral(referred_school_id: string): Promise<void> {
	// Find pending referral
	const referral = await db
		.select()
		.from(referrals_table)
		.where(
			and(
				eq(referrals_table.referred_school_id, referred_school_id),
				eq(referrals_table.status, "pending"),
			),
		)
		.limit(1);

	if (referral.length === 0) return;

	const ref = referral[0];

	// Mark referral as converted
	await db
		.update(referrals_table)
		.set({
			status: "converted",
			converted_at: new Date().toISOString(),
		})
		.where(eq(referrals_table.id, ref.id));

	// Get referring school details
	const referrer = await db
		.select()
		.from(schools_table)
		.where(eq(schools_table.id, ref.referrer_school_id))
		.limit(1);

	if (referrer.length === 0) return;

	const referrer_school = referrer[0];

	// Add 1 month to referring school's subscription
	let new_expiry_date: Date;

	if (referrer_school.subscription_expires_at) {
		// Extend existing expiry
		new_expiry_date = new Date(referrer_school.subscription_expires_at);
		new_expiry_date.setMonth(new_expiry_date.getMonth() + 1);
	} else {
		// Start from now
		new_expiry_date = new Date();
		new_expiry_date.setMonth(new_expiry_date.getMonth() + 1);
	}

	// If on free tier, activate Standard for 1 month
	const new_tier =
		referrer_school.subscription_tier === "free"
			? "standard"
			: referrer_school.subscription_tier;

	await db
		.update(schools_table)
		.set({
			subscription_tier: new_tier,
			subscription_expires_at: new_expiry_date.toISOString(),
			referral_credits: referrer_school.referral_credits + 1,
			subscription_status: "active",
		})
		.where(eq(schools_table.id, ref.referrer_school_id));

	// TODO: Send notification to referring school
	console.log(
		`Referral converted! School ${ref.referrer_school_id} earned 1 free month`,
	);
}

/**
 * Process subscription payment
 */
export async function process_subscription_payment(params: {
	school_id: string;
	tier: Subscription_Tier;
	duration_months: number;
	amount: number;
	payment_method: string;
	transaction_id?: string;
	referral_code_used?: string;
}): Promise<{ success: boolean; subscription_id?: string }> {
	const {
		school_id,
		tier,
		duration_months,
		amount,
		payment_method,
		transaction_id,
		referral_code_used,
	} = params;

	// Create subscription payment record
	const result = await db.insert(subscriptions_table).values({
		school_id,
		tier,
		amount,
		duration_months,
		payment_method: payment_method as any,
		transaction_id,
		status: "completed",
		referral_code_used,
	});

	const subscription_id = result.lastInsertRowid.toString();

	// Calculate new expiry date
	const school = await db
		.select()
		.from(schools_table)
		.where(eq(schools_table.id, school_id))
		.limit(1);

	if (school.length === 0) {
		return { success: false };
	}

	const current_school = school[0];
	let new_expiry_date: Date;

	if (
		current_school.subscription_expires_at &&
		new Date(current_school.subscription_expires_at) > new Date()
	) {
		// Extend existing subscription
		new_expiry_date = new Date(current_school.subscription_expires_at);
		new_expiry_date.setMonth(new_expiry_date.getMonth() + duration_months);
	} else {
		// Start from now
		new_expiry_date = new Date();
		new_expiry_date.setMonth(new_expiry_date.getMonth() + duration_months);
	}

	// Update school subscription
	const sms_quota = get_sms_quota(tier);

	await db
		.update(schools_table)
		.set({
			subscription_tier: tier,
			subscription_status: "active",
			subscription_expires_at: new_expiry_date.toISOString(),
			sms_quota_limit: sms_quota,
		})
		.where(eq(schools_table.id, school_id));

	// Check if this is first payment (convert referral)
	const previous_payments = await db
		.select()
		.from(subscriptions_table)
		.where(
			and(
				eq(subscriptions_table.school_id, school_id),
				eq(subscriptions_table.status, "completed"),
			),
		);

	if (previous_payments.length === 1) {
		// This is the first payment, convert referral
		await convert_referral(school_id);
	}

	// If referral code was used, convert it
	if (referral_code_used) {
		await convert_referral(school_id);
	}

	return { success: true, subscription_id };
}

/**
 * Downgrade school to free tier (called when subscription expires)
 */
export async function downgrade_to_free(school_id: string): Promise<void> {
	await db
		.update(schools_table)
		.set({
			subscription_tier: "free",
			subscription_status: "expired",
			sms_quota_limit: 0,
			sms_quota_used: 0,
		})
		.where(eq(schools_table.id, school_id));

	console.log(`School ${school_id} downgraded to free tier`);
}

/**
 * Check if school is in grace period
 */
export async function is_in_grace_period(school_id: string): Promise<boolean> {
	const school = await db
		.select({ expires_at: schools_table.subscription_expires_at })
		.from(schools_table)
		.where(eq(schools_table.id, school_id))
		.limit(1);

	if (!school[0] || !school[0].expires_at) return false;

	const expiry_date = new Date(school[0].expires_at);
	const grace_period_end = new Date(expiry_date);
	grace_period_end.setDate(grace_period_end.getDate() + 3);

	const now = new Date();
	return now > expiry_date && now <= grace_period_end;
}
