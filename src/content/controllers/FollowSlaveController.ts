import { injectable, inject } from "inversify";
import FollowSlaveUseCase from "../usecases/FollowSlaveUseCase";
import WindowRequestContext from "./WindowRequestContext";

type ViewSize = { width: number; height: number };
type FramePosition = { x: number; y: number };
@injectable()
export default class FollowSlaveController {
  constructor(
    @inject(FollowSlaveUseCase)
    private readonly usecase: FollowSlaveUseCase
  ) {}

  countTargets(
    _ctx: WindowRequestContext,
    {
      viewSize,
      framePosition,
    }: { viewSize: ViewSize; framePosition: FramePosition }
  ): void {
    this.usecase.countTargets(viewSize, framePosition);
  }

  createHints(
    _ctx: WindowRequestContext,
    {
      viewSize,
      framePosition,
      tags,
    }: { viewSize: ViewSize; framePosition: FramePosition; tags: string[] }
  ): void {
    this.usecase.createHints(viewSize, framePosition, tags);
  }

  showHints(_ctx: WindowRequestContext, { prefix }: { prefix: string }): void {
    this.usecase.showHints(prefix);
  }

  activate(
    _ctx: WindowRequestContext,
    {
      tag,
      newTab,
      background,
    }: {
      tag: string;
      newTab: boolean;
      background: boolean;
    }
  ): void {
    this.usecase.activate(tag, newTab, background);
  }

  clear() {
    this.usecase.clear();
  }
}
