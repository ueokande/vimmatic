import React from "react";
import { newSender } from "../clients/BackgroundMessageSender";
import { ConsoleFrameClient } from "../clients/ConsoleFrameClient";

const consoleFrameClient = new ConsoleFrameClient(newSender());

export const useAutoResize = () => {
  const [prevWidth, setPrevWidth] = React.useState(-1);
  const [prevHeight, setPrevHeight] = React.useState(-1);

  React.useLayoutEffect(() => {
    const element = document.getElementById("vimmatic-console");
    if (element === null) {
      return;
    }
    const { scrollWidth: width, scrollHeight: height } = element;
    if (width === prevWidth && height === prevHeight) {
      return;
    }

    consoleFrameClient.resize(width, height);
    setPrevWidth(width);
    setPrevHeight(height);
  });
};
