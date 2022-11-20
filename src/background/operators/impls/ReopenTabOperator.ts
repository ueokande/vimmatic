import Operator from "../Operator";

export default class ReopenTabOperator implements Operator {
  async run(): Promise<void> {
    const window = await browser.windows.getCurrent();
    const sessions = await browser.sessions.getRecentlyClosed();
    const session = sessions.find((s) => {
      return s.tab && s.tab.windowId === window.id;
    });
    if (!session) {
      return;
    }
    if (session.tab && session.tab.sessionId) {
      await browser.sessions.restore(session.tab.sessionId);
    } else if (session.window && session.window.sessionId) {
      await browser.sessions.restore(session.window.sessionId);
    }
  }
}
