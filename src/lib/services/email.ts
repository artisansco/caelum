/**
 * Email service using Resend
 * Handles transactional emails for the application
 */

import { Resend } from "resend";

// Initialize Resend client (API key from environment)
const resend = process.env.RESEND_API_KEY
	? new Resend(process.env.RESEND_API_KEY)
	: null;

interface EmailOptions {
	to: string | string[];
	subject: string;
	html: string;
	from?: string;
}

/**
 * Send an email using Resend
 */
export async function send_email(
	options: EmailOptions,
): Promise<{ success: boolean; message?: string }> {
	if (!resend) {
		console.warn("Resend API key not configured. Email not sent.");
		return { success: false, message: "Email service not configured" };
	}

	try {
		const result = await resend.emails.send({
			from: options.from || "Caelum <noreply@caelum.app>",
			to: Array.isArray(options.to) ? options.to : [options.to],
			subject: options.subject,
			html: options.html,
		});

		if (result.error) {
			console.error("Failed to send email:", result.error);
			return { success: false, message: result.error.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Email error:", error);
		return { success: false, message: "Failed to send email" };
	}
}

/**
 * Send welcome email to new staff member
 */
export async function send_welcome_email(
	email: string,
	name: string,
): Promise<{ success: boolean; message?: string }> {
	const html = `
    <h1>Welcome to Caelum, ${name}!</h1>
    <p>Your account has been created successfully.</p>
    <p>You can now log in to the system and start managing your school.</p>
    <p>If you have any questions, please contact your administrator.</p>
  `;

	return send_email({
		to: email,
		subject: "Welcome to Caelum School Management System",
		html,
	});
}

/**
 * Send password reset email
 */
export async function send_password_reset_email(
	email: string,
	reset_token: string,
	base_url: string,
): Promise<{ success: boolean; message?: string }> {
	const reset_link = `${base_url}/reset-password?token=${reset_token}`;

	const html = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password. Click the link below to continue:</p>
    <p><a href="${reset_link}">Reset Password</a></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

	return send_email({
		to: email,
		subject: "Reset Your Password - Caelum",
		html,
	});
}

/**
 * Send announcement notification email
 */
export async function send_announcement_email(
	recipients: string[],
	title: string,
	content: string,
): Promise<{ success: boolean; message?: string }> {
	const html = `
    <h1>New Announcement: ${title}</h1>
    <div>${content}</div>
    <p><em>This is an automated notification from Caelum School Management System.</em></p>
  `;

	return send_email({
		to: recipients,
		subject: `New Announcement: ${title}`,
		html,
	});
}

/**
 * Send grade notification email to parent
 */
export async function send_grade_notification_email(
	parent_email: string,
	student_name: string,
	subject: string,
	grade: number,
	max_score: number,
): Promise<{ success: boolean; message?: string }> {
	const percentage = ((grade / max_score) * 100).toFixed(1);

	const html = `
    <h1>New Grade Posted</h1>
    <p>A new grade has been posted for ${student_name}:</p>
    <ul>
      <li><strong>Subject:</strong> ${subject}</li>
      <li><strong>Score:</strong> ${grade}/${max_score} (${percentage}%)</li>
    </ul>
    <p>Log in to view more details.</p>
  `;

	return send_email({
		to: parent_email,
		subject: `New Grade Posted for ${student_name}`,
		html,
	});
}

/**
 * Send payment reminder email
 */
export async function send_payment_reminder_email(
	parent_email: string,
	student_name: string,
	amount_due: number,
	due_date: string,
): Promise<{ success: boolean; message?: string }> {
	const html = `
    <h1>Payment Reminder</h1>
    <p>This is a reminder about an outstanding payment for ${student_name}:</p>
    <ul>
      <li><strong>Amount Due:</strong> ${amount_due} SLL</li>
      <li><strong>Due Date:</strong> ${due_date}</li>
    </ul>
    <p>Please make the payment at your earliest convenience.</p>
  `;

	return send_email({
		to: parent_email,
		subject: `Payment Reminder - ${student_name}`,
		html,
	});
}
