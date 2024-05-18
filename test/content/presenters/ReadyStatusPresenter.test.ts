/**
 * @vitest-environment jsdom
 */

import { ReadyStatusPresenterImpl } from "../../../src/content/presenters/ReadyStatusPresenter";
import { describe, test, expect } from "vitest";

describe("ReadyStatusPresenterImpl", () => {
  test("sets ready status of the content script", () => {
    const sut = new ReadyStatusPresenterImpl();
    sut.setContentReady();
    expect(document.head.getAttribute("data-vimmatic-content-status")).toBe(
      "ready",
    );
  });

  test("sets ready status of the console", () => {
    const sut = new ReadyStatusPresenterImpl();
    sut.setConsoleReady();
    expect(document.head.getAttribute("data-vimmatic-console-status")).toBe(
      "ready",
    );
  });
});
