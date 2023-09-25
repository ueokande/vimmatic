import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import useCompletionKeyBinds from "../../../../src/console/completion/hooks/useCompletionKeyBinds";

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
  const onEnter = jest.fn();
  const onNext = jest.fn();
  const onPrev = jest.fn();
  const onCancel = jest.fn();
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
      expect(onCancel).toBeCalledTimes(1);
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
      expect(onNext).toBeCalledTimes(1);
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
      expect(onPrev).toBeCalledTimes(1);
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
      expect(onEnter).toBeCalledTimes(1);
    });
  });
});
