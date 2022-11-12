import { injectable, inject } from "inversify";
import MarkUseCase from "../usecases/MarkUseCase";

@injectable()
export default class MarkController {
  constructor(
    @inject(MarkUseCase)
    private readonly markUseCase: MarkUseCase
  ) {}

  scrollTo({ x, y }: { x: number; y: number }): Promise<void> {
    this.markUseCase.scroll(x, y);
    return Promise.resolve();
  }
}
