import { injectable, inject } from "inversify";
import TabPresenter from "../presenters/TabPresenter";
import Notifier from "../presenters/Notifier";

@injectable()
export default class VersionUseCase {
  constructor(
    @inject("TabPresenter") private tabPresenter: TabPresenter,
    @inject("Notifier") private notifier: Notifier
  ) {}

  notify(): Promise<void> {
    const manifest = browser.runtime.getManifest();
    const url = this.releaseNoteUrl(manifest.version);
    return this.notifier.notifyUpdated(manifest.version, () => {
      this.tabPresenter.create(url);
    });
  }

  releaseNoteUrl(version?: string): string {
    if (version) {
      return `https://github.com/ueokande/vimmatic/releases/tag/v${version}`;
    }
    return "https://github.com/ueokande/vimmatic/releases/";
  }
}
