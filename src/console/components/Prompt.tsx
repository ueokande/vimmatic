import React, { InputHTMLAttributes } from "react";
import Completion from "../completion";
import type CompletionsType from "../Completions";
import PromptInput from "./PromptInput";
import useDebounce from "../hooks/useDebounce";
import useAutoResize from "../hooks/useAutoResize";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  initValue: string;
  prefix: string;
  maxLineHeight: number;
  onExec: (value: string) => void;
  queryCompletions?: (query: string) => Promise<CompletionsType>;
}

const Prompt: React.FC<Props> = ({
  initValue,
  prefix,
  maxLineHeight,
  onExec,
  queryCompletions,
  ...props
}) => {
  const [inputValue, setInputValue] = React.useState(initValue);
  const debouncedValue = useDebounce(inputValue, 100);
  const [completions, setCompletions] = React.useState<CompletionsType>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (inputValue !== debouncedValue || loading) {
      return;
    }
    if (typeof queryCompletions === "undefined") {
      return;
    }

    setLoading(true);
    queryCompletions(debouncedValue).then((completions: CompletionsType) => {
      setCompletions(completions);
      setLoading(false);
    });
  }, [inputValue, debouncedValue]);

  useAutoResize();

  return (
    <Completion
      maxLineHeight={maxLineHeight}
      completions={completions}
      onInputChange={setInputValue}
      onInputEnter={onExec}
      defaultValue={initValue}
      renderInput={(inputProps) => (
        <PromptInput
          prefix={prefix}
          autoFocus={true}
          {...props}
          {...inputProps}
        />
      )}
    />
  );
};

export default Prompt;
