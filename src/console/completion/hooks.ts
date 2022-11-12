import React from "react";
import * as actions from "./actions";
import { CompletionStateContext, CompletionDispatchContext } from "./context";
import CompletionClient from "../clients/CompletionClient";
import { newSender } from "../clients/BackgroundMessageSender";

const completionClient = new CompletionClient(newSender());

export const useCompletions = (source: string) => {
  const state = React.useContext(CompletionStateContext);
  const dispatch = React.useContext(CompletionDispatchContext);
  const [loading, setLoading] = React.useState(false);

  const queryCompletions = React.useCallback(
    (text: string) => {
      setLoading(true);
      completionClient.getCompletions(text).then((completions) => {
        dispatch(actions.setCompletions(completions));
        setLoading(false);
      });
    },
    [dispatch, source]
  );

  React.useEffect(() => {
    dispatch(actions.setCompletionSource(source));
    queryCompletions(source);
  }, [source]);

  return { completions: state.completions, loading };
};

export const useSelectCompletion = () => {
  const state = React.useContext(CompletionStateContext);
  const dispatch = React.useContext(CompletionDispatchContext);
  const next = React.useCallback(
    () => dispatch(actions.selectNext()),
    [dispatch]
  );
  const prev = React.useCallback(
    () => dispatch(actions.selectPrev()),
    [dispatch]
  );
  const currentValue = React.useMemo(() => {
    if (state.select < 0) {
      return state.completionSource;
    }
    const items = state.completions.map((g) => g.items).flat();
    return items[state.select]?.value || "";
  }, [state.completionSource, state.select, state.completions]);

  return {
    select: state.select,
    currentValue,
    selectNext: next,
    selectPrev: prev,
  };
};
