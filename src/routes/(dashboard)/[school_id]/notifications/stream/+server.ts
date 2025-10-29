/**
 * SSE (Server-Sent Events) Notifications Stream
 * Provides real-time notification updates to clients
 */

import { get_current_user } from "$lib/auth";
import { database } from "$lib/server/database/queries";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
	const user = get_current_user();

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	// Create a readable stream for SSE
	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();

			// Send initial connection message
			controller.enqueue(
				encoder.encode(
					`data: ${JSON.stringify({ type: "connected", message: "SSE connection established" })}\n\n`,
				),
			);

			// Poll for new notifications every 5 seconds
			const interval = setInterval(async () => {
				try {
					// Get unread notifications
					const result = await database.get_unread_notifications(user.id);

					if (result.success && result.data && result.data.length > 0) {
						// Send each notification
						for (const notification of result.data) {
							const message = {
								type: "notification",
								data: {
									id: notification.id,
									title: notification.title,
									message: notification.message,
									notification_type: notification.type,
									link: notification.link,
									created_at: notification.created_at,
								},
							};

							controller.enqueue(
								encoder.encode(`data: ${JSON.stringify(message)}\n\n`),
							);
						}
					}

					// Send heartbeat to keep connection alive
					controller.enqueue(
						encoder.encode(
							`data: ${JSON.stringify({ type: "heartbeat", timestamp: Date.now() })}\n\n`,
						),
					);
				} catch (error) {
					console.error("Error in SSE stream:", error);
				}
			}, 5000); // Poll every 5 seconds

			// Cleanup when client disconnects
			return () => {
				clearInterval(interval);
			};
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
};
