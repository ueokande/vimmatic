import { setTimeout as observeFor } from "node:timers/promises";
import type { Frame, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const expectScrollUnchanged = async (
  target: Page | Frame,
  action: () => Promise<unknown>,
) => {
  const observer = await target.evaluateHandle(() => {
    const positions = [window.scrollY];
    const onScroll = () => positions.push(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return {
      positions,
      stop: () => window.removeEventListener("scroll", onScroll),
    };
  });
  try {
    await action();
    // A negative assertion needs an observation window: polling for the
    // initial value can pass before the key has been processed.
    await observeFor(500);
    const positions = await observer.evaluate((value) => value.positions);
    expect(positions).toEqual(positions.map(() => positions[0]));
  } finally {
    await observer.evaluate((value) => value.stop());
    await observer.dispose();
  }
};
