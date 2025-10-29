/**
 * Student Authentication Remote Functions
 * Handles student login and logout
 */

import { form } from "@modular-forms/svelte-remote";
import * as v from "valibot";
import { getRequestEvent } from "$app/server";
import { redirect } from "@sveltejs/kit";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { database } from "$lib/server/database/queries";
import { config } from "$lib/config";
import { set_student_token, clear_student_token } from "$lib/student-auth";
import { check_rate_limit, reset_rate_limit } from "$lib/rate-limit";

/**
 * Student login with admission number and password
 */
export const login = form(
	v.object({
		admission_number: v.pipe(
			v.string("Admission number is required"),
			v.minLength(1, "Admission number is required"),
		),
		password: v.pipe(
			v.string("Password is required"),
			v.minLength(1, "Password is required"),
		),
	}),
	async (parsed) => {
		// Get client IP for rate limiting
		const { request } = getRequestEvent();
		const client_ip =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("x-real-ip") ||
			"unknown";

		// Check rate limit
		const rate_limit = check_rate_limit(`student_${client_ip}`);
		if (!rate_limit.allowed) {
			const minutes_until_reset = rate_limit.blocked_until
				? Math.ceil(
						(rate_limit.blocked_until.getTime() - Date.now()) /
							1000 /
							60,
					)
				: 30;
			return {
				message: `Too many login attempts. Please try again in ${minutes_until_reset} minutes.`,
			};
		}

		// Find student by admission number
		const student_result = await database.get_student_by_admission_number(
			parsed.admission_number,
		);

		if (!student_result.success || !student_result.data) {
			return { message: "Invalid admission number or password" };
		}

		const student = student_result.data;

		// Check if student has a password set
		if (!student.password) {
			return {
				message: "Your account has not been activated. Please contact your school administrator.",
			};
		}

		// Verify password
		const password_valid = await compare(parsed.password, student.password);
		if (!password_valid) {
			return { message: "Invalid admission number or password" };
		}

		// Reset rate limit on successful login
		reset_rate_limit(`student_${client_ip}`);

		// Get class info for the token
		const class_result = await database.get_class(student.class_id);
		const class_name =
			class_result.success && class_result.data
				? class_result.data.name
				: "Unknown";

		// Create JWT token
		const token = jwt.sign(
			{
				id: student.id,
				admission_number: student.admission_number,
				first_name: student.first_name,
				last_name: student.last_name,
				class_id: student.class_id,
				school_id: student.school_id,
				email: student.email || undefined,
			},
			config.JWT_SECRET,
			{ expiresIn: "7d" }, // Students get 7 days token validity
		);

		// Set token in cookie
		set_student_token(token);

		// Redirect to student portal
		redirect(302, `/student/portal/${student.school_id}`);
	},
);

/**
 * Student logout
 */
export const logout = form(v.object({}), async () => {
	clear_student_token();
	redirect(302, "/student/login");
});
