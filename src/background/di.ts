/* eslint-disable max-len */

import { Container } from "inversify";
import { LastSelectedTabRepositoryImpl } from "./repositories/LastSelectedTabRepository";
import { NotifierImpl } from "./presenters/Notifier";
import { ContentMessageClientImpl } from "./clients/ContentMessageClient";
import { NavigateClientImpl } from "./clients/NavigateClient";
import { ConsoleClientImpl } from "./clients/ConsoleClient";
import {
  FirefoxBrowserSettingRepositoryImpl,
  ChromeBrowserSettingRepositoryImpl,
} from "./repositories/BrowserSettingRepository";
import { RepeatRepositoryImpl } from "./repositories/RepeatRepository";
import { FindClientImpl } from "./clients/FindClient";
import { ConsoleFrameClientImpl } from "./clients/ConsoleFrameClient";
import { FindRepositoryImpl } from "./repositories/FindRepository";
import { ReadyFrameRepositoryImpl } from "./repositories/ReadyFrameRepository";
import {
  FirefoxClipboardRepositoryImpl,
  ChromeClipboardRepositoryImpl,
} from "./repositories/ClipboardRepository";
import { PropertySettingsImpl } from "./settings/PropertySettings";
import { SearchEngineSettingsImpl } from "./settings/SearchEngineSettings";
import { SettingsRepositoryImpl } from "./settings/SettingsRepository";
import { KeyCaptureClientImpl } from "./clients/KeyCaptureClient";
import { MarkRepositoryImpl } from "./repositories/MarkRepository";
import { MarkModeRepositoryImpl } from "./repositories/MarkModeRepository";
import { FollowClientImpl } from "./clients/FollowClient";
import { FollowRepositoryImpl } from "./repositories/FollowRepository";
import { FrameClientImpl } from "./clients/FrameClient";
import { TopFrameClientImpl } from "./clients/TopFrameClient";
import { AddonEnabledRepositoryImpl } from "./repositories/AddonEnabledRepository";
import { AddonEnabledClientImpl } from "./clients/AddonEnabledClient";
import { ToolbarPresenterImpl } from "./presenters/ToolbarPresenter";
import { PropertyRegistryFactry } from "./property";
import { CommandRegistryFactory } from "./command";
import { OperatorRegistoryFactory } from "./operators";

const container = new Container({ autoBindInjectable: true });

container.bind("LastSelectedTabRepository").to(LastSelectedTabRepositoryImpl);
container.bind("Notifier").to(NotifierImpl);
container.bind("RepeatRepository").to(RepeatRepositoryImpl);
container.bind("FindRepository").to(FindRepositoryImpl);
container.bind("FindClient").to(FindClientImpl);
container.bind("ContentMessageClient").to(ContentMessageClientImpl);
container.bind("NavigateClient").to(NavigateClientImpl);
container.bind("ConsoleClient").to(ConsoleClientImpl);
container.bind("ConsoleFrameClient").to(ConsoleFrameClientImpl);
container.bind("ReadyFrameRepository").to(ReadyFrameRepositoryImpl);
if (process.env.BROWSER === "firefox") {
  container.bind("ClipboardRepository").to(FirefoxClipboardRepositoryImpl);
  container
    .bind("BrowserSettingRepository")
    .to(FirefoxBrowserSettingRepositoryImpl);
} else {
  container.bind("ClipboardRepository").to(ChromeClipboardRepositoryImpl);
  container
    .bind("BrowserSettingRepository")
    .to(ChromeBrowserSettingRepositoryImpl);
}
container.bind("PropertySettings").to(PropertySettingsImpl);
container.bind("SearchEngineSettings").to(SearchEngineSettingsImpl);
container.bind("KeyCaptureClient").to(KeyCaptureClientImpl);
container.bind("MarkRepository").to(MarkRepositoryImpl);
container.bind("MarkModeRepository").to(MarkModeRepositoryImpl);
container.bind("FollowClient").to(FollowClientImpl);
container.bind("FollowRepository").to(FollowRepositoryImpl);
container.bind("FrameClient").to(FrameClientImpl);
container.bind("TopFrameClient").to(TopFrameClientImpl);
container.bind("AddonEnabledRepository").to(AddonEnabledRepositoryImpl);
container.bind("AddonEnabledClient").to(AddonEnabledClientImpl);
container.bind("ToolbarPresenter").to(ToolbarPresenterImpl);
container.bind("SettingsRepository").to(SettingsRepositoryImpl);
container
  .bind("PropertyRegistry")
  .toConstantValue(new PropertyRegistryFactry().create());
container
  .bind("CommandRegistry")
  .toConstantValue(container.resolve(CommandRegistryFactory).create());
container
  .bind("OperatorRegistory")
  .toConstantValue(container.resolve(OperatorRegistoryFactory).create());

export { container };
