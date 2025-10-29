/**
 * SSE Notifications Client
 * Manages Server-Sent Events connection for real-time notifications
 */

export interface Notification {
	id: string;
	title: string;
	message: string;
	notification_type: string;
	link: string | null;
	created_at: string;
}

export interface NotificationEvent {
	type: "connected" | "notification" | "heartbeat";
	message?: string;
	data?: Notification;
	timestamp?: number;
}

class SSENotifications {
	private event_source: EventSource | null = $state(null);
	private reconnect_timeout: number | null = $state(null);
	private reconnect_attempts = $state(0);
	private max_reconnect_attempts = 5;

	public notifications = $state<Notification[]>([]);
	public unread_count = $state(0);
	public connected = $state(false);

	/**
	 * Connect to SSE notifications stream
	 */
	connect(school_id: string) {
		if (this.event_source) {
			console.warn("SSE already connected");
			return;
		}

		const url = `/${school_id}/notifications/stream`;
		this.event_source = new EventSource(url);

		this.event_source.onopen = () => {
			console.log("SSE connection established");
			this.connected = true;
			this.reconnect_attempts = 0;
		};

		this.event_source.onmessage = (event) => {
			try {
				const message: NotificationEvent = JSON.parse(event.data);

				switch (message.type) {
					case "connected":
						console.log("SSE:", message.message);
						break;

					case "notification":
						if (message.data) {
							// Add notification to the list if not already present
							const exists = this.notifications.some(
								(n) => n.id === message.data!.id,
							);
							if (!exists) {
								this.notifications = [message.data, ...this.notifications];
								this.unread_count++;

								// Show browser notification if permitted
								this.show_browser_notification(message.data);
							}
						}
						break;

					case "heartbeat":
						// Connection is alive
						break;
				}
			} catch (error) {
				console.error("Error parsing SSE message:", error);
			}
		};

		this.event_source.onerror = (error) => {
			console.error("SSE error:", error);
			this.connected = false;

			// Attempt to reconnect
			if (this.event_source) {
				this.event_source.close();
				this.event_source = null;
			}

			this.attempt_reconnect(school_id);
		};
	}

	/**
	 * Attempt to reconnect to SSE stream
	 */
	private attempt_reconnect(school_id: string) {
		if (this.reconnect_attempts >= this.max_reconnect_attempts) {
			console.error("Max reconnection attempts reached");
			return;
		}

		this.reconnect_attempts++;
		const delay = Math.min(1000 * Math.pow(2, this.reconnect_attempts), 30000);

		console.log(
			`Attempting to reconnect in ${delay}ms (attempt ${this.reconnect_attempts})`,
		);

		this.reconnect_timeout = window.setTimeout(() => {
			this.connect(school_id);
		}, delay);
	}

	/**
	 * Disconnect from SSE stream
	 */
	disconnect() {
		if (this.reconnect_timeout) {
			clearTimeout(this.reconnect_timeout);
			this.reconnect_timeout = null;
		}

		if (this.event_source) {
			this.event_source.close();
			this.event_source = null;
		}

		this.connected = false;
	}

	/**
	 * Mark a notification as read
	 */
	mark_as_read(notification_id: string) {
		this.notifications = this.notifications.filter((n) => n.id !== notification_id);
		this.unread_count = Math.max(0, this.unread_count - 1);
	}

	/**
	 * Mark all notifications as read
	 */
	mark_all_as_read() {
		this.notifications = [];
		this.unread_count = 0;
	}

	/**
	 * Show browser notification (requires permission)
	 */
	private show_browser_notification(notification: Notification) {
		if ("Notification" in window && Notification.permission === "granted") {
			new Notification(notification.title, {
				body: notification.message,
				icon: "/favicon.png",
				tag: notification.id,
			});
		}
	}

	/**
	 * Request browser notification permission
	 */
	async request_permission() {
		if ("Notification" in window) {
			const permission = await Notification.requestPermission();
			return permission === "granted";
		}
		return false;
	}
}

// Singleton instance
export const sse_notifications = new SSENotifications();
