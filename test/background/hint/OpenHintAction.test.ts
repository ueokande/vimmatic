import OpenHintAction from "../../../src/background/hint/OpenHintAction";
import MokcHintClient from "../mock/MockHintClient";
import MockTabPresenter from "../mock/MockTabPresenter";

describe("OpenHintAction", () => {
  const hintClient = new MokcHintClient();
  const tabPresenter = new MockTabPresenter();
  const sut = new OpenHintAction(hintClient, tabPresenter);

  test("open link in the current tab", async () => {
    const mockOpen = jest.spyOn(tabPresenter, "openToTab").mockResolvedValue();
    jest.spyOn(hintClient, "getElement").mockResolvedValue({
      tagName: "a",
      href: "https://example.com/photo.jpg",
      attributes: {},
    });

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockOpen).toBeCalledWith("https://example.com/photo.jpg", 10);
  });
});
