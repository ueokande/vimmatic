import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import {
  BackgroundMessageSender,
  newSender as newBackgroundMessageSender,
} from "./client/BackgroundMessageSender";
import {
  WindowMessageSender,
  newSender as newWindowMessageSender,
} from "./client/WindowMessageSender";

import "./client/BackgroundKeyClient";
import "./client/OperationClient";
import "./client/SettingClient";
import "./client/TopFrameClient";
import "./presenters/ConsoleFramePresenter";
import "./presenters/FindPresenter";
import "./presenters/FocusPresenter";
import "./presenters/HintPresenter";
import "./presenters/NavigationPresenter";
import "./presenters/ReadyStatusPresenter";
import "./presenters/ScrollPresenter";
import "./presenters/VisualPresenter";
import "./repositories/AddonEnabledRepository";
import "./repositories/AddressRepository";
import "./repositories/FrameIdRepository";
import "./repositories/KeymapRepository";
import "./repositories/ModeRepository";
import "./repositories/SettingRepository";

const container = new Container({ autoBindInjectable: true });

container.load(buildProviderModule());

container
  .bind(BackgroundMessageSender)
  .toConstantValue(newBackgroundMessageSender());
container
  .bind(WindowMessageSender)
  .toConstantValue(newWindowMessageSender(window.top!));

export { container };
