/* eslint-disable max-len */

import { AddonEnabledRepositoryImpl } from "./repositories/AddonEnabledRepository";
import { AddressRepositoryImpl } from "./repositories/AddressRepository";
import { ClipboardRepositoryImpl } from "./repositories/ClipboardRepository";
import { ConsoleClientImpl } from "./client/ConsoleClient";
import { ConsoleFramePresenterImpl } from "./presenters/ConsoleFramePresenter";
import { FocusPresenterImpl } from "./presenters/FocusPresenter";
import { FollowPresenterImpl } from "./presenters/FollowPresenter";
import { KeymapRepositoryImpl } from "./repositories/KeymapRepository";
import { NavigationPresenterImpl } from "./presenters/NavigationPresenter";
import { OperationClientImpl } from "./client/OperationClient";
import { ScrollPresenterImpl } from "./presenters/ScrollPresenter";
import { SettingClientImpl } from "./client/SettingClient";
import { SettingRepositoryImpl } from "./repositories/SettingRepository";
import { TabsClientImpl } from "./client/TabsClient";
import { FindPresenterImpl } from "./presenters/FindPresenter";
import { BackgroundKeyClientImpl } from "./client/BackgroundKeyClient";
import { KeyCaptureModeRepositoryImpl } from "./repositories/KeyCaptureModeRepository";
import { TopFrameClientImpl } from "./client/TopFrameClient";
import { FrameIdRepositoryImpl } from "./repositories/FrameIdRepository";
import { Container } from "inversify";
import { newSender as newBackgroundMessageSender } from "./client/BackgroundMessageSender";
import { newSender as newWindowMessageSender } from "./client/WindowMessageSender";

const container = new Container({ autoBindInjectable: true });

container.bind("AddonEnabledRepository").to(AddonEnabledRepositoryImpl);
container.bind("AddressRepository").to(AddressRepositoryImpl);
container.bind("ClipboardRepository").to(ClipboardRepositoryImpl);
container.bind("ConsoleClient").to(ConsoleClientImpl);
container.bind("ConsoleFramePresenter").to(ConsoleFramePresenterImpl);
container.bind("FocusPresenter").to(FocusPresenterImpl);
container.bind("FollowPresenter").to(FollowPresenterImpl);
container.bind("KeymapRepository").to(KeymapRepositoryImpl);
container.bind("NavigationPresenter").to(NavigationPresenterImpl);
container.bind("OperationClient").to(OperationClientImpl);
container.bind("ScrollPresenter").to(ScrollPresenterImpl);
container.bind("FindPresenter").to(FindPresenterImpl);
container.bind("BackgroundKeyClient").to(BackgroundKeyClientImpl);
container.bind("KeyCaptureModeRepository").to(KeyCaptureModeRepositoryImpl);
container.bind("TopFrameClient").to(TopFrameClientImpl);
container.bind("FrameIdRepository").to(FrameIdRepositoryImpl);
container.bind("SettingClient").to(SettingClientImpl);
container.bind("SettingRepository").to(SettingRepositoryImpl);
container.bind("TabsClient").to(TabsClientImpl);
container
  .bind("BackgroundMessageSender")
  .toConstantValue(newBackgroundMessageSender());
container
  .bind("WindowMessageSender")
  .toConstantValue(newWindowMessageSender(window.top!));

export { container };
