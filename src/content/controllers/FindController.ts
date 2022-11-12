import { injectable, inject } from "inversify";
import FindUseCase from "../usecases/FindUseCase";

@injectable()
export default class FindController {
  constructor(
    @inject(FindUseCase)
    private readonly findUseCase: FindUseCase
  ) {}

  findNext({ keyword }: { keyword: string }): Promise<boolean> {
    const found = this.findUseCase.findNext(keyword);
    return Promise.resolve(found);
  }

  findPrev({ keyword }: { keyword: string }): Promise<boolean> {
    const found = this.findUseCase.findPrev(keyword);
    return Promise.resolve(found);
  }

  clearSelection(): Promise<void> {
    this.findUseCase.clearSelection();
    return Promise.resolve();
  }
}
