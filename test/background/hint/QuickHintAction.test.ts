import QuickHintAction from "../../../src/background/hint/QuickHintAction";
import MokcHintClient from "../mock/MockHintClient";
import MockTabPresenter from "../mock/MockTabPresenter";

describe("QuickHintAction", () => {
  const hintClient = new MokcHintClient();
  const tabPresenter = new MockTabPresenter();
  const sut = new QuickHintAction(hintClient, tabPresenter);

  test("open link in current tab", async () => {
    const mockGetElement = jest
      .spyOn(hintClient, "getElement")
      .mockResolvedValue({
        tagName: "A",
        href: "https://example.com",
        attributes: {},
      });
    const mockOpenToTab = jest
      .spyOn(tabPresenter, "openToTab")
      .mockResolvedValue(undefined);

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockGetElement).toBeCalledWith(10, 0, "100");
    expect(mockOpenToTab).toBeCalledWith("https://example.com", 10);
  });

  test("open link in new tab by target=_blank", async () => {
    const mockGetElement = jest
      .spyOn(hintClient, "getElement")
      .mockResolvedValue({
        tagName: "A",
        href: "https://example.com",
        attributes: { target: "_blank" },
      });
    const mockOpenNewTab = jest
      .spyOn(tabPresenter, "openNewTab")
      .mockResolvedValue(undefined);

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockGetElement).toBeCalledWith(10, 0, "100");
    expect(mockOpenNewTab).toBeCalledWith("https://example.com", 10, false);
  });

  test("open link in new tab by newTab option", async () => {
    const mockGetElement = jest
      .spyOn(hintClient, "getElement")
      .mockResolvedValue({
        tagName: "A",
        href: "https://example.com",
        attributes: {},
      });
    const mockOpenNewTab = jest
      .spyOn(tabPresenter, "openNewTab")
      .mockResolvedValue(undefined);

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: true, background: false });

    expect(mockGetElement).toBeCalledWith(10, 0, "100");
    expect(mockOpenNewTab).toBeCalledWith("https://example.com", 10, false);
  });

  test.each<{ tagName: string; attributes: { [key: string]: string } }>([
    { tagName: "INPUT", attributes: {} },
    { tagName: "TEXTAREA", attributes: {} },
    { tagName: "DIV", attributes: { contenteditable: "true" } },
  ])(
    "focus to $tagName element with attributes $attributes",
    async ({ tagName, attributes }) => {
      const mockGetElement = jest
        .spyOn(hintClient, "getElement")
        .mockResolvedValue({
          tagName,
          attributes: { ...attributes },
        });
      const mockFocusElement = jest
        .spyOn(hintClient, "focusElement")
        .mockResolvedValue();

      const target = { frameId: 0, element: "100", tag: "aa" };
      await sut.activate(10, target, { newTab: true, background: false });

      expect(mockGetElement).toBeCalledWith(10, 0, "100");
      expect(mockFocusElement).toBeCalledWith(10, 0, "100");
    },
  );

  test.each<{ tagName: string; attributes: { [key: string]: string } }>([
    { tagName: "BUTTON", attributes: {} },
    { tagName: "INPUT", attributes: { type: "button" } },
    { tagName: "INPUT", attributes: { type: "submit" } },
  ])(
    "click to $tagName element with attributes $attributes",
    async ({ tagName, attributes }) => {
      const mockGetElement = jest
        .spyOn(hintClient, "getElement")
        .mockResolvedValue({
          tagName,
          attributes: { ...attributes },
        });
      const mockClickElement = jest
        .spyOn(hintClient, "clickElement")
        .mockResolvedValue();

      const target = { frameId: 0, element: "100", tag: "aa" };
      await sut.activate(10, target, { newTab: true, background: false });

      expect(mockGetElement).toBeCalledWith(10, 0, "100");
      expect(mockClickElement).toBeCalledWith(10, 0, "100");
    },
  );
});
