import { injectable, inject } from "inversify";
import {
  ConsoleGetCompletionTypesResponse,
  ConsoleGetPropertiesResponse,
  ConsoleRequestBookmarksResponse,
  ConsoleRequestHistoryResponse,
  ConsoleRequestSearchEnginesResponse,
  ConsoleRequestTabsResponse,
} from "../../shared/messages";
import OpenCompletionUseCase from "../completion/OpenCompletionUseCase";
import TabCompletionUseCase from "../completion/TabCompletionUseCase";
import PropertyCompletionUseCase from "../completion/PropertyCompletionUseCase";

@injectable()
export default class CompletionController {
  constructor(
    @inject(OpenCompletionUseCase)
    private completionUseCase: OpenCompletionUseCase,
    @inject(TabCompletionUseCase)
    private tabCompletionUseCase: TabCompletionUseCase,
    @inject(PropertyCompletionUseCase)
    private propertyCompletionUseCase: PropertyCompletionUseCase
  ) {}

  async getCompletionTypes(): Promise<ConsoleGetCompletionTypesResponse> {
    return this.completionUseCase.getCompletionTypes();
  }

  async requestSearchEngines(
    query: string
  ): Promise<ConsoleRequestSearchEnginesResponse> {
    const items = await this.completionUseCase.requestSearchEngines(query);
    return items.map((name) => ({ title: name }));
  }

  async requestBookmarks(
    query: string
  ): Promise<ConsoleRequestBookmarksResponse> {
    return this.completionUseCase.requestBookmarks(query);
  }

  async requestHistory(query: string): Promise<ConsoleRequestHistoryResponse> {
    return this.completionUseCase.requestHistory(query);
  }

  async queryTabs(
    query: string,
    excludePinned: boolean
  ): Promise<ConsoleRequestTabsResponse> {
    return this.tabCompletionUseCase.queryTabs(query, excludePinned);
  }

  async getProperties(): Promise<ConsoleGetPropertiesResponse> {
    return this.propertyCompletionUseCase.getProperties();
  }
}
