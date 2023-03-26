import reducer, {
  defaultState,
  State,
} from "../../../src/console/completion/reducer";

describe("completion reducer", () => {
  describe("setCompletionSource", () => {
    it("sets a completion source", () => {
      const nextState = reducer(defaultState, {
        type: "set.completion.source",
        completionSource: "open ",
      });

      expect(nextState.completionSource).toEqual("open ");
    });
  });

  describe("setCompletions", () => {
    it("sets completions", () => {
      const nextState = reducer(defaultState, {
        type: "set.completions",
        completions: [
          {
            name: "Apple",
            items: [{}, {}],
          },
          {
            name: "Banana",
            items: [{}],
          },
        ],
      });

      expect(nextState.completions).toEqual([
        {
          name: "Apple",
          items: [{}, {}],
        },
        {
          name: "Banana",
          items: [{}],
        },
      ]);
    });
  });

  describe("selectNext", () => {
    describe("when no completion groups", () => {
      it("does nothing", () => {
        const nextState = reducer(defaultState, {
          type: "select.next.completion",
        });
        expect(nextState.select).toEqual(-1);
      });
    });

    describe("when no completion items", () => {
      it("does nothing", () => {
        const state = {
          ...defaultState,
          completions: [{ name: "apple", items: [] }],
        };
        const nextState = reducer(state, {
          type: "select.next.completion",
        });
        expect(nextState.select).toEqual(-1);
      });
    });

    describe("when completions exist", () => {
      it("selects next selection", () => {
        let state: State = {
          ...defaultState,
          select: -1,
          completions: [
            {
              name: "Apple",
              items: [{}, {}],
            },
            {
              name: "Banana",
              items: [{}],
            },
          ],
        };

        state = reducer(state, { type: "select.next.completion" });
        expect(state.select).toEqual(0);

        state = reducer(state, { type: "select.next.completion" });
        expect(state.select).toEqual(1);

        state = reducer(state, { type: "select.next.completion" });
        expect(state.select).toEqual(2);

        state = reducer(state, { type: "select.next.completion" });
        expect(state.select).toEqual(-1);
      });
    });
  });

  describe("selectPrev", () => {
    describe("when no completion groups", () => {
      it("does nothing", () => {
        const nextState = reducer(defaultState, {
          type: "select.prev.completion",
        });
        expect(nextState.select).toEqual(-1);
      });

      describe("when no completion items", () => {
        it("does nothing", () => {
          const state = {
            ...defaultState,
            completions: [{ name: "apple", items: [] }],
          };
          const nextState = reducer(state, {
            type: "select.prev.completion",
          });
          expect(nextState.select).toEqual(-1);
        });
      });
    });

    describe("when completions exist", () => {
      it("selects a previous completion", () => {
        let state: State = {
          ...defaultState,
          select: -1,
          completions: [
            {
              name: "Apple",
              items: [{}, {}],
            },
            {
              name: "Banana",
              items: [{}],
            },
          ],
        };

        state = reducer(state, { type: "select.prev.completion" });
        expect(state).toHaveProperty("select", 2);

        state = reducer(state, { type: "select.prev.completion" });
        expect(state).toHaveProperty("select", 1);

        state = reducer(state, { type: "select.prev.completion" });
        expect(state).toHaveProperty("select", 0);

        state = reducer(state, { type: "select.prev.completion" });
        expect(state).toHaveProperty("select", -1);
      });
    });
  });
});
