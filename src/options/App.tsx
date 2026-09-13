import React from "react";
import styles from "./App.module.css";
import { ErrorMessage } from "./components/ErrorMessage";
import { TextArea } from "./components/TextArea";
import { useLoadSettings, useSaveSettings } from "./hooks/storage";

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
    <form className={styles.container}>
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
