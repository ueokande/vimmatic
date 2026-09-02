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
      // eslint-disable-next-line no-console
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
