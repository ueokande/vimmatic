import Validator from "../../../src/background/settings/Validator";
import { PropertyRegistryFactry } from "../../../src/background/property";
import { OperatorRegistryImpl } from "../../../src/background/operators/OperatorRegistory";
import CloseTabOperator from "../../../src/background/operators/impls/CloseTabOperator";
import DuplicateTabOperator from "../../../src/background/operators/impls/DuplicateTabOperator";
import Keymaps from "../../../src/shared/Keymaps";
import Search from "../../../src/shared/Search";

describe("Validator", () => {
  const operatorRegistory = new OperatorRegistryImpl();
  operatorRegistory.register(new CloseTabOperator());
  operatorRegistory.register(new DuplicateTabOperator());

  const sut = new Validator(
    new PropertyRegistryFactry().create(),
    operatorRegistory,
  );

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
    }).toThrowError("Invalid smoothscroll property: not a boolean");

    expect(() => {
      sut.validate({
        properties: {
          hintchars: 123,
        },
      });
    }).toThrowError("Invalid hintchars property: not a string");

    expect(() => {
      sut.validate({
        properties: {
          filetype: "typescript",
        },
      });
    }).toThrowError("Unknown property: filetype");
  });

  test("it throws an error on invalid keymaps", () => {
    expect(() => {
      sut.validate({
        keymaps: new Keymaps({
          d: { type: "harakiri", props: {} },
        }),
      });
    }).toThrowError("Unknown keymap: harakiri");

    expect(() => {
      sut.validate({
        keymaps: new Keymaps({
          D: { type: "tabs.close", props: { force: "1" } },
        }),
      });
    }).toThrowError(
      "Invalid property 'force' on keymap 'D': Expected boolean, received string",
    );
  });
});
