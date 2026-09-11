import React from "react";
import { Sender } from "../../messaging";
import type {
  Key as BackgroundMessageKey,
  Request as BackgroundMessageRequest,
  Schema as BackgroundMessageSchema,
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
