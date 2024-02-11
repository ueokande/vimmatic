/**
 * @jest-environment jsdom
 */

import {
  getTextGroups,
  TextGroupMap,
  Finder,
} from "../../../src/content/presenters/FindPresenter";

describe("getTextGroups", () => {
  beforeAll(() => {
    window.getComputedStyle = jest.fn().mockImplementation((node) => {
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
      expect(map.wholeLineText).toBe("firstsecondthird");
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
  let textNodes: Array<Array<Text>>;

  beforeAll(() => {
    textNodes = [
      ["aaa", "bbb", "", "waaaw"],
      ["bb", "xaaax", "bb"],
      [""],
      [],
      ["", "yaaay", ""],
    ].map((group) => group.map((t) => document.createTextNode(t)));
  });

  describe("findNext", () => {
    it("returns the index of the first occurrence of the given text", () => {
      const finder = new Finder(
        { keyword: "aa", direction: "forward", mode: "normal" },
        textNodes,
      );
      expect(finder.findNext()).toEqual({ node: textNodes[0][0], offset: 0 });
      expect(finder.findNext()).toEqual({ node: textNodes[0][0], offset: 1 });
      expect(finder.findNext()).toEqual({ node: textNodes[0][3], offset: 1 });
      expect(finder.findNext()).toEqual({ node: textNodes[0][3], offset: 2 });
      expect(finder.findNext()).toEqual({ node: textNodes[1][1], offset: 1 });
      expect(finder.findNext()).toEqual({ node: textNodes[1][1], offset: 2 });
      expect(finder.findNext()).toEqual({ node: textNodes[4][1], offset: 1 });
      expect(finder.findNext()).toEqual({ node: textNodes[4][1], offset: 2 });
      expect(finder.findNext()).toEqual({ node: textNodes[0][0], offset: 0 });
    });

    it("returns undefined when the keyword is not found", () => {
      const finder = new Finder(
        { keyword: "c", direction: "forward", mode: "normal" },
        textNodes,
      );
      expect(finder.findNext()).toBeUndefined();
    });
  });

  describe("findPrev", () => {
    it("returns the index of the last occurrence of the given text", () => {
      const finder = new Finder(
        { keyword: "aa", direction: "backward", mode: "normal" },
        textNodes,
      );
      expect(finder.findPrev()).toEqual({ node: textNodes[4][1], offset: 2 });
      expect(finder.findPrev()).toEqual({ node: textNodes[4][1], offset: 1 });
      expect(finder.findPrev()).toEqual({ node: textNodes[1][1], offset: 2 });
      expect(finder.findPrev()).toEqual({ node: textNodes[1][1], offset: 1 });
      expect(finder.findPrev()).toEqual({ node: textNodes[0][3], offset: 2 });
      expect(finder.findPrev()).toEqual({ node: textNodes[0][3], offset: 1 });
      expect(finder.findPrev()).toEqual({ node: textNodes[0][0], offset: 1 });
      expect(finder.findPrev()).toEqual({ node: textNodes[0][0], offset: 0 });
      expect(finder.findPrev()).toEqual({ node: textNodes[4][1], offset: 2 });
    });

    it("returns undefined when the keyword is not found", () => {
      const finder = new Finder(
        { keyword: "c", direction: "backward", mode: "normal" },
        textNodes,
      );
      expect(finder.findPrev()).toBeUndefined();
    });
  });

  describe("findNext and findPrev", () => {
    it("returns the index of the first occurrence of the given text", () => {
      const finder = new Finder(
        { keyword: "a", direction: "forward", mode: "normal" },
        textNodes,
      );
      expect(finder.findNext()).toEqual({ node: textNodes[0][0], offset: 0 });
      expect(finder.findNext()).toEqual({ node: textNodes[0][0], offset: 1 });
      expect(finder.findPrev()).toEqual({ node: textNodes[0][0], offset: 0 });
      expect(finder.findPrev()).toEqual({ node: textNodes[4][1], offset: 3 });
      expect(finder.findPrev()).toEqual({ node: textNodes[4][1], offset: 2 });
      expect(finder.findNext()).toEqual({ node: textNodes[4][1], offset: 3 });
      expect(finder.findNext()).toEqual({ node: textNodes[0][0], offset: 0 });
    });
  });
});
