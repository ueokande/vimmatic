/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../../src/options/App";
import { asAsyncSpy } from "../asAsyncSpy";

describe("options editing integration", () => {
  const get = vi.spyOn(chrome.storage.sync, "get");
  const set = vi.spyOn(chrome.storage.sync, "set");
  const send = asAsyncSpy<[unknown], unknown>(
    vi.spyOn(chrome.runtime, "sendMessage"),
  );
  beforeEach(() => {
    get.mockImplementation(async () => ({ settings_json: "{}" }));
    set.mockImplementation(async () => {});
    send.mockResolvedValue({});
  });
  afterEach(() => vi.clearAllMocks());

  it("loads, edits, validates and persists settings on blur", async () => {
    render(<App />);
    const input = (await screen.findByDisplayValue(
      "{}",
    )) as HTMLTextAreaElement;
    expect(input.value).toBe("{}");
    const json = '{ "blacklist": [ "https://example.com" ] }';
    fireEvent.change(input, { target: { value: json } });
    expect(set).not.toHaveBeenCalled();
    fireEvent.blur(input);
    await waitFor(() =>
      expect(set).toHaveBeenCalledWith({
        settings_json: json,
        settings: { blacklist: ["https://example.com"] },
      }),
    );
    expect(send).toHaveBeenCalledWith({
      type: "settings.validate",
      args: { settings: { blacklist: ["https://example.com"] } },
    });
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("preserves the last valid save after invalid JSON and can recover", async () => {
    render(<App />);
    const input = await screen.findByDisplayValue("{}");
    fireEvent.change(input, {
      target: { value: '{"properties":{"smoothscroll":true}}' },
    });
    fireEvent.blur(input);
    await waitFor(() => expect(set).toHaveBeenCalledTimes(1));
    fireEvent.change(input, { target: { value: "invalid json" } });
    fireEvent.blur(input);
    expect((await screen.findByRole("alert")).textContent).not.toBe("");
    expect(set).toHaveBeenCalledTimes(1);
    fireEvent.change(input, { target: { value: "{}" } });
    fireEvent.blur(input);
    await waitFor(() => expect(set).toHaveBeenCalledTimes(2));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("does not persist settings rejected by background validation", async () => {
    send.mockResolvedValue({ error: "Unknown property" });
    render(<App />);
    const input = await screen.findByDisplayValue("{}");
    fireEvent.change(input, { target: { value: "{}" } });
    fireEvent.blur(input);
    expect((await screen.findByRole("alert")).textContent).toBe(
      "Unknown property",
    );
    expect(set).not.toHaveBeenCalled();
  });

  it("shows storage errors without pretending that saving succeeded", async () => {
    set.mockImplementation(async () => {
      throw new Error("Storage unavailable");
    });
    render(<App />);
    fireEvent.blur(await screen.findByDisplayValue("{}"));
    expect((await screen.findByRole("alert")).textContent).toBe(
      "Storage unavailable",
    );
  });
});
