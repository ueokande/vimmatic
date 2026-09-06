import { describe, it, expect, vi, afterEach } from "vitest";
import { newSender } from "../../../src/background/clients/ContentMessageSender";

describe("ContentMessageSender", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends a message with the tab id and frame id", async () => {
    const sendMessage = vi.fn().mockResolvedValue({ x: 1, y: 2 });
    (global.chrome as any).tabs.sendMessage = sendMessage;

    const sender = newSender(10, 3);
    const result = await sender.send("get.scroll");

    expect(result).toEqual({ x: 1, y: 2 });
    expect(sendMessage).toHaveBeenCalledWith(
      10,
      { type: "get.scroll", args: {} },
      { frameId: 3 },
    );
  });

  it("sends only once and surfaces the error without retrying", async () => {
    const err = new Error(
      "Could not establish connection. Receiving end does not exist.",
    );
    const sendMessage = vi.fn().mockRejectedValue(err);
    (global.chrome as any).tabs.sendMessage = sendMessage;

    const sender = newSender(10, 0);
    await expect(sender.send("settings.changed")).rejects.toThrow(
      "Could not establish connection.",
    );

    expect(sendMessage).toHaveBeenCalledTimes(1);
  });
});
