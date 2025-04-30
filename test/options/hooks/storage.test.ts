/**
 * @vitest-environment jsdom
 */

import { renderHook, waitFor, act } from "@testing-library/react";
import {
  useLoadSettings,
  useSaveSettings,
} from "../../../src/options/hooks/storage";
import { describe, vi, beforeEach, it, expect } from "vitest";

describe("useLoadSettings", () => {
  const spyGet = vi.spyOn(chrome.storage.sync, "get");

  beforeEach(() => {
    spyGet.mockClear();
  });

  it("returns initial values", async () => {
    const { result } = renderHook(() => useLoadSettings());

    await waitFor(() => expect(result.current.loading).toBeTruthy());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it("loads saved value", async () => {
    spyGet.mockImplementation(() => Promise.resolve({ settings_json: "{}" }));

    const { result } = renderHook(() => useLoadSettings());

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(result.current.data).toEqual("{}");
    expect(result.current.error).toBeUndefined();
  });

  it("loads default value when no saved settings", async () => {
    spyGet.mockImplementation(() =>
      Promise.resolve({ settings_json: undefined }),
    );

    const { result } = renderHook(() => useLoadSettings());

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    const settings = JSON.parse(result.current.data!);

    expect(result.current.error).toBeUndefined();
    expect(settings).toHaveProperty("keymaps");
    expect(settings).toHaveProperty("blacklist");
    expect(settings).toHaveProperty("search");
    expect(settings).toHaveProperty("properties");
  });

  it("returns error when an error occurs", async () => {
    spyGet.mockImplementation(() => Promise.reject(new Error("storage error")));

    const { result } = renderHook(() => useLoadSettings());

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useSaveSettings", () => {
  const spySet = vi.spyOn(chrome.storage.sync, "set");
  const spySendMessage = vi.spyOn(chrome.runtime, "sendMessage");

  beforeEach(() => {
    spySet.mockClear();
    spySendMessage.mockClear();
  });

  it("returns initial values", async () => {
    const { result } = renderHook(() => useSaveSettings());

    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
    expect(result.current.save).toBeInstanceOf(Function);
  });

  it("saves settings", async () => {
    spySet.mockImplementation(() => Promise.resolve());
    spySendMessage.mockResolvedValue({});

    const { result } = renderHook(() => useSaveSettings());

    act(() => {
      result.current.save(`{ "properties": { "smoothscroll": true } }`);
    });

    expect(result.current.loading).toBeTruthy();

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(result.current.error).toBeUndefined();

    expect(spySet).toHaveBeenCalledWith({
      settings: {
        keymaps: undefined,
        search: undefined,
        properties: { smoothscroll: true },
        blacklist: undefined,
      },
      settings_json: `{ "properties": { "smoothscroll": true } }`,
    });
  });

  it("returns validation error", async () => {
    spySet.mockImplementation(() => Promise.resolve());
    spySendMessage.mockResolvedValue({});

    const { result } = renderHook(() => useSaveSettings());

    act(() => {
      result.current.save(`invalid json`);
    });
    expect(result.current.loading).toBeTruthy();

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(result.current.error).toBeInstanceOf(SyntaxError);
  });
});
