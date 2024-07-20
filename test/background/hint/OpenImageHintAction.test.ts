import { OpenImageHintAction } from "../../../src/background/hint/OpenImageHintAction";
import { MockHintClient } from "../mock/MockHintClient";
import { MockTabPresenter } from "../mock/MockTabPresenter";
import { describe, expect, beforeEach, vi, test } from "vitest";

describe("OpenImageHintAction", () => {
  const hintClient = new MockHintClient();
  const tabPresenter = new MockTabPresenter();
  const sut = new OpenImageHintAction(hintClient, tabPresenter);

  const mockGetElement = vi.spyOn(hintClient, "getElement").mockResolvedValue({
    tagName: "IMAGE",
    attributes: {
      src: "photo.jpg",
    },
  });

  beforeEach(() => {
    vi.spyOn(tabPresenter, "getTab").mockResolvedValue({
      id: 10,
      url: "https://example.com",
      active: true,
      index: 0,
      windowId: 1,
      highlighted: true,
      pinned: false,
      incognito: false,
      selected: true,
      discarded: false,
      autoDiscardable: false,
      groupId: 1,
    });
  });

  test("open image in current tab", async () => {
    const mockOpenToTab = vi
      .spyOn(tabPresenter, "openToTab")
      .mockResolvedValue(undefined);

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockGetElement).toHaveBeenCalledWith(10, 0, "100");
    expect(mockOpenToTab).toHaveBeenCalledWith(
      "https://example.com/photo.jpg",
      10,
    );
  });

  test("open image in new tab by newTab option", async () => {
    const mockOpenNewTab = vi
      .spyOn(tabPresenter, "openNewTab")
      .mockResolvedValue(undefined);

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: true, background: false });

    expect(mockGetElement).toHaveBeenCalledWith(10, 0, "100");
    expect(mockOpenNewTab).toHaveBeenCalledWith(
      "https://example.com/photo.jpg",
      10,
      false,
    );
  });
});
