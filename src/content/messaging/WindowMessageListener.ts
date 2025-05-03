import { injectable, inject } from "inversify";
import { SimplexReceiverWithContext } from "../../messaging";
import type { Schema as WindowMessageSchema } from "../../messaging/schema/window";
import { ConsoleFrameController } from "../controllers/ConsoleFrameController";
import { TopFrameController } from "../controllers/TopFrameController";
import type { WindowRequestContext } from "../controllers/types";

@injectable()
export class WindowMessageListener {
  private readonly receiver: SimplexReceiverWithContext<
    WindowMessageSchema,
    WindowRequestContext
  > = new SimplexReceiverWithContext();

  constructor(
    @inject(ConsoleFrameController)
    consoleFrameController: ConsoleFrameController,
    @inject(TopFrameController)
    topFrameController: TopFrameController,
  ) {
    this.receiver
      .route("console.unfocus")
      .to(consoleFrameController.unfocus.bind(consoleFrameController));
    this.receiver
      .route("console.ready")
      .to(consoleFrameController.ready.bind(consoleFrameController));
    this.receiver
      .route("notify.frame.id")
      .to(topFrameController.saveChildFrame.bind(topFrameController));
  }

  listen() {
    window.addEventListener("message", (event: MessageEvent) => {
      const sender = event.source;
      if (
        sender === null ||
        sender instanceof MessagePort ||
        // ServiceWorker is not defined on about:blank
        (typeof ServiceWorker !== "undefined" &&
          sender instanceof ServiceWorker)
      ) {
        return;
      }
      let message: unknown;
      try {
        message = JSON.parse(event.data);
      } catch {
        // ignore unexpected message
        return;
      }

      if (typeof message !== "object" && message !== null) {
        return;
      }

      const { type, args } = message as { type: unknown; args: unknown };
      if (
        typeof type !== "string" ||
        (typeof args !== "undefined" && typeof args !== "object")
      ) {
        // ignore unexpected message
        return;
      }

      const ctx = { sender: sender as Window };
      try {
        this.receiver.receive(ctx, type, args);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    });
  }
}
