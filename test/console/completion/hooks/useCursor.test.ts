import { renderHook, act } from "@testing-library/react-hooks";
import useCursor from "../../../../src/console/completion/hooks/useCursor";
import { describe, it, expect } from "vitest";

describe("useCursor", () => {
  describe("positive itemCount", () => {
    it("has -1 as a default", () => {
      const { result } = renderHook(() => useCursor(3));
      expect(result.current.select).toBe(-1);
    });

    it("increments select", () => {
      const { result } = renderHook(() => useCursor(3));

      act(() => result.current.next());
      expect(result.current.select).toBe(0);

      act(() => result.current.next());
      expect(result.current.select).toBe(1);

      act(() => result.current.next());
      expect(result.current.select).toBe(2);

      act(() => result.current.next());
      expect(result.current.select).toBe(-1);
    });

    it("decrements select", () => {
      const { result } = renderHook(() => useCursor(3));

      act(() => result.current.prev());
      expect(result.current.select).toBe(2);

      act(() => result.current.prev());
      expect(result.current.select).toBe(1);

      act(() => result.current.prev());
      expect(result.current.select).toBe(0);

      act(() => result.current.prev());
      expect(result.current.select).toBe(-1);
    });

    it("resets select", () => {
      const { result } = renderHook(() => useCursor(3));

      act(() => result.current.prev());
      act(() => result.current.prev());
      act(() => result.current.reset());

      expect(result.current.select).toBe(-1);
    });
  });

  describe("zero itemCount", () => {
    it("has -1 as a default", () => {
      const { result } = renderHook(() => useCursor(0));
      expect(result.current.select).toBe(-1);
    });

    it("cannot increment and decrement select", () => {
      const { result } = renderHook(() => useCursor(0));

      act(() => result.current.next());
      expect(result.current.select).toBe(-1);

      act(() => result.current.prev());
      expect(result.current.select).toBe(-1);
    });
  });

  describe("negative itemCount", () => {
    it("throws an error", () => {
      expect(() => useCursor(-1)).toThrow(TypeError);
    });
  });
});
