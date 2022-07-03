import { injectable, inject } from "inversify";
import FindUseCase from "../usecases/FindUseCase";

@injectable()
export default class FindController {
  constructor(
    @inject(FindUseCase)
    private readonly findUseCase: FindUseCase
  ) {}

  findNext(keyword: string): boolean {
    return this.findUseCase.findNext(keyword);
  }

  findPrev(keyword: string): boolean {
    return this.findUseCase.findPrev(keyword);
  }

  clearSelection() {
    return this.findUseCase.clearSelection();
  }
}
