import React from "react";
import reducer, { defaultState } from "../reducer";

const useCompletionReducer = (defaultValue: string) => {
  const initialState = {
    ...defaultState,
    completionSource: defaultValue,
  };
  return React.useReducer(reducer, initialState);
};

export default useCompletionReducer;
