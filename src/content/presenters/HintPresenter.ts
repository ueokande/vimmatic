import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { SettingRepository } from "../repositories/SettingRepository";
import { Hint } from "./Hint";
import * as doms from "../../shared/utils/dom";
import { HTMLElementLocator } from "./HTMLElementLocator";
import type { HTMLElementType } from "../../shared/HTMLElementType";

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

const inViewport = (
  win: Window,
  element: Element,
  viewSize: Size,
  framePosition: Point,
): boolean => {
  const { top, left, bottom, right } = doms.viewportRect(element);
  const doc = win.document;
  const frameWidth = doc.documentElement.clientWidth;
  const frameHeight = doc.documentElement.clientHeight;

  if (right < 0 || bottom < 0 || top > frameHeight || left > frameWidth) {
    // out of frame
    return false;
  }
  if (
    right + framePosition.x < 0 ||
    bottom + framePosition.y < 0 ||
    left + framePosition.x > viewSize.width ||
    top + framePosition.y > viewSize.height
  ) {
    // out of viewport
    return false;
  }
  return true;
};

const isAriaVisible = (win: Window, element: HTMLElement): boolean => {
  if (win.document.documentElement === element) {
    return true;
  }
  if (element.ariaHidden === "true" || element.ariaDisabled === "true") {
    return false;
  }
  if (element.parentElement === null) {
    return true;
  }
  return isAriaVisible(win, element.parentElement);
};

const isElementIsNotOverlapped = (element: HTMLElement) => {
  const doc = element.ownerDocument;
  const rect = element.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const elementAtPoint = doc.elementFromPoint(centerX, centerY);

  if (rect.width === 0 || rect.height === 0) {
    return false;
  }

  if (!element.contains(elementAtPoint) && !elementAtPoint?.contains(element)) {
    return false;
  }

  return true;
};

export interface HintPresenter {
  lookupTargets(
    cssSelector: string,
    viewSize: Size,
    framePosition: Point,
  ): string[];

  assignTags(elementTags: Record<string, string>): void;

  showHints(ids: string[]): void;

  clearHints(): void;

  getHint(id: string): Hint | undefined;

  getElement(id: string): HTMLElementType | undefined;

  focusElement(id: string): void;

  clickElement(id: string): void;
}

export const HintPresenter = Symbol("HintPresenter");

@provide(HintPresenter)
export class HintPresenterImpl implements HintPresenter {
  constructor(
    @inject(SettingRepository)
    private readonly settingRepository: SettingRepository,
  ) {}

  private hints: Hint[] = [];

  private locator: HTMLElementLocator | undefined;

  lookupTargets(
    cssSelector: string,
    viewSize: Size,
    framePosition: Point,
  ): string[] {
    const targets = this.getTargets(cssSelector, viewSize, framePosition);
    return Object.keys(targets);
  }

  assignTags(elementTags: Record<string, string>): void {
    if (this.locator === undefined) {
      // called before lookupTargets
      return;
    }

    const style = this.settingRepository.getStyle("hint");
    for (const [id, tag] of Object.entries(elementTags)) {
      const element = this.locator.getElement(id);
      if (element === null) {
        continue;
      }
      this.hints.push(new Hint({ element, id, tag, style }));
    }
  }

  showHints(ids: string[]): void {
    if (this.locator === undefined) {
      // called before lookupTargets
      return;
    }

    this.hints.forEach((h) => {
      if (ids.includes(h.getElementId())) {
        h.show();
      } else {
        h.hide();
      }
    });
  }

  clearHints(): void {
    this.hints.forEach((h) => h.remove());
    this.hints = [];
    this.locator = undefined;
  }

  getHint(id: string): Hint | undefined {
    return this.hints.find((h) => h.getElementId() === id);
  }

  private getTargets(
    cssSelector: string,
    viewSize: Size,
    framePosition: Point,
  ): { [id: string]: Element } {
    this.locator = new HTMLElementLocator(cssSelector, window.document);
    const allElements = this.locator.getAllElements();
    const targets = Object.fromEntries(
      Object.entries(allElements).filter(([_id, element]) =>
        this.isVisible(element, viewSize, framePosition),
      ),
    );
    return targets;
  }

  private isVisible(
    element: HTMLElement,
    viewSize: Size,
    framePosition: Point,
  ): boolean {
    // AREA's 'display' in Browser style is 'none'
    return (
      element.checkVisibility({
        contentVisibilityAuto: true,
        opacityProperty: true,
        visibilityProperty: true,
      }) &&
      isAriaVisible(window, element) &&
      isElementIsNotOverlapped(element) &&
      inViewport(window, element, viewSize, framePosition)
    );
  }

  getElement(elementId: string): HTMLElementType | undefined {
    if (this.locator === undefined) {
      // called before lookupTargets
      return undefined;
    }
    const e = this.locator.getElement(elementId);
    if (e === null) {
      return undefined;
    }
    const attributes = Object.fromEntries(
      e.getAttributeNames().map((name) => [name, e.getAttribute(name) || ""]),
    );
    return {
      tagName: e.tagName,
      attributes,
      textContent: e.textContent || undefined,
      href:
        e instanceof HTMLAnchorElement || e instanceof HTMLAreaElement
          ? e.href
          : undefined,
    };
  }

  focusElement(elementId: string): void {
    const element = this.locator?.getElement(elementId);
    if (element !== null) {
      element?.focus();
    }
  }

  clickElement(elementId: string): void {
    const element = this.locator?.getElement(elementId);
    if (element !== null) {
      element?.click();
    }
  }
}
