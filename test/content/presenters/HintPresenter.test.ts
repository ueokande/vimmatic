/**
 * @vitest-environment jsdom
 */

import { HintPresenterImpl } from "../../../src/content/presenters/HintPresenter";
import { MockSettingRepository } from "../mock/MockSettingRepository";
import { describe, beforeEach, test, expect, vi } from "vitest";

describe("HintPresenterImpl", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="container"><ul>
      <li><a href="#" id="link">Link</a></li>
      <li><input type="text" id="input" /></li>
      <li><button id="button">Button</button></li>
    </ul></div>`;

    // HintPresenterImpl checks if the element is visible by the offsetHeight.
    vi.spyOn(
      window.HTMLElement.prototype,
      "offsetWidth",
      "get",
    ).mockReturnValue(10);
    vi.spyOn(
      window.HTMLElement.prototype,
      "offsetHeight",
      "get",
    ).mockReturnValue(10);
    vi.spyOn(
      window.HTMLElement.prototype,
      "getBoundingClientRect",
    ).mockImplementation(function (this: HTMLElement) {
      let y = NaN;
      if (this.id === "link") {
        y = 0;
      } else if (this.id === "input") {
        y = 10;
      } else if (this.id === "button") {
        y = 20;
      }
      return {
        bottom: y + 10,
        height: 10,
        left: 0,
        right: 300,
        top: y,
        width: 300,
        x: 0,
        y,
        toJSON: () => {},
      };
    });
    vi.spyOn(document, "elementFromPoint").mockImplementation((_x, y) => {
      if (0 <= y && y < 10) {
        return document.getElementById("link");
      } else if (10 <= y && y < 20) {
        return document.getElementById("input");
      } else if (20 <= y && y < 30) {
        return document.getElementById("button");
      }
      return null;
    });
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(
      300,
    );
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(
      100,
    );
  });

  const settingsRepository = new MockSettingRepository();
  const sut = new HintPresenterImpl(settingsRepository);

  test("should assign tags to hints and clear them", () => {
    const viewSize = { width: 100, height: 100 };
    const framePosition = { x: 0, y: 0 };

    const targets = sut.lookupTargets(
      "a,input,button",
      viewSize,
      framePosition,
    );
    expect(targets).toHaveLength(3);

    sut.assignTags({
      [targets[0]]: "a",
      [targets[1]]: "b",
      [targets[2]]: "c",
    });

    expect(document.querySelectorAll("[data-vimmatic-hint]").length).toBe(3);

    const hint1 = sut.getHint(targets[0]);
    const hint2 = sut.getHint(targets[1]);
    const hint3 = sut.getHint(targets[2]);

    expect(hint1?.getElementId()).toBe(targets[0]);
    expect(hint2?.getElementId()).toBe(targets[1]);
    expect(hint3?.getElementId()).toBe(targets[2]);

    expect(hint1?.getTag()).toBe("a");
    expect(hint2?.getTag()).toBe("b");
    expect(hint3?.getTag()).toBe("c");

    sut.clearHints();

    expect(document.querySelectorAll("[data-vimmatic-hint]").length).toBe(0);
  });

  test("should skip out-of-view elements", () => {
    const viewSize = { width: 100, height: 15 };
    const framePosition = { x: 0, y: 0 };

    const targets = sut.lookupTargets(
      "a,input,button",
      viewSize,
      framePosition,
    );

    expect(targets).toHaveLength(2);
  });
});
