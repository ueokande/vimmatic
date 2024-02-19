import TabopenHintAction from "../../../src/background/hint/TabopenHintAction";
import MokcHintClient from "../mock/MockHintClient";
import MockTabPresenter from "../mock/MockTabPresenter";

describe("TabopenHintAction", () => {
  const hintClient = new MokcHintClient();
  const tabPresenter = new MockTabPresenter();
  const sut = new TabopenHintAction(hintClient, tabPresenter);

  test("open link in new tab", async () => {
    const mockOpen = jest.spyOn(tabPresenter, "openNewTab").mockResolvedValue();
    jest.spyOn(hintClient, "getElement").mockResolvedValue({
      tagName: "a",
      href: "https://example.com/photo.jpg",
      attributes: {},
    });

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: true });

    expect(mockOpen).toHaveBeenCalledWith(
      "https://example.com/photo.jpg",
      10,
      true,
    );
  });
});
