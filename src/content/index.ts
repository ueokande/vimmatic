import "reflect-metadata";
import { Application } from "./Application";
import { Bootstrap } from "./Bootstrap";
import { container } from "./di";

const initDom = () => {
  (async () => {
    try {
      const app = container.get(Application);
      await app.init();
    } catch (e) {
      // biome-ignore lint/suspicious/noConsole: intentional debug logging
      console.error(e);
    }
  })();
};

const bootstrap = new Bootstrap();
if (bootstrap.isReady()) {
  initDom();
} else {
  bootstrap.waitForReady(() => initDom());
}
