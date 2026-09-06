import type { Mock } from "vitest";

/**
 * Chrome extension APIs are overloaded with both a promise-based signature
 * and a legacy callback-based signature. `vi.spyOn` resolves the mock's
 * argument/return types from the *last* overload declared in @types/chrome,
 * which is the callback (void-returning) signature, not the promise one
 * actually used at runtime. This helper re-types such a spy to its
 * promise-based signature so `mockResolvedValue`/`mockResolvedValueOnce`
 * etc. type-check against the real return value.
 */
export const asAsyncSpy = <TArgs extends unknown[], TReturn>(
  spy: unknown,
): Mock<(...args: TArgs) => Promise<TReturn>> =>
  spy as Mock<(...args: TArgs) => Promise<TReturn>>;
