import type { Completions, CompletionItem } from "./types";
import * as filters from "./filters";
import type { SearchEngineSettings } from "../settings/SearchEngineSettings";
import type { PropertySettings } from "../settings/PropertySettings";

const COMPLETION_ITEM_LIMIT = 10;

export class OpenCommandHelper {
  constructor(
    private readonly searchEngineSettings: SearchEngineSettings,
    private readonly propertySettings: PropertySettings,
  ) {}

  async getCompletions(query: string): Promise<Completions> {
    const complete = await this.propertySettings.getProperty("complete");
    const completions: Completions = [];
    for (const c of String(complete)) {
      switch (c) {
        case "s":
          completions.push({
            name: "Search Engines",
            items: await this.querySearchEngines(query),
          });
          break;
        case "b":
          completions.push({
            name: "Bookmarks",
            items: await this.queryBookmarks(query),
          });
          break;
        case "h":
          completions.push({
            name: "History",
            items: await this.queryHistories(query),
          });
          break;
      }
      // ignore invalid characters in the complete property
    }
    return completions;
  }

  private async querySearchEngines(query: string): Promise<CompletionItem[]> {
    const { engines } = await this.searchEngineSettings.get();
    return Object.keys(engines)
      .filter((engine) => engine.startsWith(query))
      .map((engine) => ({
        primary: engine,
        value: engine,
      }));
  }

  private async queryBookmarks(query: string): Promise<CompletionItem[]> {
    const items = await chrome.bookmarks.search({ query });
    return items
      .filter((item) => item.title.length > 0)
      .filter((item) => typeof item.url !== "undefined")
      .filter((item) => {
        let url = undefined;
        try {
          url = new URL(item.url!);
        } catch (e) {
          return false;
        }
        return url.protocol !== "place:";
      })
      .slice(0, COMPLETION_ITEM_LIMIT)
      .map((item) => ({
        primary: item.title,
        secondary: item.url,
        value: item.url!,
      }));
  }

  async queryHistories(query: string): Promise<CompletionItem[]> {
    const items = await chrome.history.search({
      text: query,
      startTime: 0,
    });

    return [items]
      .map(filters.filterBlankTitle)
      .map(filters.filterHttp)
      .map(filters.filterByTailingSlash)
      .map((pages) => filters.filterByPathname(pages, COMPLETION_ITEM_LIMIT))
      .map((pages) => filters.filterByOrigin(pages, COMPLETION_ITEM_LIMIT))[0]
      .sort((x, y) => Number(y.visitCount) - Number(x.visitCount))
      .slice(0, COMPLETION_ITEM_LIMIT)
      .map((item) => ({
        primary: item.title,
        secondary: item.url,
        value: item.url!,
      }));
  }
}
