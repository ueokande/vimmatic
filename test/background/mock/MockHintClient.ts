import type { HintClient } from "../../../src/background/clients/HintClient";
import type { Point, Size } from "../../../src/background/clients/HintClient";
import type { HTMLElementType } from "../../../src/shared/HTMLElementType";

export class MockHintClient implements HintClient {
  lookupTargets(
    _tabId: number,
    _frameId: number,
    _cssSelector: string,
    _viewSize: Size,
    _framePosition: Point,
  ): Promise<string[]> {
    throw new Error("not implemented");
  }

  assignTags(
    _tabId: number,
    _frameId: number,
    _elementTags: Record<string, string>,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  showHints(
    _tabId: number,
    _frameId: number,
    _elements: string[],
  ): Promise<void> {
    throw new Error("not implemented");
  }

  clearHints(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  getElement(
    _tabId: number,
    _frameId: number,
    _element: string,
  ): Promise<HTMLElementType> {
    throw new Error("not implemented");
  }

  focusElement(
    _tabId: number,
    _frameId: number,
    _element: string,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  clickElement(
    _tabId: number,
    _frameId: number,
    _element: string,
  ): Promise<void> {
    throw new Error("not implemented");
  }
}
