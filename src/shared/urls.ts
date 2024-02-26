import { Search as SearchEngine } from "./search";

const trimStart = (str: string): string => {
  // NOTE String.trimStart is available on Firefox 61
  return str.replace(/^\s+/, "");
};

const SUPPORTED_PROTOCOLS = ["http:", "https:", "ftp:", "mailto:", "about:"];
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/create
const UNSUPPORTED_PROTOCOLS = ["chrome:", "javascript:", "data:", "file:"];

const isHostname = (src: string): boolean => {
  return src === "localhost" || (src.includes(".") && !src.includes(" "));
};

const isHost = (src: string): boolean => {
  if (!src.includes(":")) {
    return isHostname(src);
  }
  const [hostname, port] = src.split(":", 2);
  return isHostname(hostname) && !isNaN(Number(port));
};

const parseURL = (src: string): URL | undefined => {
  try {
    return new URL(src);
  } catch (e) {
    // fallthrough
  }
  return undefined;
};

const searchUrl = (keywords: string, search: SearchEngine): string => {
  const url = parseURL(keywords);
  if (typeof url !== "undefined") {
    // URL parser recognize example.com:12345 as a valid URL which has a
    // protocol 'example.com'.

    if (SUPPORTED_PROTOCOLS.includes(url.protocol)) {
      return url.href;
    } else if (UNSUPPORTED_PROTOCOLS.includes(url.protocol)) {
      throw new Error(
        `Opening protocol '${url.protocol}' is forbidden for security reasons`,
      );
    }
  }

  const urlWithHttp = parseURL("http://" + keywords);
  if (typeof urlWithHttp !== "undefined" && isHost(urlWithHttp.host)) {
    return urlWithHttp.href;
  }

  let template = search.engines[search.defaultEngine];
  let query = keywords;

  const first = trimStart(keywords).split(" ")[0];
  if (Object.keys(search.engines).includes(first)) {
    template = search.engines[first];
    query = trimStart(trimStart(keywords).slice(first.length));
  }
  return template.replace("{}", encodeURIComponent(query));
};

const normalizeUrl = (url: string): string => {
  try {
    const u = new URL(url);
    if (SUPPORTED_PROTOCOLS.includes(u.protocol.toLowerCase())) {
      return u.href;
    }
  } catch (e) {
    // fallthrough
  }
  return "http://" + url;
};

export { searchUrl, normalizeUrl };
