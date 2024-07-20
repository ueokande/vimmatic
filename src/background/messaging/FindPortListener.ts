import { injectable } from "inversify";

type OnConnectFunc = (port: chrome.runtime.Port) => void;
type OnDisconnectFunc = (port: chrome.runtime.Port) => void;

@injectable()
export class FindPortListener {
  constructor(
    private readonly onConnect: OnConnectFunc,
    private readonly onDisconnect: OnDisconnectFunc,
  ) {}

  run(): void {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== "vimmatic-port") {
        return;
      }

      port.onDisconnect.addListener(this.onDisconnect);
      this.onConnect(port);
    });
  }
}
