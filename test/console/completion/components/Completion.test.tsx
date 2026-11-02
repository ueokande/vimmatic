/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Completion } from "../../../../src/console/completion/components/Completion";
import type { Completions } from "../../../../src/shared/completions";

const candidates: Completions = [
  {
    name: "Console Command",
    items: ["buffer", "bdelete", "bdeletes"].map((value) => ({
      primary: value,
      value,
    })),
  },
];

describe("Completion interaction", () => {
  const setup = (completions = candidates) => {
    const onInputChange = vi.fn();
    const onInputEnter = vi.fn();
    const view = (items: Completions) => (
      <Completion
        defaultValue="b"
        maxLineHeight={20}
        completions={items}
        onInputChange={onInputChange}
        onInputEnter={onInputEnter}
        renderInput={(attrs) => <input aria-label="Command" {...attrs} />}
      />
    );
    const { rerender } = render(view(completions));
    return {
      input: screen.getByRole("textbox") as HTMLInputElement,
      update: (items: Completions) => rerender(view(items)),
      onInputChange,
      onInputEnter,
    };
  };

  it("cycles forward, restores the source, and cycles backward", () => {
    const { input, onInputEnter } = setup();
    for (const value of ["buffer", "bdelete", "bdeletes", "b"]) {
      fireEvent.keyDown(input, { key: "Tab" });
      expect(input.value).toBe(value);
      if (value !== "b") {
        expect(
          screen.getByRole("menuitem", { current: true }).textContent,
        ).toBe(value);
      } else {
        expect(screen.queryByRole("menuitem", { current: true })).toBeNull();
      }
    }
    fireEvent.keyDown(input, { key: "Tab", shiftKey: true });
    expect(input.value).toBe("bdeletes");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onInputEnter).toHaveBeenCalledWith("bdeletes");
  });

  it.each([false, true])(
    "queues Tab during an asynchronous update (backward=%s)",
    (shiftKey) => {
      const { input, update, onInputChange } = setup();
      fireEvent.change(input, { target: { value: "bd" } });
      expect(onInputChange).toHaveBeenCalledWith("bd");
      fireEvent.keyDown(input, { key: "Tab", shiftKey });
      expect(input.value).toBe("bd");
      update([
        { name: "Console Command", items: candidates[0].items.slice(1) },
      ]);
      const expected = shiftKey ? "bdeletes" : "bdelete";
      expect(input.value).toBe(expected);
      expect(screen.getByRole("menuitem", { current: true }).textContent).toBe(
        expected,
      );
    },
  );

  it("resets selection when candidates change without input", () => {
    const { input, update } = setup();
    fireEvent.keyDown(input, { key: "Tab" });
    update([
      {
        name: "Console Command",
        items: [{ primary: "buffer", value: "buffer" }],
      },
    ]);
    expect(input.value).toBe("b");
    expect(screen.queryByRole("menuitem", { current: true })).toBeNull();
  });

  it("keeps source input when an asynchronous result is empty", () => {
    const { input, update, onInputEnter } = setup();
    fireEvent.change(input, { target: { value: "unknown" } });
    fireEvent.keyDown(input, { key: "Tab" });
    update([]);
    expect(input.value).toBe("unknown");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onInputEnter).toHaveBeenCalledWith("unknown");
  });

  it("blurs the input on Escape", () => {
    const { input } = setup();
    input.focus();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(document.activeElement).not.toBe(input);
  });
});
