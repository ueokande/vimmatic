import { injectable } from "inversify";

export default interface FindPresenter {
  find(keyword: string, backwards: boolean): boolean;

  clearSelection(): void;
}

let currentKeyword: string | undefined;
let finder: Finder | undefined;

@injectable()
export class FindPresenterImpl implements FindPresenter {
  find(keyword: string, backwards: boolean): boolean {
    if (!finder || currentKeyword !== keyword) {
      finder = new Finder(
        { keyword, mode: "normal", caseSensitive: false },
        getTextGroups(document.body),
      );
    }

    const matched = backwards ? finder.findPrev() : finder.findNext();
    if (!matched) {
      return false;
    }

    const range = document.createRange();
    range.setStart(matched[0].node, matched[0].offset);
    range.setEnd(matched[1].node, matched[1].offset + 1);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
    matched[0].node.parentElement!.scrollIntoView({
      block: "center",
      inline: "center",
    });
    return true;
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
  mode: "normal" | "regex";
  caseSensitive: boolean;
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

  private findAll(): Array<FindRange> {
    const matched: Array<FindRange> = [];
    const keyword = this.target.keyword;
    for (const textGroupMap of this.textGroupMaps) {
      const wholeLine = textGroupMap.wholeLine;
      if (this.target.mode === "normal") {
        for (let i = 0; i < wholeLine.length; ++i) {
          const index = (() => {
            if (this.target.caseSensitive) {
              return wholeLine.indexOf(keyword, i);
            } else {
              return wholeLine.toLowerCase().indexOf(keyword.toLowerCase(), i);
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
        const re = new RegExp(keyword, this.target.caseSensitive ? "g" : "gi");
        let match: RegExpExecArray | null;
        while ((match = re.exec(wholeLine)) !== null) {
          const begin = textGroupMap.anchorAt(match.index);
          const end = textGroupMap.anchorAt(match.index + match[0].length - 1);
          matched.push([begin, end]);
          re.lastIndex = match.index + 1;
        }
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
        inlineGroups.push(currentGroup);
        currentGroup = [];
      }
    }
  };

  walk(root);

  return inlineGroups;
};
