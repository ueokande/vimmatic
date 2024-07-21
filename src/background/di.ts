/* eslint-disable max-len */

import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import {
  BrowserSettingRepository,
  FirefoxBrowserSettingRepositoryImpl,
  ChromeBrowserSettingRepositoryImpl,
} from "./repositories/BrowserSettingRepository";
import {
  ClipboardRepository,
  FirefoxClipboardRepositoryImpl,
  ChromeClipboardRepositoryImpl,
} from "./repositories/ClipboardRepository";
import { createPropertyRegistry } from "./property";
import { CommandRegistryFactory } from "./command";
import { CommandRegistry } from "./command/CommandRegistry";
import { OperatorRegistryFactory } from "./operators";
import { OperatorRegistry } from "./operators/OperatorRegistry";
import { PropertyRegistry } from "./property/PropertyRegistry";
import "./clients/AddonEnabledClient";
import "./clients/ConsoleClient";
import "./clients/ConsoleFrameClient";
import "./clients/ContentMessageClient";
import "./clients/FindClient";
import "./clients/FrameClient";
import "./clients/HintClient";
import "./clients/ModeClient";
import "./clients/NavigateClient";
import "./clients/TopFrameClient";
import "./hint/HintActionFactory";
import "./presenters/Notifier";
import "./presenters/TabPresenter";
import "./presenters/ToolbarPresenter";
import "./repositories/AddonEnabledRepository";
import "./repositories/FindHistoryRepository";
import "./repositories/FindRepository";
import "./repositories/HintRepository";
import "./repositories/LastSelectedTabRepository";
import "./repositories/MarkRepository";
import "./repositories/ModeRepository";
import "./repositories/ReadyFrameRepository";
import "./repositories/RepeatRepository";
import "./settings/PropertySettings";
import "./settings/SearchEngineSettings";
import "./settings/SettingsRepository";
import "./settings/StyleSettings";

const container = new Container({ autoBindInjectable: true });

container.load(buildProviderModule());

if (process.env.BROWSER === "firefox") {
  container.bind(ClipboardRepository).to(FirefoxClipboardRepositoryImpl);
  container
    .bind(BrowserSettingRepository)
    .to(FirefoxBrowserSettingRepositoryImpl);
} else {
  container.bind(ClipboardRepository).to(ChromeClipboardRepositoryImpl);
  container
    .bind(BrowserSettingRepository)
    .to(ChromeBrowserSettingRepositoryImpl);
}
container.bind(PropertyRegistry).toConstantValue(createPropertyRegistry());
container
  .bind(CommandRegistry)
  .toConstantValue(container.resolve(CommandRegistryFactory).create());
container
  .bind(OperatorRegistry)
  .toConstantValue(container.resolve(OperatorRegistryFactory).create());

export { container };
