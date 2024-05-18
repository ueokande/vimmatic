/**
 * @vitest-environment jsdom
 */

import HTMLElementLocator from "../../../src/content/presenters/HTMLElementLocator";
import { describe, beforeEach, test, expect } from "vitest";

describe("HTMLElementLocator", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="container"><ul>
    <li><a href="#" id="link">Link</a></li>
    <li><input type="text" id="input" /></li>
    <li><button id="button">Button</button></li>
    </ul></div>`;
  });

  test("getElement", () => {
    const sut = new HTMLElementLocator("a,input,button", window.document);
    const elements: Record<string, HTMLElement> = sut.getAllElements();

    expect(Object.keys(elements).length).toBe(3);

    const link = Object.entries(elements).find(
      ([_id, element]) => element.tagName === "A",
    );
    const input = Object.entries(elements).find(
      ([_id, element]) => element.tagName === "INPUT",
    );
    const button = Object.entries(elements).find(
      ([_id, element]) => element.tagName === "BUTTON",
    );
    expect(link).not.toBeUndefined();
    expect(input).not.toBeUndefined();
    expect(button).not.toBeUndefined();

    expect(link![1].id).toBe("link");
    expect(input![1].id).toBe("input");
    expect(button![1].id).toBe("button");

    expect(sut.getElement(link![0])).toBe(link![1]);
    expect(sut.getElement(input![0])).toBe(input![1]);
    expect(sut.getElement(button![0])).toBe(button![1]);
  });
});
