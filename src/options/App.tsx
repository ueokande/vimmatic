import React from "react";
import stylex from "@stylexjs/stylex";
import { useLoadSettings, useSaveSettings } from "./hooks/storage";
import { TextArea } from "./components/TextArea";
import { ErrorMessage } from "./components/ErrorMessage";

const styles = stylex.create({
  container: {
    padding: "2px",
    fontFamily: "system-ui",
    minWidth: "480px",
    maxWidth: "90wv",
  },
});

export const App: React.FC = () => {
  const { data: loadedValue, loading, error: loadError } = useLoadSettings();
  const { save, error: saveError } = useSaveSettings();
  const [jsonText, setJsonText] = React.useState("");
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setJsonText(e.target.value);
    },
    [setJsonText],
  );

  const onBlur = React.useCallback(() => {
    save(jsonText);
  }, [jsonText, save]);

  React.useEffect(() => {
    if (typeof loadedValue !== "undefined") {
      setJsonText(loadedValue);
    }
  }, [loadedValue]);

  if (loading) {
    return null;
  }

  return (
    <form {...stylex.props(styles.container)}>
      <h1>Configure Vimmatic</h1>
      <p>
        See{" "}
        <a
          target="_blank"
          href="https://ueokande.github.io/vimmatic/"
          rel="noreferrer"
        >
          official document
        </a>{" "}
        for more details.
      </p>
      <div>
        <TextArea
          name="text"
          onChange={onChange}
          onBlur={onBlur}
          value={jsonText}
        />
        <ErrorMessage error={loadError || saveError} />
      </div>
    </form>
  );
};
