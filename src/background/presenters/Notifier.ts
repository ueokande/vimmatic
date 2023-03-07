import { injectable } from "inversify";

const NOTIFICATION_ID_UPDATE = "vimmatic-update";
const NOTIFICATION_ID_INVALID_SETTINGS = "vimmatic-update-invalid-settings";

export default interface Notifier {
  notifyUpdated(version: string, onclick: () => void): Promise<void>;

  notifyInvalidSettings(error: Error, onclick: () => void): Promise<void>;
}

@injectable()
export class NotifierImpl implements NotifierImpl {
  async notifyUpdated(version: string, onclick: () => void): Promise<void> {
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

  async notifyInvalidSettings(
    error: Error,
    onclick: () => void
  ): Promise<void> {
    const title = `Loading settings failed`;
    // eslint-disable-next-line max-len
    const message = `The default settings are used due to the last saved settings is invalid.  Check your current settings from the add-on preference: ${error.message}`;

    const listener = (id: string) => {
      if (id !== NOTIFICATION_ID_INVALID_SETTINGS) {
        return;
      }
      onclick();
      chrome.notifications.onClicked.removeListener(listener);
    };
    chrome.notifications.onClicked.addListener(listener);

    chrome.notifications.create(NOTIFICATION_ID_INVALID_SETTINGS, {
      type: "basic",
      iconUrl: chrome.extension.getURL("resources/icon_48x48.png"),
      title,
      message,
    });
  }
}
