import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PortConnector } from "../../src/content/PortConnector";

class FakePort {
  disconnected = false;
  private readonly listeners: Array<() => void> = [];
  readonly onDisconnect = {
    addListener: (cb: () => void) => {
      this.listeners.push(cb);
    },
  };

  disconnect() {
    this.disconnected = true;
  }

  // Simulate the background terminating the port.
  fireDisconnect() {
    for (const cb of this.listeners) {
      cb();
    }
  }
}

describe("PortConnector", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens a port named vimmatic-port on start", () => {
    const connect = vi.fn(
      () => new FakePort() as unknown as chrome.runtime.Port,
    );
    const connector = new PortConnector(1000, connect);

    connector.start();

    expect(connect).toHaveBeenCalledTimes(1);
    expect(connect).toHaveBeenCalledWith({ name: "vimmatic-port" });
  });

  it("reconnects after the port is disconnected", () => {
    const ports: FakePort[] = [];
    const connect = vi.fn(() => {
      const port = new FakePort();
      ports.push(port);
      return port as unknown as chrome.runtime.Port;
    });
    const connector = new PortConnector(1000, connect);

    connector.start();
    expect(connect).toHaveBeenCalledTimes(1);

    ports[0].fireDisconnect();
    // Reconnect is scheduled, not immediate.
    expect(connect).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(connect).toHaveBeenCalledTimes(2);
  });

  it("keeps reconnecting on repeated disconnects", () => {
    const ports: FakePort[] = [];
    const connect = vi.fn(() => {
      const port = new FakePort();
      ports.push(port);
      return port as unknown as chrome.runtime.Port;
    });
    const connector = new PortConnector(1000, connect);

    connector.start();
    ports[0].fireDisconnect();
    vi.advanceTimersByTime(1000);
    ports[1].fireDisconnect();
    vi.advanceTimersByTime(1000);

    expect(connect).toHaveBeenCalledTimes(3);
  });

  it("does not reconnect after stop()", () => {
    const ports: FakePort[] = [];
    const connect = vi.fn(() => {
      const port = new FakePort();
      ports.push(port);
      return port as unknown as chrome.runtime.Port;
    });
    const connector = new PortConnector(1000, connect);

    connector.start();
    connector.stop();
    expect(ports[0].disconnected).toBe(true);

    ports[0].fireDisconnect();
    vi.advanceTimersByTime(1000);
    expect(connect).toHaveBeenCalledTimes(1);
  });
});
