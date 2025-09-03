/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PermissionToggles } from "../../../src/options/components/PermissionToggles";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("options/components/PermissionToggles", () => {
  let mockPermissions: Record<string, boolean>;

  beforeEach(() => {
    mockPermissions = {
      history: false,
      sessions: false,
      notifications: false,
      bookmarks: false,
      clipboardRead: false,
      clipboardWrite: false,
      browserSettings: false,
    };

    vi.spyOn(chrome.permissions, "getAll").mockImplementation(() => {
      const enabledPermissions = Object.keys(mockPermissions).filter(
        (key) => mockPermissions[key],
      );
      return Promise.resolve({ permissions: enabledPermissions });
    });

    vi.spyOn(chrome.permissions, "request").mockImplementation(
      (_permissions) => {
        return Promise.resolve(true);
      },
    );

    vi.spyOn(chrome.permissions, "remove").mockImplementation(
      (_permissions) => {
        return Promise.resolve(true);
      },
    );
  });

  describe("Chrome browser", () => {
    beforeEach(() => {
      process.env.BROWSER = "chrome";
    });

    it("renders Chrome optional permissions", async () => {
      render(<PermissionToggles />);

      await waitFor(() => {
        expect(screen.getByText("Optional Permissions")).toBeDefined();
        expect(screen.getByText("Read and modify bookmarks")).toBeDefined();
        expect(screen.getByText("Access browsing history")).toBeDefined();
        expect(screen.getByText("Display notifications to you")).toBeDefined();
        expect(screen.getByText("Access recently closed tabs")).toBeDefined();

        expect(screen.queryByText("Get data from the clipboard")).toBeNull();
        expect(screen.queryByText("Input data to the clipboard")).toBeNull();
        expect(
          screen.queryByText("Read and modify browser settings"),
        ).toBeNull();
      });
    });

    it("displays current permission states", async () => {
      mockPermissions.history = true;
      mockPermissions.bookmarks = true;

      render(<PermissionToggles />);

      await waitFor(() => {
        const historyButton = screen.getByLabelText(
          "Toggle Access browsing history",
        );
        const bookmarksButton = screen.getByLabelText(
          "Toggle Read and modify bookmarks",
        );
        const notificationsButton = screen.getByLabelText(
          "Toggle Display notifications to you",
        );

        expect(historyButton.getAttribute("aria-pressed")).toBe("true");
        expect(bookmarksButton.getAttribute("aria-pressed")).toBe("true");
        expect(notificationsButton.getAttribute("aria-pressed")).toBe("false");
      });
    });

    it("requests permission when toggle is turned on", async () => {
      render(<PermissionToggles />);

      await waitFor(() => {
        const historyButton = screen.getByLabelText(
          "Toggle Access browsing history",
        );
        expect(historyButton).toBeDefined();
      });

      const historyButton = screen.getByLabelText(
        "Toggle Access browsing history",
      );
      fireEvent.click(historyButton);

      await waitFor(() => {
        expect(chrome.permissions.request).toHaveBeenCalledWith({
          permissions: ["history"],
        });
      });
    });

    it("removes permission when toggle is turned off", async () => {
      mockPermissions.history = true;

      render(<PermissionToggles />);

      await waitFor(() => {
        const historyButton = screen.getByLabelText(
          "Toggle Access browsing history",
        );
        expect(historyButton.getAttribute("aria-pressed")).toBe("true");
      });

      const historyButton = screen.getByLabelText(
        "Toggle Access browsing history",
      );
      fireEvent.click(historyButton);

      expect(chrome.permissions.remove).toHaveBeenCalledWith({
        permissions: ["history"],
      });
    });
  });

  describe("Firefox browser", () => {
    beforeEach(() => {
      process.env.BROWSER = "firefox";
    });

    it("renders Firefox optional permissions including browser-specific ones", async () => {
      render(<PermissionToggles />);

      await waitFor(() => {
        expect(screen.getByText("Optional Permissions")).toBeDefined();

        expect(screen.getByText("Read and modify bookmarks")).toBeDefined();
        expect(screen.getByText("Access browsing history")).toBeDefined();
        expect(screen.getByText("Display notifications to you")).toBeDefined();
        expect(screen.getByText("Access recently closed tabs")).toBeDefined();
        expect(screen.getByText("Get data from the clipboard")).toBeDefined();
        expect(screen.getByText("Input data to the clipboard")).toBeDefined();
        expect(
          screen.getByText("Read and modify browser settings"),
        ).toBeDefined();
      });
    });

    it("handles Firefox-specific permissions correctly", async () => {
      render(<PermissionToggles />);

      await waitFor(() => {
        const clipboardReadButton = screen.getByLabelText(
          "Toggle Get data from the clipboard",
        );
        expect(clipboardReadButton).toBeDefined();
      });

      const clipboardReadButton = screen.getByLabelText(
        "Toggle Get data from the clipboard",
      );
      fireEvent.click(clipboardReadButton);

      expect(chrome.permissions.request).toHaveBeenCalledWith({
        permissions: ["clipboardRead"],
      });
    });
  });

  describe("Focus and visibility events", () => {
    it("reloads permissions when window gains focus", async () => {
      render(<PermissionToggles />);

      await waitFor(() => {
        expect(chrome.permissions.getAll).toHaveBeenCalledTimes(1);
      });

      window.dispatchEvent(new Event("focus"));

      await waitFor(() => {
        expect(chrome.permissions.getAll).toHaveBeenCalledTimes(2);
      });
    });

    it("reloads permissions when document becomes visible", async () => {
      render(<PermissionToggles />);

      await waitFor(() => {
        expect(chrome.permissions.getAll).toHaveBeenCalledTimes(1);
      });

      Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => false,
      });

      document.dispatchEvent(new Event("visibilitychange"));

      await waitFor(() => {
        expect(chrome.permissions.getAll).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Permission state updates", () => {
    it("updates UI when permission is granted", async () => {
      render(<PermissionToggles />);

      await waitFor(() => {
        const historyButton = screen.getByLabelText(
          "Toggle Access browsing history",
        );
        expect(historyButton.getAttribute("aria-pressed")).toBe("false");
      });

      vi.spyOn(chrome.permissions, "request").mockImplementation(
        (_permissions) => {
          return Promise.resolve(true);
        },
      );

      const historyButton = screen.getByLabelText(
        "Toggle Access browsing history",
      );
      fireEvent.click(historyButton);

      await waitFor(() => {
        const updatedButton = screen.getByLabelText(
          "Toggle Access browsing history",
        );
        expect(updatedButton.getAttribute("aria-pressed")).toBe("true");
      });
    });

    it("does not update UI when permission is denied", async () => {
      vi.spyOn(chrome.permissions, "request").mockImplementation(
        (_permissions) => {
          return Promise.resolve(false);
        },
      );

      render(<PermissionToggles />);

      await waitFor(() => {
        const historyButton = screen.getByLabelText(
          "Toggle Access browsing history",
        );
        expect(historyButton.getAttribute("aria-pressed")).toBe("false");
      });

      const historyButton = screen.getByLabelText(
        "Toggle Access browsing history",
      );
      fireEvent.click(historyButton);

      await waitFor(() => {
        expect(historyButton.getAttribute("aria-pressed")).toBe("false");
      });
    });

    it("updates UI when permission is removed", async () => {
      mockPermissions.history = true;

      render(<PermissionToggles />);

      await waitFor(() => {
        const historyButton = screen.getByLabelText(
          "Toggle Access browsing history",
        );
        expect(historyButton.getAttribute("aria-pressed")).toBe("true");
      });

      vi.spyOn(chrome.permissions, "remove").mockImplementation(
        (_permissions) => {
          return Promise.resolve(true);
        },
      );

      const historyButton = screen.getByLabelText(
        "Toggle Access browsing history",
      );
      fireEvent.click(historyButton);

      await waitFor(() => {
        const updatedButton = screen.getByLabelText(
          "Toggle Access browsing history",
        );
        expect(updatedButton.getAttribute("aria-pressed")).toBe("false");
      });
    });
  });
});
