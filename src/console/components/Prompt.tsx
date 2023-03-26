import React, { InputHTMLAttributes } from "react";
import { Completion } from "../completion";
import type CompletionsType from "../Completions";
import PromptInput from "./PromptInput";
import useDebounce from "../hooks/useDebounce";
import useAutoResize from "../hooks/useAutoResize";
import { useVisibility } from "../app/hooks";

const COMPLETION_MAX_ITEMS = 33;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  initValue: string;
  prefix: string;
  onExec: (value: string) => void;
  queryCompletions?: (query: string) => Promise<CompletionsType>;
}

const Prompt: React.FC<Props> = ({
  initValue,
  prefix,
  onExec,
  queryCompletions,
}) => {
  const { hide } = useVisibility();
  const [inputValue, setInputValue] = React.useState(initValue);
  const debouncedValue = useDebounce(inputValue, 100);
  const [completions, setCompletions] = React.useState<CompletionsType>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleInputChange = React.useCallback((newValue: string) => {
    setInputValue(newValue);
  }, []);

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
      maxLineHeight={COMPLETION_MAX_ITEMS}
      completions={completions}
      onInputChange={handleInputChange}
      onInputEnter={onExec}
      defaultValue={initValue}
      renderInput={(inputProps) => (
        <PromptInput
          prefix={prefix}
          onBlur={hide}
          autoFocus={true}
          {...inputProps}
        />
      )}
    />
  );
};

export default Prompt;
