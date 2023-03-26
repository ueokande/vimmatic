import reducer, { defaultState, State } from "../../../src/console/app/recuer";
import {
  hide,
  showCommand,
  showError,
  showFind,
  showInfo,
} from "../../../src/console/app/actions";

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

      expect(nextState.mode).toEqual("prompt");
      expect(nextState.promptMode).toEqual("command");
      expect(nextState.initValue).toEqual("open ");
    });
  });

  describe("showFind", () => {
    it("switches to find mode with a message", () => {
      const nextState = reducer(defaultState, showFind());

      expect(nextState.mode).toEqual("prompt");
      expect(nextState.promptMode).toEqual("find");
      expect(nextState.initValue).toEqual("");
    });
  });

  describe("showError", () => {
    it("switches to error message mode with a message", () => {
      const nextState = reducer(defaultState, showError("error occurs"));

      expect(nextState.mode).toEqual("error_message");
      expect(nextState.message).toEqual("error occurs");
    });
  });

  describe("showInfo", () => {
    it("switches to info message mode with a message", () => {
      const nextState = reducer(defaultState, showInfo("what's up"));

      expect(nextState.mode).toEqual("info_message");
      expect(nextState.message).toEqual("what's up");
    });
  });
});
