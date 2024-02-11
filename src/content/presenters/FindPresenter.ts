import { injectable } from "inversify";

export default interface FindPresenter {
  find(keyword: string, backwards: boolean): boolean;

  clearSelection(): void;
}

@injectable()
export class FindPresenterImpl implements FindPresenter {
  find(keyword: string, backwards: boolean): boolean {
    const caseSensitive = false;
    const wrapScan = false;

    // NOTE: aWholeWord dows not implemented, and aSearchInFrames does not work
    // because of same origin policy
    try {
      return window.find(keyword, caseSensitive, backwards, wrapScan);
    } catch (e) {
      // Firefox throws NS_ERROR_ILLEGAL_VALUE sometimes
      return false;
    }
  }

  clearSelection(): void {
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
  }
}

type FindTarget = {
  keyword: string;
  direction: "forward" | "backward";
  mode: "normal" | "regex";
};

type FindRange = [
  { node: Text; offset: number },
  { node: Text; offset: number },
];

export class Finder {
  private readonly target: FindTarget;
  private readonly textGroupMaps: Array<TextGroupMap>;
  private matched: Array<FindRange> = [];

  private currentMatchedIndex: number = -1;

  constructor(target: FindTarget, textNodes: Array<Array<Text>>) {
    this.target = target;
    this.textGroupMaps = textNodes.map((group) => new TextGroupMap(group));

    const keyword = this.target.keyword;
    for (const textGroupMap of this.textGroupMaps) {
      const wholeLine = textGroupMap.wholeLine;
      for (let i = 0; i < wholeLine.length; ++i) {
        const index = wholeLine.indexOf(keyword, i);
        if (index < 0) {
          break;
        }

        const begin = textGroupMap.anchorAt(index);
        const end = textGroupMap.anchorAt(index + keyword.length - 1);
        this.matched.push([begin, end]);

        i = index;
      }
    }
  }

  findNext(): FindRange | undefined {
    if (this.matched.length === 0) {
      return undefined;
    }
    const next = (this.currentMatchedIndex + 1) % this.matched.length;
    this.currentMatchedIndex = next;
    return this.matched[next];
  }

  findPrev(): FindRange | undefined {
    if (this.matched.length === 0) {
      return undefined;
    }
    if (this.currentMatchedIndex < 0) {
      this.currentMatchedIndex = this.matched.length;
    }
    const prev =
      (this.currentMatchedIndex - 1 + this.matched.length) %
      this.matched.length;
    this.currentMatchedIndex = prev;
    return this.matched[prev];
  }
}

export class TextGroupMap {
  private readonly textNodes: Array<Text>;
  private readonly wholeLineText: string;

  constructor(textNodes: Array<Text>) {
    this.textNodes = textNodes;
    this.wholeLineText = textNodes.map((e) => e.wholeText).join("");
  }

  get wholeLine(): string {
    return this.wholeLineText;
  }

  /**
   * Returns the text node and the offset of the given index in the text.
   *
   * ["foo", "bar", "baz"]
   *   |      |       |
   *   0      3       7
   */
  anchorAt(index: number): { node: Text; offset: number } {
    let current = 0;
    for (const node of this.textNodes) {
      const length = node.wholeText.length;
      if (current + length > index) {
        return { node, offset: index - current };
      }
      current += length;
    }
    throw new Error("index out of range");
  }
}

/**
 * Returns true if the given node is an inline element or a text node.
 */
const isInline = (node: Node): boolean => {
  if (node instanceof Text) {
    return true;
  }
  if (node instanceof Element) {
    const style = window.getComputedStyle(node);
    if (style.display === "inline" || style.display === "inline-block") {
      return true;
    }
  }
  return false;
};

/**
 * let an text group is a sequence of text nodes that are separated by block
 * elements (div, p, etc.).  This function returns an array of all inline
 * groups in the given root node.
 */
export const getTextGroups = (root: Node): Array<Array<Text>> => {
  document.body.childNodes;
  const inlineGroups: Array<Array<Text>> = [];
  let currentGroup: Array<Text> = [];

  const walk = (node: Node) => {
    if (!isInline(node)) {
      if (currentGroup.length > 0) {
        inlineGroups.push(currentGroup);
        currentGroup = [];
      }
    }
    for (const child of Array.from(node.childNodes)) {
      if (child instanceof Text) {
        currentGroup.push(child);
      } else if (child instanceof Element) {
        walk(child);
      }
    }
    if (!isInline(node)) {
      if (currentGroup.length > 0) {
        inlineGroups.push(currentGroup);
        currentGroup = [];
      }
    }
  };

  walk(root);

  return inlineGroups;
};
