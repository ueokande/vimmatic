import Completions from "../Completions";

type Action =
  | { type: "set.completion.source"; completionSource: string }
  | { type: "set.completions"; completions: Completions }
  | { type: "select.next.completion" }
  | { type: "select.prev.completion" };

export interface State {
  completionSource: string;
  completions: Completions;
  select: number;
}

export const defaultState = {
  completionSource: "",
  completions: [],
  select: -1,
};

const nextSelection = (state: State): number => {
  const length = state.completions
    .map((g) => g.items.length)
    .reduce((x, y) => x + y, 0);
  if (length === 0) {
    return -1;
  }
  if (state.select < 0) {
    return 0;
  }
  if (state.select + 1 < length) {
    return state.select + 1;
  }
  return -1;
};

const prevSelection = (state: State): number => {
  if (state.completions.length === 0) {
    return -1;
  }
  const length = state.completions
    .map((g) => g.items.length)
    .reduce((x, y) => x + y);
  if (state.select < 0) {
    return length - 1;
  }
  return state.select - 1;
};

// eslint-disable-next-line max-lines-per-function
export default function reducer(
  state: State = defaultState,
  action: Action
): State {
  switch (action.type) {
    case "set.completion.source":
      return {
        ...state,
        completionSource: action.completionSource,
        select: -1,
      };
    case "set.completions":
      return {
        ...state,
        completions: action.completions,
      };
    case "select.next.completion": {
      const select = nextSelection(state);
      return {
        ...state,
        select: select,
      };
    }
    case "select.prev.completion": {
      const select = prevSelection(state);
      return {
        ...state,
        select: select,
      };
    }
    default:
      return state;
  }
}
