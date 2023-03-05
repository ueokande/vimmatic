import { injectable, inject } from "inversify";
import Notifier from "../presenters/Notifier";

@injectable()
export default class VersionUseCase {
  constructor(@inject("Notifier") private notifier: Notifier) {}

  notify(): Promise<void> {
    const manifest = chrome.runtime.getManifest();
    const url = this.releaseNoteUrl(manifest.version);
    return this.notifier.notifyUpdated(manifest.version, () => {
      chrome.tabs.create({ url });
    });
  }

  releaseNoteUrl(version?: string): string {
    if (version) {
      return `https://github.com/ueokande/vimmatic/releases/tag/v${version}`;
    }
    return "https://github.com/ueokande/vimmatic/releases/";
  }
}
