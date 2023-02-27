import ToolbarPresenter from "../../../src/background/presenters/ToolbarPresenter";
export default class MockToolbarPresenter implements ToolbarPresenter {
  setEnabled(_enabled: boolean): Promise<void> {
    throw new Error("not implemented");
  }

  onClick(_listener: (arg: browser.tabs.Tab) => void): void {}
}
