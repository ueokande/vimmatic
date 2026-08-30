import { provide } from "inversify-binding-decorators";

const NOTIFICATION_ID_UPDATE = "vimmatic-update";

export interface Notifier {
  notifyUpdated(version: string, onclick: () => void): Promise<void>;
}

export const Notifier = Symbol("Notifier");

@provide(Notifier)
export class NotifierImpl implements NotifierImpl {
  async notifyUpdated(version: string, onclick: () => void): Promise<void> {
    const hasPermission = await chrome.permissions.contains({
      permissions: ["notifications"],
    });
    if (!hasPermission) {
      return;
    }

    const title = `Vimmatic ${version} has been installed`;
    const message = "Click here to see release notes";

    const listener = (id: string) => {
      if (id !== NOTIFICATION_ID_UPDATE) {
        return;
      }
      onclick();
      chrome.notifications.onClicked.removeListener(listener);
    };
    chrome.notifications.onClicked.addListener(listener);

    chrome.notifications.create(NOTIFICATION_ID_UPDATE, {
      type: "basic",
      iconUrl: chrome.runtime.getURL("resources/icon_48x48.png"),
      title,
      message,
    });
  }
}
