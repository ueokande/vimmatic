import * as doms from "../../shared/utils/dom";

interface Point {
  x: number;
  y: number;
}

type Style = Record<string, string>;

const hintPosition = (element: Element): Point => {
  const { left, top, right, bottom } = doms.viewportRect(element);

  if (element.tagName !== "AREA") {
    return { x: left, y: top };
  }

  return {
    x: (left + right) / 2,
    y: (top + bottom) / 2,
  };
};

export default class Hint {
  private readonly hint: HTMLElement;

  private readonly id: string;

  private readonly tag: string;

  constructor({
    element,
    id,
    tag,
    style,
  }: {
    element: HTMLElement;
    id: string;
    tag: string;
    style: Style;
  }) {
    this.id = id;
    this.tag = tag;

    const doc = element.ownerDocument;
    if (doc === null) {
      throw new TypeError("ownerDocument is null");
    }

    const { x, y } = hintPosition(element);
    const { scrollX, scrollY } = window;

    const hint = doc.createElement("span");
    hint.textContent = tag;
    for (const [key, value] of Object.entries(style)) {
      hint.style.setProperty(key, value);
    }
    hint.setAttribute("data-vimmatic-hint", ""); // to ignore by CSS selector
    hint.style.position = "absolute";
    hint.style.textTransform = "uppercase";
    hint.style.zIndex = "2147483647";
    hint.style.left = x + scrollX + "px";
    hint.style.top = y + scrollY + "px";

    doc.body.append(hint);

    this.hint = hint;
    this.show();
  }

  show(): void {
    this.hint.style.display = "inline";
  }

  hide(): void {
    this.hint.style.display = "none";
  }

  remove(): void {
    this.hint.remove();
  }

  getTag(): string {
    return this.tag;
  }

  getElementId(): string {
    return this.id;
  }
}
