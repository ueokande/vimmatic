import React from "react";
import type { AppAction } from "./actions";
import type { State } from "./recuer";
import { defaultState } from "./recuer";

export const AppStateContext = React.createContext<State>(defaultState);

export const AppDispatchContext = React.createContext<
  (action: AppAction) => void
>(() => {});
