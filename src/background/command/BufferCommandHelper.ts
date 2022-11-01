import { Completions } from "../../shared/Completions";
import LastSelectedTab from "./LastSelectedTab";

export default class BufferCommandHelper {
  constructor(private readonly lastSelectedTab: LastSelectedTab) {}

  async getCompletions(force: boolean, query: string): Promise<Completions> {
    const lastTabId = await this.lastSelectedTab.get();
    const allTabs = await this.getAllTabs(force);
    const num = parseInt(query, 10);
    let tabs: browser.tabs.Tab[] = [];
    if (!isNaN(num)) {
      const tab = allTabs.find((t) => t.index === num - 1);
      if (tab) {
        tabs = [tab];
      }
    } else if (query == "%") {
      const tab = allTabs.find((t) => t.active);
      if (tab) {
        tabs = [tab];
      }
    } else if (query == "#") {
      const tab = allTabs.find((t) => t.id === lastTabId);
      if (tab) {
        tabs = [tab];
      }
    } else {
      tabs = await this.queryTabs(force, query);
    }

    const items = tabs.map((tab) => {
      let flag = " ";
      if (tab.active) {
        flag = "%";
      } else if (tab.id == lastTabId) {
        flag = "#";
      }
      const index = tab.index + 1;
      return {
        primary: `${index}: ${flag} ${tab.title}`,
        secondary: tab.url,
        value: tab.url!,
        icon: tab.favIconUrl,
      };
    });

    return [{ name: "Buffers", items }];
  }

  async queryTabs(force: boolean, query: string): Promise<browser.tabs.Tab[]> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    const matched = tabs
      .filter((t) => {
        return (
          (t.url && t.url.toLowerCase().includes(query.toLowerCase())) ||
          (t.title && t.title.toLowerCase().includes(query.toLowerCase()))
        );
      })
      .filter((item) => item.id && item.title && item.url);

    if (force) {
      return matched;
    }
    return matched.filter((tab) => !tab.pinned);
  }

  private async getAllTabs(force: boolean): Promise<browser.tabs.Tab[]> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    if (force) {
      return tabs;
    }
    return tabs.filter((tab) => !tab.pinned);
  }
}
