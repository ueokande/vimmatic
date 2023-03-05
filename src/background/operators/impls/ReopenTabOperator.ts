import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class ReopenTabOperator implements Operator {
  name() {
    return "tabs.reopen";
  }

  schema() {}

  async run(): Promise<void> {
    const window = await chrome.windows.getCurrent();
    const sessions = await chrome.sessions.getRecentlyClosed();
    const session = sessions.find((s) => {
      return s.tab && s.tab.windowId === window.id;
    });
    if (!session) {
      return;
    }
    if (session.tab && session.tab.sessionId) {
      await chrome.sessions.restore(session.tab.sessionId);
    } else if (session.window && session.window.sessionId) {
      await chrome.sessions.restore(session.window.sessionId);
    }
  }
}
