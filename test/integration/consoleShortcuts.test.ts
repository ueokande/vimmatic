import { describe, expect, it, vi } from "vitest";
import { ShowAddBookmarkOperator } from "../../src/background/operators/impls/ShowAddBookmarkOperator";
import { ShowBufferCommandOperator } from "../../src/background/operators/impls/ShowBufferCommandOperator";
import { ShowCommandOperator } from "../../src/background/operators/impls/ShowCommandOperator";
import { ShowOpenCommandOperator } from "../../src/background/operators/impls/ShowOpenCommandOperator";
import { ShowTabOpenCommandOperator } from "../../src/background/operators/impls/ShowTabOpenCommandOperator";
import { ShowWinOpenCommandOperator } from "../../src/background/operators/impls/ShowWinOpenCommandOperator";
import { OperatorRegistryImpl } from "../../src/background/operators/OperatorRegistry";
import { KeymapRepositoryImpl } from "../../src/content/repositories/KeymapRepository";
import { KeymapUseCase } from "../../src/content/usecases/KeymapUseCase";
import { fromKeymap } from "../../src/shared/key";
import { defaultTab } from "../background/mock/defaultTab";
import { MockConsoleClient } from "../background/mock/MockConsoleClient";
import { MockAddonEnabledRepository } from "../content/mock/MockAddonEnabledRepository";
import { MockSettingRepository } from "../content/mock/MockSettingRepository";

describe("default console shortcut integration", () => {
  it.each([
    [":", ""],
    ["o", "open "],
    ["O", "open https://example.test/"],
    ["t", "tabopen "],
    ["T", "tabopen https://example.test/"],
    ["w", "winopen "],
    ["W", "winopen https://example.test/"],
    ["b", "buffer "],
    ["a", "addbookmark Example"],
  ])("maps %s through keymaps and operators to %s", async (key, command) => {
    const client = new MockConsoleClient();
    const show = vi.spyOn(client, "showCommand").mockResolvedValue();
    const registry = new OperatorRegistryImpl();
    for (const operator of [
      new ShowCommandOperator(client),
      new ShowOpenCommandOperator(client),
      new ShowTabOpenCommandOperator(client),
      new ShowWinOpenCommandOperator(client),
      new ShowBufferCommandOperator(client),
      new ShowAddBookmarkOperator(client),
    ])
      registry.register(operator);
    const keys = new KeymapUseCase(
      new KeymapRepositoryImpl(),
      new MockSettingRepository(),
      new MockAddonEnabledRepository(true),
      { getCurrentURL: () => new URL("https://example.test/") },
    );
    const operation = keys.nextOps(fromKeymap(key));
    expect(operation).not.toBeNull();
    const operator = registry.getOperator(operation!.op.type);
    if (!operator) throw new Error(`No operator for ${key}`);
    operator.schema()?.parse(operation!.op.props);
    await operator.run(
      {
        sender: {
          tabId: 1,
          frameId: 0,
          tab: {
            ...defaultTab,
            id: 1,
            title: "Example",
            url: "https://example.test/",
          },
        },
      },
      operation!.op.props,
    );
    expect(show).toHaveBeenCalledExactlyOnceWith(1, command);
  });
});
