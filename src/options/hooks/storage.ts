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
    [client],
  );

  return validate;
};

export const useLoadSettings = (): {
  data?: string;
  loading: boolean;
  error?: Error;
} => {
  const [error, setError] = React.useState<Error>();
  const [loading, setLoading] = React.useState(true);
  const [jsonText, setJsonText] = React.useState<string>();
  React.useEffect(() => {
    (async () => {
      const { settings_json } = await chrome.storage.sync.get("settings_json");
      setJsonText(settings_json ?? defaultJSONSettings);
      setError(undefined);
    })()
      .catch((err) => {
        setJsonText(undefined);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setJsonText]);
  return { data: jsonText, loading, error };
};

export const useSaveSettings = (): {
  loading: boolean;
  error?: Error;
  save: SaveFn;
} => {
  const [error, setError] = React.useState<Error>();
  const [loading, setLoading] = React.useState(false);
  const validate = useValidate();
  const save = React.useCallback(
    (newJsonText: string) => {
      setLoading(true);
      (async () => {
        const settings = await validate(newJsonText);
        await chrome.storage.sync.set({
          settings: serialize(settings),
          settings_json: newJsonText,
        });
        setError(undefined);
      })()
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [validate, setError],
  );
  return { save, error, loading };
};
