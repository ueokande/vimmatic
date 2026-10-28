/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConsoleFramePresenterImpl } from "../../../src/content/presenters/ConsoleFramePresenter";
import { ConsoleFrameUseCase } from "../../../src/content/usecases/ConsoleFrameUseCase";

const setup = () => {
  const frame = document.createElement("iframe");
  frame.id = "vimmatic-console-frame";
  frame.style.height = "40px";
  document.body.append(frame);
  const sut = new ConsoleFrameUseCase(new ConsoleFramePresenterImpl(), {
    setContentReady: vi.fn(),
    setConsoleReady: vi.fn(),
  });
  return { frame, sut };
};
afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

describe("console host focus", () => {
  it.each([true, false])(
    "closing a console blurs its iframe without activating its window (%s)",
    (focused) => {
      const { frame, sut } = setup();
      vi.spyOn(document, "hasFocus").mockReturnValue(focused);
      const focus = vi.spyOn(window, "focus").mockImplementation(() => {});
      sut.unfocus();
      expect(frame.style.height).toBe("0px");
      expect(focus).not.toHaveBeenCalled();
    },
  );
});
