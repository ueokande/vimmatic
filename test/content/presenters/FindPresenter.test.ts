/**
 * @jest-environment jsdom
 */

import {
  getTextGroups,
  TextGroupMap,
  Finder,
} from "../../../src/content/presenters/FindPresenter";
import { describe, beforeAll, beforeEach, it, test, vi, expect } from "vitest";

describe("getTextGroups", () => {
  beforeAll(() => {
    window.getComputedStyle = vi.fn().mockImplementation((node) => {
      if (["BODY", "DIV", "P"].includes(node.nodeName)) {
        return { display: "block" };
      } else {
        return { display: "inline" };
      }
    });
  });

  describe.each([
    ["<div>first</div>", [["first"]]],
    ["<div>first<p>second</p></div>", [["first"], ["second"]]],
    ["<div>first<p>second</p>third</div>", [["first"], ["second"], ["third"]]],
    [
      "<div>first<p>second</p>third<p>fo<i>ur</i>th</p></div>",
      [["first"], ["second"], ["third"], ["fo", "ur", "th"]],
    ],
  ])("when %s", (html, expected) => {
    beforeEach(() => {
      document.body.innerHTML = html;
    });

    test("returns inline groups", () => {
      const root = document.body;
      const groups = getTextGroups(root);
      const texts = groups.map((group) => group.map((e) => e.textContent));
      expect(texts).toEqual(expected);
    });
  });
});

describe("TextGroupMap", () => {
  let textNodes: Array<Text>;

  beforeAll(() => {
    textNodes = [
      document.createTextNode("first"),
      document.createTextNode("second"),
      document.createTextNode(""),
      document.createTextNode("third"),
    ];
  });

  describe("wholeLineText", () => {
    it("returns the whole line text", () => {
      const map = new TextGroupMap(textNodes);
      expect(map.wholeLine).toBe("firstsecondthird");
    });
  });

  describe("anchorAt", () => {
    it("returns the text node and the offset of the given index in the text", () => {
      const map = new TextGroupMap(textNodes);
      expect(map.anchorAt(3)).toEqual({ node: textNodes[0], offset: 3 });
      expect(map.anchorAt(5)).toEqual({ node: textNodes[1], offset: 0 });
      expect(map.anchorAt(11)).toEqual({ node: textNodes[3], offset: 0 });
    });

    it("throws an error when the index is out of range", () => {
      const textNodes = [
        document.createTextNode("first"),
        document.createTextNode("second"),
      ];
      const map = new TextGroupMap(textNodes);
      expect(() => map.anchorAt(11)).toThrow("index out of range");
    });
  });
});

describe("Finder", () => {
  describe("normal search with case sensitive", () => {
    let textNodes: Array<Array<Text>>;

    beforeAll(() => {
      textNodes = [
        ["aba", "bad"],
        ["aBa", "bad"],
      ].map((group) => group.map((t) => document.createTextNode(t)));
    });

    test("findNext returns the range of the occurrence of the given text", () => {
      const finder = new Finder(
        { keyword: "aba", mode: "normal", ignoreCase: false },
        textNodes,
      );
      expect(finder.findNext()).toEqual([
        { node: textNodes[0][0], offset: 0 },
        { node: textNodes[0][0], offset: 2 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[0][0], offset: 2 },
        { node: textNodes[0][1], offset: 1 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[1][0], offset: 2 },
        { node: textNodes[1][1], offset: 1 },
      ]);
    });
  });

  describe("normal search with ignore case", () => {
    let textNodes: Array<Array<Text>>;

    beforeAll(() => {
      textNodes = [
        ["aba", "bad"],
        ["aBa", "bad"],
      ].map((group) => group.map((t) => document.createTextNode(t)));
    });

    test("findNext returns the range of the occurrence of the given text", () => {
      const finder = new Finder(
        { keyword: "aba", mode: "normal", ignoreCase: true },
        textNodes,
      );
      expect(finder.findNext()).toEqual([
        { node: textNodes[0][0], offset: 0 },
        { node: textNodes[0][0], offset: 2 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[0][0], offset: 2 },
        { node: textNodes[0][1], offset: 1 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[1][0], offset: 0 },
        { node: textNodes[1][0], offset: 2 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[1][0], offset: 2 },
        { node: textNodes[1][1], offset: 1 },
      ]);
    });
  });

  describe("regexp with case sensitive", () => {
    let textNodes: Array<Array<Text>>;

    beforeAll(() => {
      textNodes = [
        ["aba", "cad"],
        ["aAa", "ab"],
      ].map((group) => group.map((t) => document.createTextNode(t)));
    });

    test("findNext returns ranges of the occurrences of the given regexp", () => {
      const finder = new Finder(
        { keyword: "a.a", mode: "regexp", ignoreCase: false },
        textNodes,
      );

      expect(finder.findNext()).toEqual([
        { node: textNodes[0][0], offset: 0 },
        { node: textNodes[0][0], offset: 2 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[1][0], offset: 0 },
        { node: textNodes[1][0], offset: 2 },
      ]);
    });
  });

  describe("regexp with ignore case", () => {
    let textNodes: Array<Array<Text>>;

    beforeAll(() => {
      textNodes = [
        ["aba", "cad"],
        ["Aa", "ab"],
      ].map((group) => group.map((t) => document.createTextNode(t)));
    });

    test("findNext returns ranges of the occurrences of the given regexp", () => {
      const finder = new Finder(
        { keyword: "a.a", mode: "regexp", ignoreCase: true },
        textNodes,
      );

      expect(finder.findNext()).toEqual([
        { node: textNodes[0][0], offset: 0 },
        { node: textNodes[0][0], offset: 2 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[1][0], offset: 0 },
        { node: textNodes[1][1], offset: 0 },
      ]);
    });
  });

  describe("navigation", () => {
    let textNodes: Array<Array<Text>>;

    beforeAll(() => {
      textNodes = [
        ["aaaa", "bbb", "", "waaaw"],
        ["bbaa", "a", "aacc"],
        [],
        ["", "yaaay", ""],
      ].map((group) => group.map((t) => document.createTextNode(t)));
    });

    test("findNext returns the range of the occurrence of the given text", () => {
      const finder = new Finder(
        { keyword: "aaa", mode: "normal", ignoreCase: false },
        textNodes,
      );
      expect(finder.findNext()).toEqual([
        { node: textNodes[0][0], offset: 0 },
        { node: textNodes[0][0], offset: 2 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[0][0], offset: 1 },
        { node: textNodes[0][0], offset: 3 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[0][3], offset: 1 },
        { node: textNodes[0][3], offset: 3 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[1][0], offset: 2 },
        { node: textNodes[1][1], offset: 0 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[1][0], offset: 3 },
        { node: textNodes[1][2], offset: 0 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[1][1], offset: 0 },
        { node: textNodes[1][2], offset: 1 },
      ]);
      expect(finder.findNext()).toEqual([
        { node: textNodes[3][1], offset: 1 },
        { node: textNodes[3][1], offset: 3 },
      ]);
      expect(finder.findNext()).toBeUndefined();
    });

    test("findPrev returns the range of the occurrence of the given text", () => {
      const finder = new Finder(
        { keyword: "aaa", mode: "normal", ignoreCase: false },
        textNodes,
      );
      expect(finder.findPrev()).toEqual([
        { node: textNodes[3][1], offset: 1 },
        { node: textNodes[3][1], offset: 3 },
      ]);
      expect(finder.findPrev()).toEqual([
        { node: textNodes[1][1], offset: 0 },
        { node: textNodes[1][2], offset: 1 },
      ]);
      expect(finder.findPrev()).toEqual([
        { node: textNodes[1][0], offset: 3 },
        { node: textNodes[1][2], offset: 0 },
      ]);
      expect(finder.findPrev()).toEqual([
        { node: textNodes[1][0], offset: 2 },
        { node: textNodes[1][1], offset: 0 },
      ]);
      expect(finder.findPrev()).toEqual([
        { node: textNodes[0][3], offset: 1 },
        { node: textNodes[0][3], offset: 3 },
      ]);
      expect(finder.findPrev()).toEqual([
        { node: textNodes[0][0], offset: 1 },
        { node: textNodes[0][0], offset: 3 },
      ]);
      expect(finder.findPrev()).toEqual([
        { node: textNodes[0][0], offset: 0 },
        { node: textNodes[0][0], offset: 2 },
      ]);
      expect(finder.findPrev()).toBeUndefined();
    });

    test("findNext returns undefined when the keyword is not found", () => {
      const finder = new Finder(
        { keyword: "q", mode: "normal", ignoreCase: false },
        textNodes,
      );
      expect(finder.findNext()).toBeUndefined();
    });

    test("findPrev returns undefined when the keyword is not found", () => {
      const finder = new Finder(
        { keyword: "q", mode: "normal", ignoreCase: false },
        textNodes,
      );
      expect(finder.findPrev()).toBeUndefined();
    });
  });
});
