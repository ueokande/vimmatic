import reducer, {
  defaultState,
  type State,
} from "../../../src/console/app/recuer";
import {
  hide,
  showCommand,
  showError,
  showFind,
  showInfo,
} from "../../../src/console/app/actions";
import { describe, it, expect } from "vitest";

describe("app reducer", () => {
  describe("hide", () => {
    it("switches to init state", () => {
      const initialState: State = {
        mode: "info_message",
        message: "foo bar",
      };
      const nextState = reducer(initialState, hide());

      expect(nextState.mode).toBeUndefined;
    });
  });

  describe("showCommand", () => {
    it("switches to command mode with a message", () => {
      const nextState = reducer(defaultState, showCommand("open "));

      expect(nextState).toEqual({
        mode: "prompt",
        promptMode: "command",
        initValue: "open ",
      });
    });
  });

  describe("showFind", () => {
    it("switches to find mode with a message", () => {
      const nextState = reducer(defaultState, showFind());

      expect(nextState).toEqual({
        mode: "prompt",
        promptMode: "find",
        initValue: "",
      });
    });
  });

  describe("showError", () => {
    it("switches to error message mode with a message", () => {
      const nextState = reducer(defaultState, showError("error occurs"));

      expect(nextState).toEqual({
        mode: "error_message",
        message: "error occurs",
      });
    });
  });

  describe("showInfo", () => {
    it("switches to info message mode with a message", () => {
      const nextState = reducer(defaultState, showInfo("what's up"));

      expect(nextState).toEqual({
        mode: "info_message",
        message: "what's up",
      });
    });
  });
});
