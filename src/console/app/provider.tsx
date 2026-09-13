import React from "react";
import { AppDispatchContext, AppStateContext } from "./contexts";
import { defaultState, reducer } from "./recuer";

type Props = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
