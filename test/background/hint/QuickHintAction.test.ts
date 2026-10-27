import { describe, expect, test, vi } from "vitest";
import { QuickHintAction } from "../../../src/background/hint/QuickHintAction";
import { MockHintClient } from "../mock/MockHintClient";
import { MockTabPresenter } from "../mock/MockTabPresenter";

describe("QuickHintAction", () => {
  const hintClient = new MockHintClient();
  const tabPresenter = new MockTabPresenter();
  const sut = new QuickHintAction(hintClient, tabPresenter);

  test("open link in current tab", async () => {
    const mockGetElement = vi
      .spyOn(hintClient, "getElement")
      .mockResolvedValue({
        tagName: "A",
        href: "https://example.com",
        attributes: {},
      });
    const mockOpenToTab = vi
      .spyOn(tabPresenter, "openToTab")
      .mockResolvedValue(undefined);

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockGetElement).toHaveBeenCalledWith(10, 0, "100");
    expect(mockOpenToTab).toHaveBeenCalledWith("https://example.com", 10);
  });

  test("open link in new tab by target=_blank", async () => {
    const mockGetElement = vi
      .spyOn(hintClient, "getElement")
      .mockResolvedValue({
        tagName: "A",
        href: "https://example.com",
        attributes: { target: "_blank" },
      });
    const mockOpenNewTab = vi
      .spyOn(tabPresenter, "openNewTab")
      .mockResolvedValue(undefined);

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockGetElement).toHaveBeenCalledWith(10, 0, "100");
    expect(mockOpenNewTab).toHaveBeenCalledWith(
      "https://example.com",
      10,
      false,
    );
  });

  test("open link in new tab by newTab option", async () => {
    const mockGetElement = vi
      .spyOn(hintClient, "getElement")
      .mockResolvedValue({
        tagName: "A",
        href: "https://example.com",
        attributes: {},
      });
    const mockOpenNewTab = vi
      .spyOn(tabPresenter, "openNewTab")
      .mockResolvedValue(undefined);

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: true, background: false });

    expect(mockGetElement).toHaveBeenCalledWith(10, 0, "100");
    expect(mockOpenNewTab).toHaveBeenCalledWith(
      "https://example.com",
      10,
      false,
    );
  });

  test.each<{ tagName: string; attributes: { [key: string]: string } }>([
    { tagName: "INPUT", attributes: {} },
    { tagName: "TEXTAREA", attributes: {} },
    { tagName: "DIV", attributes: { contenteditable: "true" } },
  ])(
    "focus to $tagName element with attributes $attributes",
    async ({ tagName, attributes }) => {
      const mockGetElement = vi
        .spyOn(hintClient, "getElement")
        .mockResolvedValue({
          tagName,
          attributes: { ...attributes },
        });
      const mockFocusElement = vi
        .spyOn(hintClient, "focusElement")
        .mockResolvedValue();

      const target = { frameId: 0, element: "100", tag: "aa" };
      await sut.activate(10, target, { newTab: true, background: false });

      expect(mockGetElement).toHaveBeenCalledWith(10, 0, "100");
      expect(mockFocusElement).toHaveBeenCalledWith(10, 0, "100");
    },
  );

  test.each<{ tagName: string; attributes: { [key: string]: string } }>([
    { tagName: "BUTTON", attributes: {} },
    { tagName: "INPUT", attributes: { type: "button" } },
    { tagName: "INPUT", attributes: { type: "submit" } },
  ])(
    "click to $tagName element with attributes $attributes",
    async ({ tagName, attributes }) => {
      const mockGetElement = vi
        .spyOn(hintClient, "getElement")
        .mockResolvedValue({
          tagName,
          attributes: { ...attributes },
        });
      const mockClickElement = vi
        .spyOn(hintClient, "clickElement")
        .mockResolvedValue();

      const target = { frameId: 0, element: "100", tag: "aa" };
      await sut.activate(10, target, { newTab: true, background: false });

      expect(mockGetElement).toHaveBeenCalledWith(10, 0, "100");
      expect(mockClickElement).toHaveBeenCalledWith(10, 0, "100");
    },
  );
  test("waits for a new tab before completing hint activation", async () => {
    const client = new MockHintClient();
    const presenter = new MockTabPresenter();
    vi.spyOn(client, "getElement").mockResolvedValue({
      tagName: "A",
      href: "https://example.com",
      attributes: {},
    });
    let opened!: () => void;
    const create = vi.spyOn(presenter, "openNewTab").mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          opened = resolve;
        }),
    );
    let complete = false;
    const result = new QuickHintAction(client, presenter)
      .activate(
        10,
        { frameId: 0, element: "100", tag: "aa" },
        { newTab: true, background: false },
      )
      .then(() => {
        complete = true;
      });
    await Promise.resolve();
    await Promise.resolve();
    expect(create).toHaveBeenCalledWith("https://example.com", 10, false);
    expect(complete).toBe(false);
    opened();
    await result;
    expect(complete).toBe(true);
  });
});
