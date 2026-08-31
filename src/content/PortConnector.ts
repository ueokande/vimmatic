const PORT_NAME = "vimmatic-port";
const RECONNECT_DELAY_MS = 1000;

// PortConnector keeps a long-lived `chrome.runtime.connect` port open toward the
// background script.  The port itself carries no data; it is only a liveness
// signal so the background can learn this frame's frame ID (via
// `port.sender.frameId`) and detect when the frame goes away.
//
// On Manifest V3 the background runs as a terminable service worker (Chrome) or
// non-persistent event page (Firefox).  When it is terminated the port is
// disconnected on this side too.  Without reconnecting, the background would
// never re-learn this frame after it restarts, so features silently stop
// working until a full page reload.  This class reconnects on disconnect so the
// frame re-registers itself with a freshly started background.
export class PortConnector {
  private port?: chrome.runtime.Port;
  private disposed = false;
  private reconnectTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly delayMs: number = RECONNECT_DELAY_MS,
    private readonly connect: (
      connectInfo: chrome.runtime.ConnectInfo,
    ) => chrome.runtime.Port = (connectInfo) =>
      chrome.runtime.connect(connectInfo),
  ) {}

  start(): void {
    this.disposed = false;
    this.open();
  }

  stop(): void {
    this.disposed = true;
    if (typeof this.reconnectTimer !== "undefined") {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    this.port?.disconnect();
    this.port = undefined;
  }

  private open(): void {
    if (this.disposed) {
      return;
    }

    const port = this.connect({ name: PORT_NAME });
    this.port = port;
    port.onDisconnect.addListener(() => this.onDisconnect(port));
  }

  private onDisconnect(port: chrome.runtime.Port): void {
    // Ignore stale disconnects from a port we have already replaced.
    if (this.port !== port || this.disposed) {
      return;
    }
    this.port = undefined;
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.disposed || typeof this.reconnectTimer !== "undefined") {
      return;
    }
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.open();
    }, this.delayMs);
  }
}
