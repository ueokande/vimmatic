import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { afterEach, describe, expect, it, vi } from "vitest";
import { read, write } from "../../e2e/lib/clipboard";

const { spawn } = vi.hoisted(() => ({ spawn: vi.fn() }));
vi.mock("node:child_process", () => ({ spawn }));

const process = () =>
  Object.assign(new EventEmitter(), {
    stdin: new PassThrough(),
    stdout: new PassThrough(),
    stderr: new PassThrough(),
  });
afterEach(() => vi.resetAllMocks());

describe("clipboard subprocess failures", () => {
  it("returns clipboard text", async () => {
    const child = process();
    spawn.mockReturnValue(child);
    const result = read();
    child.stdout.write("clipboard text");
    child.emit("close", 0);
    await expect(result).resolves.toBe("clipboard text");
  });

  it("writes text to stdin and waits for successful exit", async () => {
    const child = process();
    spawn.mockReturnValue(child);
    const result = write("日本語");
    expect(child.stdin.read().toString()).toBe("日本語");
    child.emit("close", 0);
    await expect(result).resolves.toBeUndefined();
  });

  it("rejects a missing executable instead of leaving an unhandled event", async () => {
    const child = process();
    spawn.mockReturnValue(child);
    const result = read();
    child.emit("error", new Error("ENOENT"));
    await expect(result).rejects.toThrow("ENOENT");
  });

  it("rejects a failed clipboard write with diagnostic stderr", async () => {
    const child = process();
    spawn.mockReturnValue(child);
    const result = write("text");
    child.stderr.write("Cannot open display");
    child.emit("close", 1);
    await expect(result).rejects.toThrow("Cannot open display");
  });
});
