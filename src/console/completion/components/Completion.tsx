import React from "react";
import styled from "styled-components";
import type CompletionsType from "../../Completions";
import useCompletionKeyBinds from "../hooks/useCompletionKeyBinds";
import useCursor from "../hooks/useCursor";
import CompletionList from "./CompletionList";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface Props {
  defaultValue: string;
  maxLineHeight: number;
  onInputChange: (newValue: string) => void;
  onInputEnter: (newValue: string) => void;
  completions: CompletionsType;
  renderInput: (attrs: InputProps) => React.ReactNode;
}

const CompletionWrapper = styled.div`
  border-top: 1px solid gray;
`;

const useSelectedValue = (
  select: number,
  flatten: Array<{ value?: string }>,
  source: string,
) => {
  return React.useMemo(() => {
    if (select === -1) {
      return source;
    } else {
      return flatten[select]?.value ?? "";
    }
  }, [select, source, flatten]);
};

const useAutoInputValue = (
  ref: React.RefObject<HTMLInputElement>,
  value: string,
) => {
  React.useEffect(() => {
    if (ref.current === null) {
      return;
    }
    ref.current.value = value;
  }, [value]);
};

const useFlatten = (completions: CompletionsType) => {
  return React.useMemo(
    () => completions.map((g) => g.items).flat(),
    [completions],
  );
};

const Completion: React.FC<Props> = ({
  defaultValue,
  renderInput,
  completions,
  maxLineHeight,
  onInputChange,
  onInputEnter,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [source, setSource] = React.useState(defaultValue);
  const flatten = useFlatten(completions);
  const { select, next, prev, reset } = useCursor(flatten.length);
  const selectedValue = useSelectedValue(select, flatten, source);
  /**
   * Setting waiting=true can delays selecting next or previous item.  If
   * waiting=true, the component enqueues a select operation until waiting
   * become false.  This prevents reset selection by asynchronous update of
   * completion.
   */
  const waiting = React.useRef(false);
  const waitingOp = React.useRef<() => unknown>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSource(text);
    reset();
    waiting.current = true;
    onInputChange(text);
  };
  React.useEffect(() => {
    if (waiting.current && typeof waitingOp.current !== "undefined") {
      waitingOp.current();
      waitingOp.current = undefined;
    } else if (!waiting.current) {
      reset();
    }
    waiting.current = false;
  }, [completions]);
  const handleKeyDown = useCompletionKeyBinds({
    onEnter(e: React.KeyboardEvent<HTMLInputElement>) {
      onInputEnter(e.currentTarget.value);
    },
    onCancel() {
      if (inputRef.current === null) {
        return;
      }
      inputRef.current.blur();
    },
    onNext: () => {
      if (waiting.current) {
        waitingOp.current = next;
      } else {
        next();
      }
    },
    onPrev: () => {
      if (waiting.current) {
        waitingOp.current = prev;
      } else {
        prev();
      }
    },
  });

  useAutoInputValue(inputRef, selectedValue);

  return (
    <CompletionWrapper>
      <CompletionList
        size={maxLineHeight}
        completions={completions}
        select={select}
      />
      {renderInput({
        ref: inputRef,
        onKeyDown: handleKeyDown,
        onChange: handleChange,
      })}
    </CompletionWrapper>
  );
};

export default Completion;
