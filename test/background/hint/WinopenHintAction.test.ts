import WinopenHintAction from "../../../src/background/hint/WinopenHintAction";
import MokcHintClient from "../mock/MockHintClient";
import MockTabPresenter from "../mock/MockTabPresenter";

describe("WinopenHintAction", () => {
  const hintClient = new MokcHintClient();
  const tabPresenter = new MockTabPresenter();
  const sut = new WinopenHintAction(hintClient, tabPresenter);

  test("open link in new window", async () => {
    const mockOpen = jest
      .spyOn(tabPresenter, "openNewWindow")
      .mockResolvedValue();
    jest.spyOn(hintClient, "getElement").mockResolvedValue({
      tagName: "a",
      href: "https://example.com/photo.jpg",
      attributes: {},
    });

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockOpen).toBeCalledWith("https://example.com/photo.jpg");
  });
});
