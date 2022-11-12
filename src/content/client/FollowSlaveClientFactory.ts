import { injectable } from "inversify";
import FollowSlaveClient, { FollowSlaveClientImpl } from "./FollowSlaveClient";
import { newSender } from "./WindowMessageSender";

export default interface FollowSlaveClientFactory {
  create(window: Window): FollowSlaveClient;
}

@injectable()
export class FollowSlaveClientFactoryImpl implements FollowSlaveClientFactory {
  create(window: Window): FollowSlaveClient {
    return new FollowSlaveClientImpl(newSender(window));
  }
}
