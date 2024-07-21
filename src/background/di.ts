/* eslint-disable max-len */

import { Container } from "inversify";
import {
  LastSelectedTabRepository,
  LastSelectedTabRepositoryImpl,
} from "./repositories/LastSelectedTabRepository";
import { Notifier, NotifierImpl } from "./presenters/Notifier";
import {
  ContentMessageClient,
  ContentMessageClientImpl,
} from "./clients/ContentMessageClient";
import { NavigateClient, NavigateClientImpl } from "./clients/NavigateClient";
import { ConsoleClient, ConsoleClientImpl } from "./clients/ConsoleClient";
import {
  BrowserSettingRepository,
  FirefoxBrowserSettingRepositoryImpl,
  ChromeBrowserSettingRepositoryImpl,
} from "./repositories/BrowserSettingRepository";
import {
  RepeatRepository,
  RepeatRepositoryImpl,
} from "./repositories/RepeatRepository";
import { FindClient, FindClientImpl } from "./clients/FindClient";
import {
  ConsoleFrameClient,
  ConsoleFrameClientImpl,
} from "./clients/ConsoleFrameClient";
import {
  FindRepository,
  FindRepositoryImpl,
} from "./repositories/FindRepository";
import {
  FindHistoryRepository,
  FindHistoryRepositoryImpl,
} from "./repositories/FindHistoryRepository";
import {
  ReadyFrameRepository,
  ReadyFrameRepositoryImpl,
} from "./repositories/ReadyFrameRepository";
import {
  ClipboardRepository,
  FirefoxClipboardRepositoryImpl,
  ChromeClipboardRepositoryImpl,
} from "./repositories/ClipboardRepository";
import {
  PropertySettings,
  PropertySettingsImpl,
} from "./settings/PropertySettings";
import { StyleSettings, StyleSettingsImpl } from "./settings/StyleSettings";
import {
  SearchEngineSettings,
  SearchEngineSettingsImpl,
} from "./settings/SearchEngineSettings";
import {
  ModeRepository,
  ModeRepositoryImpl,
} from "./repositories/ModeRepository";
import {
  SettingsRepository,
  PermanentSettingsRepository,
  TransientSettingsRepositoryImpl,
  PermanentSettingsRepositoryImpl,
} from "./settings/SettingsRepository";
import { ModeClient, ModeClientImpl } from "./clients/ModeClient";
import {
  MarkRepository,
  MarkRepositoryImpl,
} from "./repositories/MarkRepository";
import { HintClient, HintClientImpl } from "./clients/HintClient";
import {
  HintRepository,
  HintRepositoryImpl,
} from "./repositories/HintRepository";
import { FrameClient, FrameClientImpl } from "./clients/FrameClient";
import { TopFrameClient, TopFrameClientImpl } from "./clients/TopFrameClient";
import {
  AddonEnabledRepository,
  AddonEnabledRepositoryImpl,
} from "./repositories/AddonEnabledRepository";
import {
  AddonEnabledClient,
  AddonEnabledClientImpl,
} from "./clients/AddonEnabledClient";
import {
  ToolbarPresenter,
  ToolbarPresenterImpl,
} from "./presenters/ToolbarPresenter";
import { TabPresenter, TabPresenterImpl } from "./presenters/TabPresenter";
import { createPropertyRegistry } from "./property";
import { PropertyRegistry } from "./property/PropertyRegistry";
import { CommandRegistryFactory } from "./command";
import { CommandRegistry } from "./command/CommandRegistry";
import { OperatorRegistryFactory } from "./operators";
import { OperatorRegistry } from "./operators/OperatorRegistry";
import {
  HintActionFactory,
  HintActionFactoryImpl,
} from "./hint/HintActionFactory";

const container = new Container({ autoBindInjectable: true });

container.bind(LastSelectedTabRepository).to(LastSelectedTabRepositoryImpl);
container.bind(Notifier).to(NotifierImpl);
container.bind(RepeatRepository).to(RepeatRepositoryImpl);
container.bind(FindRepository).to(FindRepositoryImpl);
container.bind(FindHistoryRepository).to(FindHistoryRepositoryImpl);
container.bind(FindClient).to(FindClientImpl);
container.bind(ContentMessageClient).to(ContentMessageClientImpl);
container.bind(NavigateClient).to(NavigateClientImpl);
container.bind(ConsoleClient).to(ConsoleClientImpl);
container.bind(ConsoleFrameClient).to(ConsoleFrameClientImpl);
container.bind(ReadyFrameRepository).to(ReadyFrameRepositoryImpl);
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
container.bind(PropertySettings).to(PropertySettingsImpl);
container.bind(StyleSettings).to(StyleSettingsImpl);
container.bind(SearchEngineSettings).to(SearchEngineSettingsImpl);
container.bind(ModeRepository).to(ModeRepositoryImpl);
container.bind(MarkRepository).to(MarkRepositoryImpl);
container.bind(ModeClient).to(ModeClientImpl);
container.bind(HintClient).to(HintClientImpl);
container.bind(HintRepository).to(HintRepositoryImpl);
container.bind(FrameClient).to(FrameClientImpl);
container.bind(TopFrameClient).to(TopFrameClientImpl);
container.bind(AddonEnabledRepository).to(AddonEnabledRepositoryImpl);
container.bind(AddonEnabledClient).to(AddonEnabledClientImpl);
container.bind(ToolbarPresenter).to(ToolbarPresenterImpl);
container.bind(TabPresenter).to(TabPresenterImpl);
container.bind(PermanentSettingsRepository).to(PermanentSettingsRepositoryImpl);
container.bind(SettingsRepository).to(TransientSettingsRepositoryImpl);
container.bind(HintActionFactory).to(HintActionFactoryImpl);
container.bind(PropertyRegistry).toConstantValue(createPropertyRegistry());
container
  .bind(CommandRegistry)
  .toConstantValue(container.resolve(CommandRegistryFactory).create());
container
  .bind(OperatorRegistry)
  .toConstantValue(container.resolve(OperatorRegistryFactory).create());

export { container };
