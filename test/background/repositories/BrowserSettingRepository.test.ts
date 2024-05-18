import {
  FirefoxBrowserSettingRepositoryImpl,
  ChromeBrowserSettingRepositoryImpl,
} from "../../../src/background/repositories/BrowserSettingRepository";
import { describe, beforeEach, it, vi, expect } from "vitest";

describe("FirefoxBrowserSettingRepositoryImpl", () => {
  const mockHomepageOverrideGet = vi.spyOn(
    chrome.browserSettings.homepageOverride,
    "get",
  );
  const sut = new FirefoxBrowserSettingRepositoryImpl();

  beforeEach(() => {
    mockHomepageOverrideGet.mockClear();
  });

  it("returns homepage urls", async () => {
    mockHomepageOverrideGet.mockResolvedValue({
      value: "google.com|yahoo.com|https://bing.com/",
      levelOfControl: "not_controllable",
    });

    const urls = await sut.getHomepageUrls();
    expect(urls).toEqual([
      "http://google.com",
      "http://yahoo.com",
      "https://bing.com/",
    ]);
  });

  it("excludes restricted urls", async () => {
    mockHomepageOverrideGet.mockResolvedValue({
      value: "about:blank|about:about|about:newtab",
      levelOfControl: "not_controllable",
    });

    const urls = await sut.getHomepageUrls();
    expect(urls).toEqual(["about:blank"]);
  });

  it("returns default url on empty value", async () => {
    mockHomepageOverrideGet.mockResolvedValue({
      value: "",
      levelOfControl: "not_controllable",
    });

    const urls = await sut.getHomepageUrls();
    expect(urls).toEqual(["about:blank"]);
  });

  it("returns default url on filtered URLs", async () => {
    mockHomepageOverrideGet.mockResolvedValue({
      value: "about:newtab|about:about",
      levelOfControl: "not_controllable",
    });

    const urls = await sut.getHomepageUrls();
    expect(urls).toEqual(["about:blank"]);
  });
});

describe("ChromeBrowserSettingRepositoryImpl", () => {
  const sut = new ChromeBrowserSettingRepositoryImpl();

  it("returns default url", async () => {
    const urls = await sut.getHomepageUrls();
    expect(urls).toEqual(["chrome://newtab"]);
  });
});
