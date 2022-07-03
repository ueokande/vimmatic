import { injectable, inject } from "inversify";
import StartFindUseCase from "../usecases/StartFindUseCase";

@injectable()
export default class FindController {
  constructor(
    @inject(StartFindUseCase)
    private startFindUseCase: StartFindUseCase
  ) {}

  startFind(tabId: number, keyword?: string): Promise<void> {
    return this.startFindUseCase.startFind(tabId, keyword);
  }
}
