import React from "react";
import styled from "styled-components";
import type CompletionsType from "../../Completions";
import useCompletionReducer from "../hooks/useCompletionReducer";
import useCompletionKeyBinds from "../../hooks/useCompletionKeyBinds";
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

const Completion: React.FC<Props> = ({
  defaultValue,
  renderInput,
  completions,
  maxLineHeight,
  onInputChange,
  onInputEnter,
}) => {
  const [state, dispatch] = useCompletionReducer(defaultValue);
  const [inputValue, setInputValue] = React.useState<string>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    dispatch({ type: "set.completions", completions });
  }, [completions]);
  React.useEffect(() => {
    dispatch({
      type: "set.completion.source",
      completionSource: defaultValue ?? "",
    });
  }, [defaultValue]);

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
    onNext: () => dispatch({ type: "select.next.completion" }),
    onPrev: () => dispatch({ type: "select.prev.completion" }),
  });
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setInputValue(text);
      onInputChange(text);
    },
    [setInputValue]
  );
  const selectedValue = React.useMemo(() => {
    if (state.select < 0) {
      return state.completionSource;
    }
    const items = state.completions.map((g) => g.items).flat();
    return items[state.select]?.value || "";
  }, [state]);

  React.useEffect(() => {
    if (inputRef.current === null) {
      return;
    }
    if (state.select == -1 && typeof inputValue !== "undefined") {
      inputRef.current.value = inputValue;
    } else {
      inputRef.current.value = selectedValue;
    }
  }, [state, inputValue, selectedValue]);

  return (
    <CompletionWrapper>
      <CompletionList
        size={maxLineHeight}
        completions={state.completions}
        select={state.select}
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
