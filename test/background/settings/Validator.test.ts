import Validator from "../../../src/background/settings/Validator";
import { createPropertyRegistry } from "../../../src/background/property";
import { OperatorRegistryImpl } from "../../../src/background/operators/OperatorRegistory";
import CloseTabOperator from "../../../src/background/operators/impls/CloseTabOperator";
import DuplicateTabOperator from "../../../src/background/operators/impls/DuplicateTabOperator";
import { Keymaps } from "../../../src/shared/keymaps";
import { Search } from "../../../src/shared/search";
import { describe, test, expect } from "vitest";

describe("Validator", () => {
  const operatorRegistory = new OperatorRegistryImpl();
  operatorRegistory.register(new CloseTabOperator());
  operatorRegistory.register(new DuplicateTabOperator());

  const sut = new Validator(createPropertyRegistry(), operatorRegistory);

  test("it do nothing on valid settings", () => {
    sut.validate({});
    sut.validate({
      keymaps: new Keymaps({
        d: { type: "tabs.close", props: {} },
        D: { type: "tabs.close", props: { select: "left" } },
        zd: { type: "tabs.duplicate", props: {} },
      }),
      search: new Search("google", {
        google: "https://google.com/search?q={}",
        yahoo: "https://search.yahoo.com/search?p={}",
      }),
      properties: {
        smoothscroll: true,
        hintchars: "abc",
      },
    });
  });

  test("it throws an error on invalid property", () => {
    expect(() => {
      sut.validate({
        properties: {
          smoothscroll: "true",
        },
      });
    }).toThrow("Invalid smoothscroll property: not a boolean");

    expect(() => {
      sut.validate({
        properties: {
          hintchars: 123,
        },
      });
    }).toThrow("Invalid hintchars property: not a string");

    expect(() => {
      sut.validate({
        properties: {
          filetype: "typescript",
        },
      });
    }).toThrow("Unknown property: filetype");
  });

  test("it throws an error on invalid keymaps", () => {
    expect(() => {
      sut.validate({
        keymaps: new Keymaps({
          d: { type: "harakiri", props: {} },
        }),
      });
    }).toThrow("Unknown keymap: harakiri");

    expect(() => {
      sut.validate({
        keymaps: new Keymaps({
          D: { type: "tabs.close", props: { force: "1" } },
        }),
      });
    }).toThrow(
      "Invalid property 'force' on keymap 'D': Expected boolean, received string",
    );
  });
});
