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
import { FindHistoryRepositoryImpl } from "./repositories/FindHistoryRepository";
import { ReadyFrameRepositoryImpl } from "./repositories/ReadyFrameRepository";
import {
  FirefoxClipboardRepositoryImpl,
  ChromeClipboardRepositoryImpl,
} from "./repositories/ClipboardRepository";
import { PropertySettingsImpl } from "./settings/PropertySettings";
import { StyleSettingsImpl } from "./settings/StyleSettings";
import { SearchEngineSettingsImpl } from "./settings/SearchEngineSettings";
import { ModeRepositoryImpl } from "./repositories/ModeRepository";
import {
  TransientSettingsRepository,
  PermanentSettingsRepository,
} from "./settings/SettingsRepository";
import { ModeClientImpl } from "./clients/ModeClient";
import { MarkRepositoryImpl } from "./repositories/MarkRepository";
import { HintClientImpl } from "./clients/HintClient";
import { HintRepositoryImpl } from "./repositories/HintRepository";
import { FrameClientImpl } from "./clients/FrameClient";
import { TopFrameClientImpl } from "./clients/TopFrameClient";
import { AddonEnabledRepositoryImpl } from "./repositories/AddonEnabledRepository";
import { AddonEnabledClientImpl } from "./clients/AddonEnabledClient";
import { ToolbarPresenterImpl } from "./presenters/ToolbarPresenter";
import { TabPresenterImpl } from "./presenters/TabPresenter";
import { createPropertyRegistry } from "./property";
import { CommandRegistryFactory } from "./command";
import { OperatorRegistoryFactory } from "./operators";
import { HintActionFactoryImpl } from "./hint/HintActionFactory";

const container = new Container({ autoBindInjectable: true });

container.bind("LastSelectedTabRepository").to(LastSelectedTabRepositoryImpl);
container.bind("Notifier").to(NotifierImpl);
container.bind("RepeatRepository").to(RepeatRepositoryImpl);
container.bind("FindRepository").to(FindRepositoryImpl);
container.bind("FindHistoryRepository").to(FindHistoryRepositoryImpl);
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
container.bind("StyleSettings").to(StyleSettingsImpl);
container.bind("SearchEngineSettings").to(SearchEngineSettingsImpl);
container.bind("ModeRepository").to(ModeRepositoryImpl);
container.bind("MarkRepository").to(MarkRepositoryImpl);
container.bind("ModeClient").to(ModeClientImpl);
container.bind("HintClient").to(HintClientImpl);
container.bind("HintRepository").to(HintRepositoryImpl);
container.bind("FrameClient").to(FrameClientImpl);
container.bind("TopFrameClient").to(TopFrameClientImpl);
container.bind("AddonEnabledRepository").to(AddonEnabledRepositoryImpl);
container.bind("AddonEnabledClient").to(AddonEnabledClientImpl);
container.bind("ToolbarPresenter").to(ToolbarPresenterImpl);
container.bind("TabPresenter").to(TabPresenterImpl);
container.bind("PermanentSettingsRepository").to(PermanentSettingsRepository);
container.bind("SettingsRepository").to(TransientSettingsRepository);
container.bind("HintActionFactory").to(HintActionFactoryImpl);
container.bind("PropertyRegistry").toConstantValue(createPropertyRegistry());
container
  .bind("CommandRegistry")
  .toConstantValue(container.resolve(CommandRegistryFactory).create());
container
  .bind("OperatorRegistory")
  .toConstantValue(container.resolve(OperatorRegistoryFactory).create());

export { container };
