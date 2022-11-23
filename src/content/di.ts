/* eslint-disable max-len */

import { AddonEnabledRepositoryImpl } from "./repositories/AddonEnabledRepository";
import { AddonIndicatorClientImpl } from "./client/AddonIndicatorClient";
import { AddressRepositoryImpl } from "./repositories/AddressRepository";
import { ClipboardRepositoryImpl } from "./repositories/ClipboardRepository";
import { ConsoleClientImpl } from "./client/ConsoleClient";
import { ConsoleFramePresenterImpl } from "./presenters/ConsoleFramePresenter";
import { FocusPresenterImpl } from "./presenters/FocusPresenter";
import { FollowKeyRepositoryImpl } from "./repositories/FollowKeyRepository";
import { FollowMasterClientImpl } from "./client/FollowMasterClient";
import { FollowMasterRepositoryImpl } from "./repositories/FollowMasterRepository";
import { FollowPresenterImpl } from "./presenters/FollowPresenter";
import { FollowSlaveClientFactoryImpl } from "./client/FollowSlaveClientFactory";
import { FollowSlaveRepositoryImpl } from "./repositories/FollowSlaveRepository";
import { HintKeyRepositoryImpl } from "./repositories/HintKeyRepository";
import { KeymapRepositoryImpl } from "./repositories/KeymapRepository";
import { MarkClientImpl } from "./client/MarkClient";
import { MarkKeyRepositoryImpl } from "./repositories/MarkKeyRepository";
import { MarkRepositoryImpl } from "./repositories/MarkRepository";
import { NavigationPresenterImpl } from "./presenters/NavigationPresenter";
import { OperationClientImpl } from "./client/OperationClient";
import { ScrollPresenterImpl } from "./presenters/ScrollPresenter";
import { SettingClientImpl } from "./client/SettingClient";
import { SettingRepositoryImpl } from "./repositories/SettingRepository";
import { TabsClientImpl } from "./client/TabsClient";
import { OperatorRegistoryFactory } from "./operators";
import { URLRepositoryImpl } from "./operators/impls/URLRepository";
import { FindPresenterImpl } from "./presenters/FindPresenter";
import { Container } from "inversify";
import { newSender as newBackgroundMessageSender } from "./client/BackgroundMessageSender";
import { newSender as newWindowMessageSender } from "./client/WindowMessageSender";

const container = new Container({ autoBindInjectable: true });

container.bind("FollowMasterClient").to(FollowMasterClientImpl);
container.bind("AddonEnabledRepository").to(AddonEnabledRepositoryImpl);
container.bind("AddonIndicatorClient").to(AddonIndicatorClientImpl);
container.bind("AddressRepository").to(AddressRepositoryImpl);
container.bind("ClipboardRepository").to(ClipboardRepositoryImpl);
container.bind("ConsoleClient").to(ConsoleClientImpl);
container.bind("ConsoleFramePresenter").to(ConsoleFramePresenterImpl);
container.bind("FocusPresenter").to(FocusPresenterImpl);
container.bind("FollowKeyRepository").to(FollowKeyRepositoryImpl);
container.bind("FollowMasterRepository").to(FollowMasterRepositoryImpl);
container.bind("FollowPresenter").to(FollowPresenterImpl);
container.bind("FollowSlaveClientFactory").to(FollowSlaveClientFactoryImpl);
container.bind("FollowSlaveRepository").to(FollowSlaveRepositoryImpl);
container.bind("HintKeyRepository").to(HintKeyRepositoryImpl);
container.bind("KeymapRepository").to(KeymapRepositoryImpl);
container.bind("MarkClient").to(MarkClientImpl);
container.bind("MarkKeyRepository").to(MarkKeyRepositoryImpl);
container.bind("MarkRepository").to(MarkRepositoryImpl);
container.bind("NavigationPresenter").to(NavigationPresenterImpl);
container.bind("OperationClient").to(OperationClientImpl);
container.bind("ScrollPresenter").to(ScrollPresenterImpl);
container.bind("FindPresenter").to(FindPresenterImpl);
container.bind("SettingClient").to(SettingClientImpl);
container.bind("SettingRepository").to(SettingRepositoryImpl);
container.bind("URLRepository").to(URLRepositoryImpl);
container.bind("TabsClient").to(TabsClientImpl);
container
  .bind("BackgroundMessageSender")
  .toConstantValue(newBackgroundMessageSender());
container
  .bind("WindowMessageSender")
  .toConstantValue(newWindowMessageSender(window.top));
container
  .bind("OperatorRegistory")
  .toConstantValue(container.resolve(OperatorRegistoryFactory).create());

export { container };
