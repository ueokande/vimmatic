import * as consoleActions from "../../../src/console/app/actions";
import {
  HIDE,
  SHOW_COMMAND,
  SHOW_ERROR,
  SHOW_FIND,
  SHOW_INFO,
} from "../../../src/console/app/actions";
import { describe, it, expect } from "vitest";

describe("console actions", () => {
  describe("hide", () => {
    it("create CONSOLE_HIDE action", () => {
      const action = consoleActions.hide();
      expect(action.type).toEqual(HIDE);
    });
  });
  describe("showCommand", () => {
    it("create CONSOLE_SHOW_COMMAND action", async () => {
      const action = consoleActions.showCommand("hello");
      expect(action.type).toEqual(SHOW_COMMAND);
      expect(action.text).toEqual("hello");
    });
  });

  describe("showFind", () => {
    it("create CONSOLE_SHOW_FIND action", () => {
      const action = consoleActions.showFind();
      expect(action.type).toEqual(SHOW_FIND);
    });
  });

  describe("showError", () => {
    it("create CONSOLE_SHOW_ERROR action", () => {
      const action = consoleActions.showError("an error");
      expect(action.type).toEqual(SHOW_ERROR);
      expect(action.message).toEqual("an error");
    });
  });

  describe("showInfo", () => {
    it("create CONSOLE_SHOW_INFO action", () => {
      const action = consoleActions.showInfo("an info");
      expect(action.type).toEqual(SHOW_INFO);
      expect(action.message).toEqual("an info");
    });
  });
});
