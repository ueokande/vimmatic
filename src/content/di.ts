/* eslint-disable max-len */

import {
  AddonEnabledRepository,
  AddonEnabledRepositoryImpl,
} from "./repositories/AddonEnabledRepository";
import {
  AddressRepository,
  AddressRepositoryImpl,
} from "./repositories/AddressRepository";
import {
  ConsoleFramePresenter,
  ConsoleFramePresenterImpl,
} from "./presenters/ConsoleFramePresenter";
import {
  FocusPresenter,
  FocusPresenterImpl,
} from "./presenters/FocusPresenter";
import { HintPresenter, HintPresenterImpl } from "./presenters/HintPresenter";
import {
  KeymapRepository,
  KeymapRepositoryImpl,
} from "./repositories/KeymapRepository";
import {
  NavigationPresenter,
  NavigationPresenterImpl,
} from "./presenters/NavigationPresenter";
import { OperationClient, OperationClientImpl } from "./client/OperationClient";
import {
  ScrollPresenter,
  ScrollPresenterImpl,
} from "./presenters/ScrollPresenter";
import { SettingClient, SettingClientImpl } from "./client/SettingClient";
import {
  SettingRepository,
  SettingRepositoryImpl,
} from "./repositories/SettingRepository";
import { FindPresenter, FindPresenterImpl } from "./presenters/FindPresenter";
import {
  BackgroundKeyClient,
  BackgroundKeyClientImpl,
} from "./client/BackgroundKeyClient";
import {
  ModeRepository,
  ModeRepositoryImpl,
} from "./repositories/ModeRepository";
import { TopFrameClient, TopFrameClientImpl } from "./client/TopFrameClient";
import {
  FrameIdRepository,
  FrameIdRepositoryImpl,
} from "./repositories/FrameIdRepository";
import {
  ReadyStatusPresenter,
  ReadyStatusPresenterImpl,
} from "./presenters/ReadyStatusPresenter";
import { Container } from "inversify";
import {
  BackgroundMessageSender,
  newSender as newBackgroundMessageSender,
} from "./client/BackgroundMessageSender";
import {
  WindowMessageSender,
  newSender as newWindowMessageSender,
} from "./client/WindowMessageSender";

const container = new Container({ autoBindInjectable: true });

container.bind(AddonEnabledRepository).to(AddonEnabledRepositoryImpl);
container.bind(AddressRepository).to(AddressRepositoryImpl);
container.bind(ConsoleFramePresenter).to(ConsoleFramePresenterImpl);
container.bind(FocusPresenter).to(FocusPresenterImpl);
container.bind(HintPresenter).to(HintPresenterImpl);
container.bind(KeymapRepository).to(KeymapRepositoryImpl);
container.bind(NavigationPresenter).to(NavigationPresenterImpl);
container.bind(OperationClient).to(OperationClientImpl);
container.bind(ScrollPresenter).to(ScrollPresenterImpl);
container.bind(FindPresenter).to(FindPresenterImpl);
container.bind(BackgroundKeyClient).to(BackgroundKeyClientImpl);
container.bind(ModeRepository).to(ModeRepositoryImpl);
container.bind(TopFrameClient).to(TopFrameClientImpl);
container.bind(FrameIdRepository).to(FrameIdRepositoryImpl);
container.bind(ReadyStatusPresenter).to(ReadyStatusPresenterImpl);
container.bind(SettingClient).to(SettingClientImpl);
container.bind(SettingRepository).to(SettingRepositoryImpl);
container
  .bind(BackgroundMessageSender)
  .toConstantValue(newBackgroundMessageSender());
container
  .bind(WindowMessageSender)
  .toConstantValue(newWindowMessageSender(window.top!));

export { container };
