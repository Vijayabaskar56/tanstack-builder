import { describe, expect, it, vi, beforeEach } from "vitest";
import { HeaderRateLimiter } from "@/lib/header-rate-limiter";

describe("HeaderRateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1000000); // Set fixed time for deterministic tests
  });

  const createMockRequest = (lastRequestTime?: number) => {
    return {
      headers: {
        get: (key: string) => {
          if (key === "X-Last-Request-Time" && lastRequestTime !== undefined) {
            return lastRequestTime.toString();
          }
          return null;
        },
      },
    } as Request;
  };

  it("should allow first request (no last time header)", () => {
    const limiter = new HeaderRateLimiter(3, 60 * 60 * 1000); // 3 per hour, min interval ~20 minutes
    const request = createMockRequest(); // No header

    const result = limiter.check(request);

    expect(result.allowed).toBe(true);
    expect(result.info.limit).toBe(3);
    expect(result.info.remaining).toBe(2);
  });

  it("should allow request if enough time has passed", () => {
    const limiter = new HeaderRateLimiter(3, 60 * 60 * 1000); // min interval 20 minutes
    const lastTime = 1000000 - 21 * 60 * 1000; // 21 minutes ago
    const request = createMockRequest(lastTime);

    const result = limiter.check(request);

    expect(result.allowed).toBe(true);
    expect(result.info.remaining).toBe(2);
  });

  it("should deny request if not enough time has passed", () => {
    const limiter = new HeaderRateLimiter(3, 60 * 60 * 1000); // min interval 20 minutes
    const lastTime = 1000000 - 10 * 60 * 1000; // 10 minutes ago
    const request = createMockRequest(lastTime);

    const result = limiter.check(request);

    expect(result.allowed).toBe(false);
    expect(result.info.remaining).toBe(0);
    expect(result.info.retryAfter).toBe(1200); // 20 minutes in seconds
  });

  it("should return correct headers", () => {
    const limiter = new HeaderRateLimiter(5, 60 * 60 * 1000);
    const info = {
      limit: 5,
      remaining: 3,
      reset: 1638360000,
      retryAfter: undefined,
    };

    const headers = limiter.getHeaders(info);

    expect(headers["X-RateLimit-Limit"]).toBe("5");
    expect(headers["X-RateLimit-Remaining"]).toBe("3");
    expect(headers["X-RateLimit-Reset"]).toBe("1638360000");
    expect(headers["Retry-After"]).toBeUndefined();
  });

  it("should include Retry-After when rate limited", () => {
    const limiter = new HeaderRateLimiter(3, 60 * 60 * 1000);
    const info = {
      limit: 3,
      remaining: 0,
      reset: 1638360000,
      retryAfter: 3600,
    };

    const headers = limiter.getHeaders(info);

    expect(headers["Retry-After"]).toBe("3600");
  });
});