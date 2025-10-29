/**
 * Student Authentication Utilities
 * Handles student login, session management, and authorization
 */

import { getRequestEvent } from "$app/server";
import { redirect } from "@sveltejs/kit";
import jwt from "jsonwebtoken";
import { config } from "./config";

export interface StudentSession {
	id: string;
	admission_number: string;
	first_name: string;
	last_name: string;
	class_id: string;
	school_id: string;
	email?: string;
}

/**
 * Get current authenticated student from session
 */
export function get_current_student(): StudentSession | null {
	const { cookies } = getRequestEvent();
	const token = cookies.get("student_token");

	if (!token) return null;

	try {
		const decoded = jwt.verify(token, config.JWT_SECRET) as StudentSession;
		return decoded;
	} catch (error) {
		console.error("Student JWT verification failed:", error);
		return null;
	}
}

/**
 * Set student authentication token
 */
export function set_student_token(token: string) {
	const { cookies } = getRequestEvent();
	cookies.set("student_token", token, {
		path: "/",
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	});
}

/**
 * Clear student authentication token
 */
export function clear_student_token() {
	const { cookies } = getRequestEvent();
	cookies.delete("student_token", { path: "/" });
}

/**
 * Require student authentication
 * Redirects to student login if not authenticated
 */
export function require_student_auth(): StudentSession {
	const student = get_current_student();
	if (!student) {
		redirect(302, "/student/login");
	}
	return student;
}

/**
 * Check if student belongs to a specific school
 */
export function check_student_school(student: StudentSession, school_id: string): boolean {
	return student.school_id === school_id;
}

/**
 * Ensure student can only access their own school's data
 */
export function ensure_student_school(student: StudentSession, school_id: string) {
	if (!check_student_school(student, school_id)) {
		redirect(308, "/student/unauthorized");
	}
}

/**
 * Check if student can access specific resource
 * Students can only access their own data
 */
export function can_student_access_resource(
	student: StudentSession,
	resource_student_id: string,
): boolean {
	return student.id === resource_student_id;
}
