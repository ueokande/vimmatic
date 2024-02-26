import React from "react";
import { type State, defaultState } from "./recuer";
import type { AppAction } from "./actions";

export const AppStateContext = React.createContext<State>(defaultState);

export const AppDispatchContext = React.createContext<
  (action: AppAction) => void
>(() => {});
