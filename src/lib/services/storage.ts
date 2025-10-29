/**
 * Cloud storage service using Cloudinary
 * Handles file uploads, image optimization, and CDN delivery
 */

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
if (
	process.env.CLOUDINARY_CLOUD_NAME &&
	process.env.CLOUDINARY_API_KEY &&
	process.env.CLOUDINARY_API_SECRET
) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
}

/**
 * Upload file to Cloudinary
 * @param file_path - Local file path or buffer
 * @param folder - Cloudinary folder name
 * @param resource_type - Type of resource (image, video, raw, auto)
 * @returns Cloudinary URL and public_id
 */
export async function upload_file(
	file_path: string | Buffer,
	folder = "caelum",
	resource_type: "image" | "video" | "raw" | "auto" = "auto",
): Promise<{
	success: boolean;
	url?: string;
	public_id?: string;
	message?: string;
}> {
	if (!process.env.CLOUDINARY_CLOUD_NAME) {
		console.warn("Cloudinary not configured. Using local storage.");
		return { success: false, message: "Cloud storage not configured" };
	}

	try {
		const result = await cloudinary.uploader.upload(
			typeof file_path === "string" ? file_path : `data:image/png;base64,${file_path.toString("base64")}`,
			{
				folder,
				resource_type,
				// Automatically optimize images
				...(resource_type === "image" && {
					quality: "auto",
					fetch_format: "auto",
				}),
			},
		);

		return {
			success: true,
			url: result.secure_url,
			public_id: result.public_id,
		};
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		return { success: false, message: "Failed to upload file" };
	}
}

/**
 * Delete file from Cloudinary
 */
export async function delete_file(
	public_id: string,
	resource_type: "image" | "video" | "raw" = "image",
): Promise<{ success: boolean; message?: string }> {
	if (!process.env.CLOUDINARY_CLOUD_NAME) {
		return { success: false, message: "Cloud storage not configured" };
	}

	try {
		await cloudinary.uploader.destroy(public_id, { resource_type });
		return { success: true };
	} catch (error) {
		console.error("Cloudinary delete error:", error);
		return { success: false, message: "Failed to delete file" };
	}
}

/**
 * Upload avatar image with optimization
 */
export async function upload_avatar(
	file_path: string | Buffer,
	user_id: string,
): Promise<{
	success: boolean;
	url?: string;
	public_id?: string;
	message?: string;
}> {
	return upload_file(file_path, `caelum/avatars/${user_id}`, "image");
}

/**
 * Upload school logo with optimization
 */
export async function upload_school_logo(
	file_path: string | Buffer,
	school_id: string,
): Promise<{
	success: boolean;
	url?: string;
	public_id?: string;
	message?: string;
}> {
	return upload_file(file_path, `caelum/logos/${school_id}`, "image");
}

/**
 * Upload assignment file
 */
export async function upload_assignment(
	file_path: string | Buffer,
	school_id: string,
): Promise<{
	success: boolean;
	url?: string;
	public_id?: string;
	message?: string;
}> {
	return upload_file(file_path, `caelum/assignments/${school_id}`, "raw");
}

/**
 * Generate signed URL for private files
 * @param public_id - Cloudinary public ID
 * @param expires_in - Expiration time in seconds (default 1 hour)
 */
export function get_signed_url(
	public_id: string,
	expires_in = 3600,
): string | null {
	if (!process.env.CLOUDINARY_CLOUD_NAME) {
		return null;
	}

	try {
		const timestamp = Math.round(Date.now() / 1000) + expires_in;
		return cloudinary.url(public_id, {
			sign_url: true,
			type: "authenticated",
			expires_at: timestamp,
		});
	} catch (error) {
		console.error("Failed to generate signed URL:", error);
		return null;
	}
}

/**
 * Get optimized image URL with transformations
 */
export function get_optimized_image_url(
	public_id: string,
	options?: {
		width?: number;
		height?: number;
		crop?: "fill" | "fit" | "scale" | "crop";
		quality?: "auto" | number;
	},
): string | null {
	if (!process.env.CLOUDINARY_CLOUD_NAME) {
		return null;
	}

	return cloudinary.url(public_id, {
		transformation: [
			{
				width: options?.width,
				height: options?.height,
				crop: options?.crop || "fill",
				quality: options?.quality || "auto",
				fetch_format: "auto",
			},
		],
	});
}
