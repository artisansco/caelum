/**
 * SMS service using Africa's Talking
 * Handles SMS notifications for African markets
 */

import AfricasTalking from "africastalking";

// Initialize Africa's Talking client
const credentials =
	process.env.AFRICAS_TALKING_API_KEY && process.env.AFRICAS_TALKING_USERNAME
		? {
				apiKey: process.env.AFRICAS_TALKING_API_KEY,
				username: process.env.AFRICAS_TALKING_USERNAME,
			}
		: null;

const client = credentials ? AfricasTalking(credentials) : null;
const sms = client?.SMS;

interface SmsOptions {
	to: string | string[];
	message: string;
	from?: string;
}

/**
 * Send SMS using Africa's Talking
 */
export async function send_sms(
	options: SmsOptions,
): Promise<{ success: boolean; message?: string }> {
	if (!sms) {
		console.warn("Africa's Talking not configured. SMS not sent.");
		return { success: false, message: "SMS service not configured" };
	}

	try {
		const recipients = Array.isArray(options.to) ? options.to : [options.to];

		const result = await sms.send({
			to: recipients,
			message: options.message,
			from: options.from,
		});

		if (result.SMSMessageData.Recipients[0].status !== "Success") {
			console.error("Failed to send SMS:", result);
			return {
				success: false,
				message: result.SMSMessageData.Recipients[0].status,
			};
		}

		return { success: true };
	} catch (error) {
		console.error("SMS error:", error);
		return { success: false, message: "Failed to send SMS" };
	}
}

/**
 * Send bulk SMS to multiple recipients
 */
export async function send_bulk_sms(
	recipients: string[],
	message: string,
): Promise<{ success: boolean; sent: number; failed: number }> {
	if (!sms) {
		console.warn("Africa's Talking not configured. SMS not sent.");
		return { success: false, sent: 0, failed: recipients.length };
	}

	try {
		const result = await sms.send({
			to: recipients,
			message,
		});

		const successful = result.SMSMessageData.Recipients.filter(
			(r) => r.status === "Success",
		).length;

		return {
			success: true,
			sent: successful,
			failed: recipients.length - successful,
		};
	} catch (error) {
		console.error("Bulk SMS error:", error);
		return { success: false, sent: 0, failed: recipients.length };
	}
}

/**
 * Send absence alert SMS to parent
 */
export async function send_absence_alert_sms(
	phone: string,
	student_name: string,
	date: string,
): Promise<{ success: boolean; message?: string }> {
	const message = `CAELUM ALERT: ${student_name} was marked absent on ${date}. Please contact the school if this is incorrect.`;

	return send_sms({ to: phone, message });
}

/**
 * Send urgent announcement SMS
 */
export async function send_urgent_announcement_sms(
	recipients: string[],
	title: string,
	content: string,
): Promise<{ success: boolean; sent: number; failed: number }> {
	// Truncate content for SMS (160 char limit)
	const truncated = content.substring(0, 100);
	const message = `URGENT: ${title}\n${truncated}... Log in for full details.`;

	return send_bulk_sms(recipients, message);
}

/**
 * Send payment reminder SMS
 */
export async function send_payment_reminder_sms(
	phone: string,
	student_name: string,
	amount: number,
): Promise<{ success: boolean; message?: string }> {
	const message = `Payment reminder for ${student_name}: ${amount} SLL due. Please make payment soon. - Caelum`;

	return send_sms({ to: phone, message });
}

/**
 * Send emergency alert SMS
 */
export async function send_emergency_alert_sms(
	recipients: string[],
	message: string,
): Promise<{ success: boolean; sent: number; failed: number }> {
	const alert_message = `EMERGENCY ALERT: ${message}`;

	return send_bulk_sms(recipients, alert_message);
}
