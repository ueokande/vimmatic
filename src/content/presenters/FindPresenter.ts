import { provide } from "inversify-binding-decorators";
import type { FindQuery } from "../../shared/findQuery";

export interface FindPresenter {
  findNext(query: FindQuery): boolean;

  findPrev(query: FindQuery): boolean;

  clearSelection(): void;
}

let currentQuery: {
  keyword: string;
  mode: string;
  ignoreCase: boolean;
} = {
  keyword: "",
  mode: "",
  ignoreCase: false,
};
let finder: Finder | undefined;
let textGroups: Array<Array<Text>> | undefined;

export const FindPresenter = Symbol("FindPresenter");

@provide(FindPresenter)
export class FindPresenterImpl implements FindPresenter {
  findNext({ keyword, mode, ignoreCase }: FindQuery): boolean {
    this.initFinder({ keyword, mode, ignoreCase });
    const matched = finder!.findNext();
    if (!matched) {
      return false;
    }

    this.select(matched);
    return true;
  }

  findPrev({ keyword, mode, ignoreCase }: FindQuery): boolean {
    this.initFinder({ keyword, mode, ignoreCase });

    const matched = finder!.findPrev();
    if (!matched) {
      return false;
    }
    this.select(matched);
    return true;
  }

  private initFinder({
    keyword,
    mode,
    ignoreCase,
  }: {
    keyword: string;
    mode: "normal" | "regexp";
    ignoreCase: boolean;
  }): void {
    if (!textGroups) {
      textGroups = getTextGroups(document.body);
    }
    if (
      !finder ||
      keyword !== currentQuery.keyword ||
      mode !== currentQuery.mode ||
      ignoreCase !== currentQuery.ignoreCase
    ) {
      finder = new Finder({ keyword, mode, ignoreCase }, textGroups);
      currentQuery = {
        keyword,
        mode,
        ignoreCase,
      };
    }
  }

  private select(matched: FindRange): void {
    const range = document.createRange();
    range.setStart(matched[0].node, matched[0].offset);
    range.setEnd(matched[1].node, matched[1].offset + 1);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
    const container = matched[0].node.parentNode;
    if (!(container instanceof Element)) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const horizonalScrollMode =
      rect.left < 0 || rect.right > window.innerWidth ? "center" : "nearest";
    const verticalScrollMode =
      rect.top < 0 || rect.bottom > window.innerHeight ? "center" : "nearest";

    matched[0].node.parentElement!.scrollIntoView({
      block: verticalScrollMode,
      inline: horizonalScrollMode,
    });
  }

  clearSelection(): void {
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
    finder = undefined;
  }
}

type FindTarget = {
  keyword: string;
  mode: "normal" | "regexp";
  ignoreCase: boolean;
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
    this.matched = this.findAll();
  }

  findNext(): FindRange | undefined {
    if (this.matched.length === 0) {
      return undefined;
    }
    if (this.currentMatchedIndex === this.matched.length - 1) {
      return undefined;
    }
    this.currentMatchedIndex++;
    return this.matched[this.currentMatchedIndex];
  }

  findPrev(): FindRange | undefined {
    if (this.matched.length === 0) {
      return undefined;
    }
    if (this.currentMatchedIndex === 0) {
      return undefined;
    } else if (this.currentMatchedIndex < 0) {
      this.currentMatchedIndex = this.matched.length;
    }
    this.currentMatchedIndex--;
    return this.matched[this.currentMatchedIndex];
  }

  private findAll(): Array<FindRange> {
    const matched: Array<FindRange> = [];
    const keyword = this.target.keyword;
    for (const textGroupMap of this.textGroupMaps) {
      const wholeLine = textGroupMap.wholeLine;
      if (this.target.mode === "normal") {
        for (let i = 0; i < wholeLine.length; ++i) {
          const index = (() => {
            if (this.target.ignoreCase) {
              return wholeLine.toLowerCase().indexOf(keyword.toLowerCase(), i);
            } else {
              return wholeLine.indexOf(keyword, i);
            }
          })();
          if (index < 0) {
            break;
          }

          const begin = textGroupMap.anchorAt(index);
          const end = textGroupMap.anchorAt(index + keyword.length - 1);
          matched.push([begin, end]);

          i = index;
        }
      } else {
        const re = new RegExp(keyword, this.target.ignoreCase ? "gi" : "g");
        Array.from(wholeLine.matchAll(re)).forEach((m) => {
          if (m.index === undefined || m[0].length === 0) {
            return;
          }
          const begin = textGroupMap.anchorAt(m.index);
          const end = textGroupMap.anchorAt(m.index + m[0].length - 1);
          matched.push([begin, end]);
        });
      }
    }
    return matched;
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
  const textGroups: Array<Array<Text>> = [];
  let currentGroup: Array<Text> = [];

  const walk = (node: Node) => {
    if (!isInline(node)) {
      if (currentGroup.length > 0) {
        textGroups.push(currentGroup);
        currentGroup = [];
      }
    }
    for (const child of Array.from(node.childNodes)) {
      if (child instanceof Text) {
        currentGroup.push(child);
      } else if (child instanceof Element) {
        const visible = child.checkVisibility({
          checkVisibilityCSS: true,
        });
        if (visible) {
          walk(child);
        }
      }
    }
    if (!isInline(node)) {
      if (currentGroup.length > 0) {
        textGroups.push(currentGroup);
        currentGroup = [];
      }
    }
  };

  walk(root);

  return textGroups;
};
