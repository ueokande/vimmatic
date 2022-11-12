import { injectable, inject } from "inversify";
import { SimplexReceiverWithContext } from "../../messaging";
import type { Schema as WindowMessageSchema } from "../../messaging/schema/window";
import FollowMasterController from "../controllers/FollowMasterController";
import FollowSlaveController from "../controllers/FollowSlaveController";
import ConsoleFrameController from "../controllers/ConsoleFrameController";
import WindowRequestContext from "../controllers/WindowRequestContext";

@injectable()
export default class WindowMessageListener {
  private readonly receiver: SimplexReceiverWithContext<
    WindowMessageSchema,
    WindowRequestContext
  > = new SimplexReceiverWithContext();

  constructor(
    @inject(FollowMasterController)
    followMasterController: FollowMasterController,
    @inject(FollowSlaveController)
    followSlaveController: FollowSlaveController,
    @inject(ConsoleFrameController)
    consoleFrameController: ConsoleFrameController
  ) {
    this.receiver
      .route("follow.request.count.targets")
      .to(followSlaveController.countTargets.bind(followSlaveController));
    this.receiver
      .route("follow.create.hints")
      .to(followSlaveController.createHints.bind(followSlaveController));
    this.receiver
      .route("follow.show.hints")
      .to(followSlaveController.showHints.bind(followSlaveController));
    this.receiver
      .route("follow.activate")
      .to(followSlaveController.activate.bind(followSlaveController));
    this.receiver
      .route("follow.remove.hints")
      .to(followSlaveController.clear.bind(followSlaveController));

    if (window === window.top) {
      this.receiver
        .route("console.unfocus")
        .to(consoleFrameController.unfocus.bind(consoleFrameController));
      this.receiver
        .route("follow.start")
        .to(followMasterController.followStart.bind(followMasterController));
      this.receiver
        .route("follow.response.count.targets")
        .to(
          followMasterController.responseCountTargets.bind(
            followMasterController
          )
        );
      this.receiver
        .route("follow.key.press")
        .to(followMasterController.keyPress.bind(followMasterController));
    }
  }

  listen() {
    window.addEventListener("message", (event: MessageEvent) => {
      const sender = event.source;
      if (!(sender instanceof Window)) {
        return;
      }
      let message: unknown;
      try {
        message = JSON.parse(event.data);
      } catch (e) {
        console.warn("unexpected message format:", e);
        return;
      }

      if (typeof message !== "object" && message !== null) {
        console.warn("unexpected message format:", message);
        return;
      }

      const { type, args } = message as { type: unknown; args: unknown };
      if (
        typeof type !== "string" ||
        (typeof args !== "undefined" && typeof args !== "object")
      ) {
        console.warn("unexpected message format:", message);
        return;
      }

      const ctx = { sender };
      try {
        this.receiver.receive(ctx, type, args);
      } catch (e) {
        console.error(e);
      }
    });
  }
}
