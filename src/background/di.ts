/* eslint-disable max-len */

import {
  LocalSettingRepository,
  SyncSettingRepository,
} from "./repositories/SettingRepository";
import { NotifierImpl } from "./presenters/Notifier";
import { CachedSettingRepositoryImpl } from "./repositories/CachedSettingRepository";
import { container } from "tsyringe";
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

container.register("LocalSettingRepository", {
  useClass: LocalSettingRepository,
});
container.register("SyncSettingRepository", {
  useClass: SyncSettingRepository,
});
container.register("CachedSettingRepository", {
  useClass: CachedSettingRepositoryImpl,
});
container.register("Notifier", { useClass: NotifierImpl });
container.register("HistoryRepository", { useClass: HistoryRepositoryImpl });
container.register("BookmarkRepository", { useClass: BookmarkRepositoryImpl });
container.register("BrowserSettingRepository", {
  useClass: BrowserSettingRepositoryImpl,
});
container.register("RepeatRepository", { useClass: RepeatRepositoryImpl });
container.register("TabRepository", { useClass: TabRepositoryImpl });
container.register("ZoomPresenter", { useClass: ZoomPresenterImpl });
container.register("TabPresenter", { useClass: TabPresenterImpl });
container.register("WindowPresenter", { useClass: WindowPresenterImpl });
container.register("FindRepository", { useClass: FindRepositoryImpl });
container.register("FindClient", { useClass: FindClientImpl });
container.register("NavigateClient", { useClass: NavigateClientImpl });
container.register("ConsoleClient", { useClass: ConsoleClientImpl });
container.register("ConsoleFrameClient", { useClass: ConsoleFrameClientImpl });
container.register("OperatorFactory", { useClass: OperatorFactoryImpl });
container.register("ReadyFrameRepository", {
  useClass: ReadyFrameRepositoryImpl,
});
