import React from "react";
import ConsoleFrameClient from "../clients/ConsoleFrameClient";
import { newSender } from "../clients/BackgroundMessageSender";

const consoleFrameClient = new ConsoleFrameClient(newSender());

const useAutoResize = () => {
  const [prevWidth, setPrevWidth] = React.useState(-1);
  const [prevHeight, setPrevHeight] = React.useState(-1);

  React.useLayoutEffect(() => {
    const element = document.getElementById("vimmatic-console");
    if (element === null) {
      return;
    }
    const { scrollWidth: width, scrollHeight: height } = element;
    consoleFrameClient.resize(width, height);

    if (width === prevWidth && height === prevHeight) {
      return;
    }

    setPrevWidth(width);
    setPrevHeight(height);
  });
};

export default useAutoResize;
