import type TabPresenter from "../../../src/background/presenters/TabPresenter";
import type { Tab } from "../../../src/background/presenters/TabPresenter";

export default class MockTabPresenter implements TabPresenter {
  openToTab(_url: string, _tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  openNewTab(
    _url: string,
    _openerId: number,
    _background: boolean,
  ): Promise<void> {
    throw new Error("not implemented");
  }

  openNewWindow(_url: string): Promise<void> {
    throw new Error("not implemented");
  }

  getTab(_tabId: number): Promise<Tab> {
    throw new Error("not implemented");
  }
}
