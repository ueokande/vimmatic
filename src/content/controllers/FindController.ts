import { injectable, inject } from "inversify";
import FindUseCase from "../usecases/FindUseCase";
import type { FindQuery } from "../../shared/findQuery";

@injectable()
export default class FindController {
  constructor(
    @inject(FindUseCase)
    private readonly findUseCase: FindUseCase,
  ) {}

  findNext(query: FindQuery): Promise<boolean> {
    const found = this.findUseCase.findNext(query);
    return Promise.resolve(found);
  }

  findPrev(query: FindQuery): Promise<boolean> {
    const found = this.findUseCase.findPrev(query);
    return Promise.resolve(found);
  }

  clearSelection(): Promise<void> {
    this.findUseCase.clearSelection();
    return Promise.resolve();
  }
}
