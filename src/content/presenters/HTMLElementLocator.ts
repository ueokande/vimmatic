/**
 * HTMLElementLocator is a class to locate HTMLElements by unique id.
 * The id is a stringified index of the element in the document.
 */
class HTMLElementLocator {
  // assume that the element stracture does not change
  private allElements: Record<string, HTMLElement> | undefined;

  constructor(
    private readonly selector: string,
    private readonly document: Document,
  ) {}

  getElement(id: string): HTMLElement | null {
    const allElements = this.getAllElements();
    return allElements[id] || null;
  }

  getAllElements(): Record<string, HTMLElement> {
    if (typeof this.allElements !== "undefined") {
      return this.allElements;
    }
    const all = Array.prototype.filter.call(
      this.document.querySelectorAll(this.selector),
      (element) => !element.hasAttribute("data-vim-vixen-hint"),
    );

    this.allElements = Object.fromEntries(
      all.map((element, index) => [String(index), element]),
    );
    return this.allElements;
  }
}

export default HTMLElementLocator;
