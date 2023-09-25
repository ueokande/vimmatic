import React from "react";
import { Sender } from "../../messaging";
import type {
  Schema as BackgroundMessageSchema,
  Key as BackgroundMessageKey,
  Request as BackgroundMessageRequest,
} from "../../messaging/schema/background";

export const useMessageClient = (): Sender<BackgroundMessageSchema> => {
  const sender = React.useMemo(
    () =>
      new Sender<BackgroundMessageSchema>(
        (type: BackgroundMessageKey, args: BackgroundMessageRequest) => {
          return chrome.runtime.sendMessage({
            type,
            args: args ?? {},
          });
        },
      ),
    [],
  );
  return sender;
};
