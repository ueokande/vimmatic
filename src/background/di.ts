/* eslint-disable max-len */

import { Container } from "inversify";
import { LastSelectedTabImpl } from "./tabs/LastSelectedTab";
import { NotifierImpl } from "./presenters/Notifier";
import { ContentMessageClientImpl } from "./clients/ContentMessageClient";
import { NavigateClientImpl } from "./clients/NavigateClient";
import { ConsoleClientImpl } from "./clients/ConsoleClient";
import { BrowserSettingRepositoryImpl } from "./repositories/BrowserSettingRepository";
import { RepeatRepositoryImpl } from "./repositories/RepeatRepository";
import { FindClientImpl } from "./clients/FindClient";
import { ConsoleFrameClientImpl } from "./clients/ConsoleFrameClient";
import { FindRepositoryImpl } from "./repositories/FindRepository";
import { ReadyFrameRepositoryImpl } from "./repositories/ReadyFrameRepository";
import { ClipboardRepositoryImpl } from "./repositories/ClipboardRepository";
import { PropertySettingsImpl } from "./settings/PropertySettings";
import { SearchEngineSettingsImpl } from "./settings/SearchEngineSettings";
import { TransientSettingsRepotiory } from "./settings/SettingsRepository";
import { KeyCaptureClientImpl } from "./clients/KeyCaptureClient";
import { MarkRepositoryImpl } from "./repositories/MarkRepository";
import { MarkModeRepositoryImpl } from "./repositories/MarkModeRepository";
import { FollowClientImpl } from "./clients/FollowClient";
import { FollowRepositoryImpl } from "./repositories/FollowRepository";
import { FrameClientImpl } from "./clients/FrameClient";
import { TopFrameClientImpl } from "./clients/TopFrameClient";
import { PropertyRegistryFactry } from "./property";
import { CommandRegistryFactory } from "./command";
import { OperatorRegistoryFactory } from "./operators";

const container = new Container({ autoBindInjectable: true });

container.bind("LastSelectedTab").to(LastSelectedTabImpl);
container.bind("Notifier").to(NotifierImpl);
container.bind("BrowserSettingRepository").to(BrowserSettingRepositoryImpl);
container.bind("RepeatRepository").to(RepeatRepositoryImpl);
container.bind("FindRepository").to(FindRepositoryImpl);
container.bind("FindClient").to(FindClientImpl);
container.bind("ContentMessageClient").to(ContentMessageClientImpl);
container.bind("NavigateClient").to(NavigateClientImpl);
container.bind("ConsoleClient").to(ConsoleClientImpl);
container.bind("ConsoleFrameClient").to(ConsoleFrameClientImpl);
container.bind("ReadyFrameRepository").to(ReadyFrameRepositoryImpl);
container.bind("ClipboardRepository").to(ClipboardRepositoryImpl);
container.bind("PropertySettings").to(PropertySettingsImpl);
container.bind("SearchEngineSettings").to(SearchEngineSettingsImpl);
container.bind("KeyCaptureClient").to(KeyCaptureClientImpl);
container.bind("MarkRepository").to(MarkRepositoryImpl);
container.bind("MarkModeRepository").to(MarkModeRepositoryImpl);
container.bind("FollowClient").to(FollowClientImpl);
container.bind("FollowRepository").to(FollowRepositoryImpl);
container.bind("FrameClient").to(FrameClientImpl);
container.bind("TopFrameClient").to(TopFrameClientImpl);
container
  .bind("SettingsRepository")
  .to(TransientSettingsRepotiory)
  .inSingletonScope();
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
