/**
 * In-memory rate limiter for authentication endpoints
 * Tracks login attempts by IP address or identifier
 */

interface RateLimitEntry {
	count: number;
	first_attempt: number;
	blocked_until?: number;
}

const rate_limit_store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 15 minutes
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of rate_limit_store.entries()) {
			// Remove entries older than 1 hour
			if (now - entry.first_attempt > 60 * 60 * 1000) {
				rate_limit_store.delete(key);
			}
		}
	},
	15 * 60 * 1000,
);

export interface RateLimitConfig {
	/** Maximum number of attempts allowed */
	max_attempts: number;
	/** Time window in milliseconds */
	window_ms: number;
	/** Block duration in milliseconds after exceeding limit */
	block_duration_ms: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
	max_attempts: 5,
	window_ms: 15 * 60 * 1000, // 15 minutes
	block_duration_ms: 30 * 60 * 1000, // 30 minutes
};

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, email)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and retry information
 */
export function check_rate_limit(
	identifier: string,
	config: RateLimitConfig = DEFAULT_CONFIG,
): {
	allowed: boolean;
	remaining: number;
	reset_at?: Date;
	blocked_until?: Date;
} {
	const now = Date.now();
	const entry = rate_limit_store.get(identifier);

	// Check if currently blocked
	if (entry?.blocked_until && now < entry.blocked_until) {
		return {
			allowed: false,
			remaining: 0,
			blocked_until: new Date(entry.blocked_until),
		};
	}

	// No previous attempts or window expired
	if (!entry || now - entry.first_attempt > config.window_ms) {
		rate_limit_store.set(identifier, {
			count: 1,
			first_attempt: now,
		});
		return {
			allowed: true,
			remaining: config.max_attempts - 1,
			reset_at: new Date(now + config.window_ms),
		};
	}

	// Increment attempt count
	entry.count++;

	// Check if limit exceeded
	if (entry.count > config.max_attempts) {
		entry.blocked_until = now + config.block_duration_ms;
		rate_limit_store.set(identifier, entry);

		return {
			allowed: false,
			remaining: 0,
			blocked_until: new Date(entry.blocked_until),
		};
	}

	// Update entry
	rate_limit_store.set(identifier, entry);

	return {
		allowed: true,
		remaining: config.max_attempts - entry.count,
		reset_at: new Date(entry.first_attempt + config.window_ms),
	};
}

/**
 * Reset rate limit for an identifier (e.g., after successful login)
 */
export function reset_rate_limit(identifier: string): void {
	rate_limit_store.delete(identifier);
}

/**
 * Get rate limit status without incrementing
 */
export function get_rate_limit_status(
	identifier: string,
	config: RateLimitConfig = DEFAULT_CONFIG,
): {
	remaining: number;
	blocked: boolean;
	blocked_until?: Date;
} {
	const now = Date.now();
	const entry = rate_limit_store.get(identifier);

	if (!entry) {
		return {
			remaining: config.max_attempts,
			blocked: false,
		};
	}

	if (entry.blocked_until && now < entry.blocked_until) {
		return {
			remaining: 0,
			blocked: true,
			blocked_until: new Date(entry.blocked_until),
		};
	}

	if (now - entry.first_attempt > config.window_ms) {
		return {
			remaining: config.max_attempts,
			blocked: false,
		};
	}

	return {
		remaining: Math.max(0, config.max_attempts - entry.count),
		blocked: false,
	};
}
