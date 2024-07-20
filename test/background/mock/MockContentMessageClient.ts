import type { ContentMessageClient } from "../../../src/background/clients/ContentMessageClient";

export class MockContentMessageClient implements ContentMessageClient {
  getAddonEnabled(_tabId: number, _frameId: number): Promise<boolean> {
    throw new Error("not implemented");
  }

  toggleAddonEnabled(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  scrollTo(
    _tabId: number,
    _frameId: number,
    _x: number,
    _y: number,
    _smooth: boolean,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  getScroll(
    _tabId: number,
    _frameId: number,
  ): Promise<{ x: number; y: number }> {
    throw new Error("not implemented");
  }

  settingsChanged(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  scrollVertically(
    _tabId: number,
    _frameId: number,
    _amount: number,
    _smooth: boolean,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  scrollHorizonally(
    _tabId: number,
    _frameId: number,
    _amount: number,
    _smooth: boolean,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  scrollPages(
    _tabId: number,
    _frameId: number,
    _amount: number,
    _smooth: boolean,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  scrollToBottom(
    _tabId: number,
    _frameId: number,
    _smooth: boolean,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  scrollToEnd(
    _tabId: number,
    _frameId: number,
    _smooth: boolean,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  scrollToHome(
    _tabId: number,
    _frameId: number,
    _smooth: boolean,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  scrollToTop(
    _tabId: number,
    _frameId: number,
    _smooth: boolean,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  focusFirstInput(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }
}
