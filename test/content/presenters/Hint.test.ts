/**
 * @jest-environment jsdom
 */

import Hint from "../../../src/content/presenters/Hint";
import { describe, beforeEach, it, expect } from "vitest";

describe("Hint", () => {
  beforeEach(() => {
    document.body.innerHTML = `<a id='test-link' href='#'>link</a>`;
  });

  describe("#constructor", () => {
    it("creates a hint element with tag name", () => {
      const link = document.getElementById("test-link")!;
      new Hint({ element: link, id: "0", tag: "abc", style: {} });

      const elem = document.querySelector("span");
      expect(elem!.textContent!.trim()).toEqual("abc");
    });

    it("sets reserved styles", () => {
      const link = document.getElementById("test-link")!;
      new Hint({
        element: link,
        id: "0",
        tag: "abc",
        style: { position: "relative" },
      });

      const elem = document.querySelector("span") as HTMLElement;
      expect(elem.style.position).toEqual("absolute");
    });
  });

  describe("#show", () => {
    it("shows an element", () => {
      const link = document.getElementById("test-link")!;
      const hint = new Hint({ element: link, id: "0", tag: "abc", style: {} });
      hint.hide();
      hint.show();

      const elem = document.querySelector("span") as HTMLElement;
      expect(elem.style.display).not.toEqual("none");
    });
  });

  describe("#hide", () => {
    it("hides an element", () => {
      const link = document.getElementById("test-link") as HTMLElement;
      const hint = new Hint({ element: link, id: "0", tag: "abc", style: {} });
      hint.hide();

      const elem = document.querySelector("span") as HTMLElement;
      expect(elem.style.display).toEqual("none");
    });
  });

  describe("#remove", () => {
    it("removes an element", () => {
      const link = document.getElementById("test-link")!;
      const hint = new Hint({ element: link, id: "0", tag: "abc", style: {} });

      const elem = document.querySelector("span")!;
      expect(elem.parentElement).not.toBeNull;
      hint.remove();
      expect(elem.parentElement).toBeNull;
    });
  });
});
