/* eslint-disable max-len */

import { NotifierImpl } from "./presenters/Notifier";
import { Container } from "inversify";
import { TabPresenterImpl } from "./presenters/TabPresenter";
import { OperatorFactoryImpl } from "./operators/impls/OperatorFactoryImpl";
import { NavigateClientImpl } from "./clients/NavigateClient";
import { ConsoleClientImpl } from "./infrastructures/ConsoleClient";
import { BrowserSettingRepositoryImpl } from "./repositories/BrowserSettingRepository";
import { RepeatRepositoryImpl } from "./repositories/RepeatRepository";
import { ZoomPresenterImpl } from "./presenters/ZoomPresenter";
import { WindowPresenterImpl } from "./presenters/WindowPresenter";
import { FindClientImpl } from "./clients/FindClient";
import { ConsoleFrameClientImpl } from "./clients/ConsoleFrameClient";
import { FindRepositoryImpl } from "./repositories/FindRepository";
import { ReadyFrameRepositoryImpl } from "./repositories/ReadyFrameRepository";
import { PropertySettingsImpl } from "./settings/PropertySettings";
import { SearchEngineSettingsImpl } from "./settings/SearchEngineSettings";
import { TransientSettingsRepotiory } from "./settings/SettingsRepository";
import { PropertyRegistryFactry } from "./property";
import { CommandRegistryFactory } from "./command";

const container = new Container({ autoBindInjectable: true });

container.bind("Notifier").to(NotifierImpl);
container.bind("BrowserSettingRepository").to(BrowserSettingRepositoryImpl);
container.bind("RepeatRepository").to(RepeatRepositoryImpl);
container.bind("ZoomPresenter").to(ZoomPresenterImpl);
container.bind("TabPresenter").to(TabPresenterImpl);
container.bind("WindowPresenter").to(WindowPresenterImpl);
container.bind("FindRepository").to(FindRepositoryImpl);
container.bind("FindClient").to(FindClientImpl);
container.bind("NavigateClient").to(NavigateClientImpl);
container.bind("ConsoleClient").to(ConsoleClientImpl);
container.bind("ConsoleFrameClient").to(ConsoleFrameClientImpl);
container.bind("OperatorFactory").to(OperatorFactoryImpl);
container.bind("ReadyFrameRepository").to(ReadyFrameRepositoryImpl);
container.bind("PropertySettings").to(PropertySettingsImpl);
container.bind("SearchEngineSettings").to(SearchEngineSettingsImpl);
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

export { container };
