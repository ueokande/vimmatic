import { CommandUseCase } from "../../../src/background/usecases/CommandUseCase";
import { CommandRegistryImpl } from "../../../src/background/command/CommandRegistry";
import type { Command } from "../../../src/background/command/types";
import { describe, beforeAll, test, vi, expect } from "vitest";

const commandA: Command = {
  names: () => ["a"],
  fullname: () => "a",
  description: () => "",
  getCompletions: () => {
    throw new Error("not implemented");
  },
  exec: () => {
    throw new Error("not implemented");
  },
};

const commandB: Command = {
  names: () => ["b"],
  fullname: () => "b",
  description: () => "",
  getCompletions: () => {
    throw new Error("not implemented");
  },
  exec: () => {
    throw new Error("not implemented");
  },
};

describe("CommandUseCase", () => {
  let reg: CommandRegistryImpl;

  beforeAll(() => {
    reg = new CommandRegistryImpl();
    reg.register(commandA);
    reg.register(commandB);
  });

  const commandAGetCompletion = vi.spyOn(commandA, "getCompletions");
  const commandAExec = vi.spyOn(commandA, "exec");

  describe("exec", () => {
    test("executes a command", async () => {
      const sut = new CommandUseCase(reg);
      const ctx = { sender: { tab: { id: 1 }, frameId: 1 } as any };

      commandAExec.mockResolvedValue(undefined);

      await sut.exec(ctx, "a 123");

      expect(commandAExec.mock?.lastCall?.[1]).toBe(false);
      expect(commandAExec.mock?.lastCall?.[2]).toBe("123");
    });

    test("execute a command with force", async () => {
      const sut = new CommandUseCase(reg);
      const ctx = { sender: { tab: { id: 1 }, frameId: 1 } as any };

      commandAExec.mockResolvedValue(undefined);

      await sut.exec(ctx, "a! 123");

      expect(commandAExec.mock?.lastCall?.[1]).toBe(true);
      expect(commandAExec.mock?.lastCall?.[2]).toBe("123");
    });

    test("command not found", async () => {
      const sut = new CommandUseCase(reg);
      const ctx = { sender: { tab: { id: 1 }, frameId: 1 } as any };

      await expect(() => sut.exec(ctx, "c")).rejects.toThrow(
        "c command is not defined",
      );
    });

    test("empty command", async () => {
      const sut = new CommandUseCase(reg);
      const ctx = { sender: { tab: { id: 1 }, frameId: 1 } as any };

      await sut.exec(ctx, "");
      // no error
    });
  });

  describe("getCompletions", () => {
    test("returns completions of commands", async () => {
      const sut = new CommandUseCase(reg);

      expect(await sut.getCompletions("")).toEqual([
        {
          name: "Console Command",
          items: [
            { primary: "a", secondary: "", value: "a" },
            { primary: "b", secondary: "", value: "b" },
          ],
        },
      ]);
      expect(await sut.getCompletions("a")).toEqual([
        {
          name: "Console Command",
          items: [{ primary: "a", secondary: "", value: "a" }],
        },
      ]);
    });

    test("returns completions of command arguments", async () => {
      commandAGetCompletion.mockResolvedValue([
        {
          name: "Group",
          items: [{ value: "item1" }, { value: "item2" }],
        },
      ]);

      const sut = new CommandUseCase(reg);

      expect(await sut.getCompletions("a ")).toEqual([
        {
          name: "Group",
          items: [{ value: "a item1" }, { value: "a item2" }],
        },
      ]);
    });

    test("returns completions of command arguments with force", async () => {
      commandAGetCompletion.mockResolvedValue([
        {
          name: "Group",
          items: [{ value: "item1" }, { value: "item2" }],
        },
      ]);

      const sut = new CommandUseCase(reg);

      expect(await sut.getCompletions("a! ")).toEqual([
        {
          name: "Group",
          items: [{ value: "a! item1" }, { value: "a! item2" }],
        },
      ]);
    });

    test("command not found", async () => {
      const sut = new CommandUseCase(reg);

      await expect(() => sut.getCompletions("c ")).rejects.toThrow(
        "c command is not defined",
      );
    });
  });
});
