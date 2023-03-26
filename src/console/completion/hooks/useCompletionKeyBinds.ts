import React from "react";

type EventFn<E = Element> = (e: React.KeyboardEvent<E>) => void;
type Props<E> = {
  onEnter: EventFn<E>;
  onNext: EventFn<E>;
  onPrev: EventFn<E>;
  onCancel: EventFn<E>;
};

const useCompletionKeyBinds = <E extends Element = Element>({
  onEnter,
  onNext,
  onPrev,
  onCancel,
}: Props<E>) => {
  const isCancelKey = React.useCallback(
    (e: React.KeyboardEvent<E>) =>
      e.key === "Escape" ||
      (e.ctrlKey && e.key === "[") ||
      (e.ctrlKey && e.key === "c"),
    []
  );

  const isNextKey = React.useCallback(
    (e: React.KeyboardEvent<E>) =>
      (!e.shiftKey && e.key === "Tab") || (e.ctrlKey && e.key === "n"),
    []
  );

  const isPrevKey = React.useCallback(
    (e: React.KeyboardEvent<E>) =>
      (e.shiftKey && e.key === "Tab") || (e.ctrlKey && e.key === "p"),
    []
  );

  const isEnterKey = React.useCallback(
    (e: React.KeyboardEvent<E>) =>
      e.key === "Enter" || (e.ctrlKey && e.key === "m"),
    []
  );

  const onKeyDown = (e: React.KeyboardEvent<E>) => {
    if (isCancelKey(e)) {
      onCancel(e);
    } else if (isEnterKey(e)) {
      onEnter(e);
    } else if (isNextKey(e)) {
      onNext(e);
    } else if (isPrevKey(e)) {
      onPrev(e);
    } else {
      return;
    }

    e.stopPropagation();
    e.preventDefault();
  };

  return onKeyDown;
};

export default useCompletionKeyBinds;
