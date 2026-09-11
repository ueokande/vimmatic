import { inject, injectable } from "inversify";
import type { FindQuery } from "../../shared/findQuery";
import { FindUseCase } from "../usecases/FindUseCase";

@injectable()
export class FindController {
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
