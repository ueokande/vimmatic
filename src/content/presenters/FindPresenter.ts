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

export class Finder {
  private readonly target: FindTarget;
  private readonly textGroupMaps: Array<TextGroupMap>;
  private currentTextGroupIndex: number = 0;
  private currentTextOffset: number = -1;

  constructor(target: FindTarget, textNodes: Array<Array<Text>>) {
    this.target = target;
    this.textGroupMaps = textNodes.map((group) => new TextGroupMap(group));
  }

  findNext(): { node: Text; offset: number } | undefined {
    const keyword = this.target.keyword;
    let textOffset = this.currentTextOffset + 1;

    for (let i = 0; i <= this.textGroupMaps.length; ++i) {
      const textGroupIndex =
        (this.currentTextGroupIndex + i) % this.textGroupMaps.length;

      const line = this.textGroupMaps[textGroupIndex].wholeLine;
      const index = line.indexOf(keyword, textOffset);
      if (index >= 0) {
        const { node, offset } =
          this.textGroupMaps[textGroupIndex].anchorAt(index);
        this.currentTextGroupIndex = textGroupIndex;
        this.currentTextOffset = index;

        return { node, offset };
      }

      textOffset = 0;
    }

    return undefined;
  }

  findPrev(): { node: Text; offset: number } | undefined {
    const keyword = this.target.keyword;
    let textOffset = this.currentTextOffset;
    if (this.currentTextOffset <= 0) {
      this.currentTextGroupIndex = this.textGroupMaps.length - 1;
      textOffset = Infinity;
    }

    for (let i = 0; i <= this.textGroupMaps.length; ++i) {
      const textGroupIndex =
        (this.textGroupMaps.length - i + this.currentTextGroupIndex) %
        this.textGroupMaps.length;

      const line = this.textGroupMaps[textGroupIndex].wholeLine;
      const index = line.lastIndexOf(keyword, textOffset - 1);
      if (index >= 0) {
        const { node, offset } =
          this.textGroupMaps[textGroupIndex].anchorAt(index);
        this.currentTextGroupIndex = textGroupIndex;
        this.currentTextOffset = index;

        return { node, offset };
      }

      textOffset = Infinity;
    }

    return undefined;
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
