import React from "react";
import { serialize, deserialize, defaultJSONSettings } from "../../settings";
import { useMessageClient } from "./client";

type SaveFn = (value: string) => void;

const useValidate = () => {
  const client = useMessageClient();
  const validate = React.useCallback(
    async (jsonText: string) => {
      const settings = deserialize(JSON.parse(jsonText));
      const { error } = await client.send("settings.validate", {
        settings: serialize(settings),
      });
      if (typeof error !== "undefined") {
        throw new Error(error);
      }
      return settings;
    },
    [client]
  );

  return validate;
};

const useLoad = (): [string, Error | undefined] => {
  const [error, setError] = React.useState<Error>();
  const [jsonText, setJsonText] = React.useState(defaultJSONSettings);
  React.useEffect(() => {
    (async () => {
      const { settings_json } = await chrome.storage.sync.get("settings_json");
      if (typeof settings_json === "undefined") {
        return;
      }
      setJsonText(settings_json);
      setError(undefined);
    })().catch(setError);
  }, [setJsonText]);
  return [jsonText, error];
};

const useSave = (): [SaveFn, Error | undefined] => {
  const [error, setError] = React.useState<Error>();
  const validate = useValidate();
  const save = React.useCallback(
    (newJsonText: string) => {
      (async () => {
        const settings = await validate(newJsonText);
        await chrome.storage.sync.set({
          settings: serialize(settings),
          settings_json: newJsonText,
        });
        setError(undefined);
      })().catch(setError);
    },
    [validate, setError]
  );
  return [save, error];
};

export const useStorage = (): [string, Error | undefined, SaveFn] => {
  const [jsonText, loadError] = useLoad();
  const [save, saveError] = useSave();
  const error = React.useMemo(
    () => loadError || saveError,
    [loadError, saveError]
  );

  return [jsonText, error, save];
};
