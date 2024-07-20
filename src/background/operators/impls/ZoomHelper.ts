const ZOOM_SETTINGS = [
  0.33, 0.5, 0.66, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0,
] as const;

export class ZoomHelper {
  async zoomIn(tabId: number): Promise<void> {
    const current = await chrome.tabs.getZoom(tabId);
    const factor = ZOOM_SETTINGS.find((f) => f > current);
    if (factor) {
      return chrome.tabs.setZoom(tabId, factor);
    }
  }

  async zoomOut(tabId: number): Promise<void> {
    const current = await chrome.tabs.getZoom(tabId);
    const factor = ZOOM_SETTINGS.slice(0)
      .reverse()
      .find((f) => f < current);
    if (factor) {
      return chrome.tabs.setZoom(tabId, factor);
    }
  }
}
