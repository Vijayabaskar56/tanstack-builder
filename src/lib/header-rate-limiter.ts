// Stateless HTTP header-based rate limiter
// Uses client-provided last request time to enforce rate limits

interface HeaderRateLimitInfo {
	limit: number;
	remaining: number;
	reset: number;
	retryAfter?: number;
}

export class HeaderRateLimiter {
	private limit: number;
	private windowMs: number;

	constructor(limit: number = 3, windowMs: number = 60 * 60 * 1000) {
		this.limit = limit;
		this.windowMs = windowMs;
	}

	/**
	 * Check rate limit using client-provided last request time
	 * Client must send X-Last-Request-Time header with their last request timestamp
	 */
	check(request: Request): { allowed: boolean; info: HeaderRateLimitInfo } {
		const now = Date.now();
		const lastRequestTimeStr = request.headers.get("X-Last-Request-Time");
		const lastRequestTime = lastRequestTimeStr
			? parseInt(lastRequestTimeStr)
			: 0;

		// Minimum interval between requests
		const minInterval = this.windowMs / this.limit;

		// If no last time or enough time has passed, allow
		const allowed = !lastRequestTime || now - lastRequestTime >= minInterval;

		// Calculate remaining requests (simplified, since we don't track count)
		const remaining = allowed ? this.limit - 1 : 0;
		const resetTime = Math.ceil((now + minInterval) / 1000);
		const retryAfter = allowed ? undefined : Math.ceil(minInterval / 1000);

		const info: HeaderRateLimitInfo = {
			limit: this.limit,
			remaining,
			reset: resetTime,
			retryAfter,
		};

		return {
			allowed,
			info,
		};
	}

	/**
	 * Get rate limit headers for the response
	 */
	getHeaders(info: HeaderRateLimitInfo): Record<string, string> {
		const headers: Record<string, string> = {
			"X-RateLimit-Limit": info.limit.toString(),
			"X-RateLimit-Remaining": info.remaining.toString(),
			"X-RateLimit-Reset": info.reset.toString(),
		};

		if (info.retryAfter) {
			headers["Retry-After"] = info.retryAfter.toString();
		}

		return headers;
	}
}

// Create a header-based rate limiter instance: 3 requests per hour
export const headerRateLimiter = new HeaderRateLimiter(3, 60 * 60 * 1000);
