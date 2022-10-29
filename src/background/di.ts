/* eslint-disable max-len */

import {
  LocalSettingRepository,
  SyncSettingRepository,
} from "./repositories/SettingRepository";
import { NotifierImpl } from "./presenters/Notifier";
import { CachedSettingRepositoryImpl } from "./repositories/CachedSettingRepository";
import { Container } from "inversify";
import HistoryRepositoryImpl from "./completion/impl/HistoryRepositoryImpl";
import BookmarkRepositoryImpl from "./completion/impl/BookmarkRepositoryImpl";
import TabRepositoryImpl from "./completion/impl/TabRepositoryImpl";
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
import { CommandRegistoryFactory } from "./command";

const container = new Container({ autoBindInjectable: true });

container.bind("LocalSettingRepository").to(LocalSettingRepository);
container.bind("SyncSettingRepository").to(SyncSettingRepository);
container.bind("CachedSettingRepository").to(CachedSettingRepositoryImpl);
container.bind("Notifier").to(NotifierImpl);
container.bind("HistoryRepository").to(HistoryRepositoryImpl);
container.bind("BookmarkRepository").to(BookmarkRepositoryImpl);
container.bind("BrowserSettingRepository").to(BrowserSettingRepositoryImpl);
container.bind("RepeatRepository").to(RepeatRepositoryImpl);
container.bind("TabRepository").to(TabRepositoryImpl);
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

const commandRegistoryFactory = container.resolve<CommandRegistoryFactory>(
  CommandRegistoryFactory
);
container
  .bind("CommandRegistory")
  .toConstantValue(commandRegistoryFactory.create());

export { container };
