/**
 * @vitest-environment jsdom
 */

import type React from "react";
import { renderHook, act } from "@testing-library/react";
import { useCompletionKeyBinds } from "../../../../src/console/completion/hooks/useCompletionKeyBinds";
import { describe, beforeEach, it, vi, expect } from "vitest";

const mockKeyEvent = ({
  key,
  ctrlKey = false,
  shiftKey = false,
}: {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}): React.KeyboardEvent => {
  return {
    key,
    ctrlKey,
    shiftKey,
    stopPropagation: () => {},
    preventDefault: () => {},
  } as React.KeyboardEvent;
};

describe("useCompletionKeyBinds", () => {
  const onEnter = vi.fn();
  const onNext = vi.fn();
  const onPrev = vi.fn();
  const onCancel = vi.fn();
  const { result } = renderHook(() =>
    useCompletionKeyBinds({ onEnter, onNext, onPrev, onCancel }),
  );

  beforeEach(() => {
    onEnter.mockClear();
    onNext.mockClear();
    onPrev.mockClear();
    onCancel.mockClear();
  });

  describe("cancel", () => {
    it.each([
      { name: "Esc", event: mockKeyEvent({ key: "Escape" }) },
      { name: "Ctrl+[", event: mockKeyEvent({ key: "[", ctrlKey: true }) },
      { name: "Ctrl+c", event: mockKeyEvent({ key: "c", ctrlKey: true }) },
    ])("calls cancel by $name", ({ event }) => {
      act(() => {
        result.current(mockKeyEvent(event));
      });
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("next", () => {
    it.each([
      { name: "Tab", event: mockKeyEvent({ key: "Tab" }) },
      { name: "Ctrl+n", event: mockKeyEvent({ key: "n", ctrlKey: true }) },
    ])("calls cancel by $name", ({ event }) => {
      act(() => {
        result.current(mockKeyEvent(event));
      });
      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("prev", () => {
    it.each([
      { name: "Tab", event: mockKeyEvent({ key: "Tab", shiftKey: true }) },
      { name: "Ctrl+p", event: mockKeyEvent({ key: "p", ctrlKey: true }) },
    ])("calls cancel by $name", ({ event }) => {
      act(() => {
        result.current(mockKeyEvent(event));
      });
      expect(onPrev).toHaveBeenCalledTimes(1);
    });
  });

  describe("prev", () => {
    it.each([
      { name: "Enter", event: mockKeyEvent({ key: "Enter" }) },
      { name: "Ctrl+m", event: mockKeyEvent({ key: "m", ctrlKey: true }) },
    ])("calls cancel by $name", ({ event }) => {
      act(() => {
        result.current(mockKeyEvent(event));
      });
      expect(onEnter).toHaveBeenCalledTimes(1);
    });
  });
});
