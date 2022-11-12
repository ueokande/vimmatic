import Validator from "../../../src/background/settings/Validator";
import { PropertyRegistryFactry } from "../../../src/background/property";
import Search from "../../../src/shared/Search";

describe("Validator", () => {
  const sut = new Validator(new PropertyRegistryFactry().create());

  test("it do nothing on valid settings", () => {
    sut.validate({});
    sut.validate({
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

  test("it throws an error on invalid settings", () => {
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
});
