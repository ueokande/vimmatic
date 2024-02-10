/**
 * @jest-environment jsdom
 */

import { HintPresenterImpl } from "../../../src/content/presenters/HintPresenter";
import MockSettingsRepository from "../mock/MockSettingRepository";

describe("HintPresenterImpl", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="container"><ul>
      <li><a href="#" id="link">Link</a></li>
      <li><input type="text" id="input" /></li>
      <li><button id="button">Button</button></li>
    </ul></div>`;

    // HintPresenterImpl checks if the element is visible by the offsetHeight.
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetWidth: {
        get() {
          return 10;
        },
      },
      offsetHeight: {
        get() {
          return 10;
        },
      },
    });
  });

  test("should assign tags to hints and clear them", () => {
    const settingsRepository = new MockSettingsRepository();
    const sut = new HintPresenterImpl(settingsRepository);
    const viewSize = { width: 100, height: 100 };
    const framePosition = { x: 0, y: 0 };

    const targets = sut.lookupTargets(
      "a,input,button",
      viewSize,
      framePosition,
    );
    expect(targets.length).toBe(3);

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
});
