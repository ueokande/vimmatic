import React from "react";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  section: {
    marginTop: "24px",
    marginBottom: "24px",
  },
  heading: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  permissionItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
    marginBottom: "8px",
    borderRadius: "4px",
    backgroundColor: "var(--permission-item-bg, #f5f5f5)",
  },
  permissionInfo: {
    flex: 1,
  },
  permissionLabel: {
    fontSize: "14px",
    fontWeight: "500",
  },
  toggle: {
    position: "relative",
    width: "44px",
    height: "24px",
    backgroundColor: "#ccc",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    border: "none",
    padding: 0,
  },
  toggleEnabled: {
    backgroundColor: "#4CAF50",
  },
  toggleSlider: {
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "20px",
    height: "20px",
    backgroundColor: "white",
    borderRadius: "50%",
    transition: "transform 0.3s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  toggleSliderEnabled: {
    transform: "translateX(20px)",
  },
});

interface Permission {
  label: string;
  permission: chrome.permissions.Permissions;
}

const PERMISSION_LABELS: Record<string, string> = {
  history: "Access browsing history",
  sessions: "Access recently closed tabs",
  clipboardRead: "Get data from the clipboard",
  clipboardWrite: "Input data to the clipboard",
  notifications: "Display notifications to you",
  bookmarks: "Read and modify bookmarks",
  browserSettings: "Read and modify browser settings",
};

const CHROME_OPTIONAL_PERMISSIONS = [
  "history",
  "sessions",
  "notifications",
  "bookmarks",
];

// Sort permissions by about:addons page
const FIREFOX_OPTIONAL_PERMISSIONS = [
  "history",
  "sessions",
  "clipboardRead",
  "clipboardWrite",
  "notifications",
  "bookmarks",
  "browserSettings",
];

const getOptionalPermissions = (): Permission[] => {
  const permissionKeys =
    process.env.BROWSER === "firefox"
      ? FIREFOX_OPTIONAL_PERMISSIONS
      : CHROME_OPTIONAL_PERMISSIONS;

  return permissionKeys.map((key) => ({
    label: PERMISSION_LABELS[key],
    permission: { permissions: [key] },
  }));
};

export const PermissionToggles: React.FC = () => {
  const [permissions, setPermissions] = React.useState<Record<string, boolean>>(
    {},
  );
  const optionalPermissions = React.useMemo(() => getOptionalPermissions(), []);

  const loadPermissions = React.useCallback(async () => {
    const currentPermissions = await chrome.permissions.getAll();
    const permissionStates: Record<string, boolean> = {};
    optionalPermissions.forEach((perm) => {
      const permName = perm.permission.permissions?.[0];
      if (permName) {
        permissionStates[permName] =
          currentPermissions.permissions?.includes(permName) || false;
      }
    });
    setPermissions(permissionStates);
  }, [optionalPermissions]);

  React.useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  React.useEffect(() => {
    const handleFocus = () => {
      loadPermissions();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadPermissions();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadPermissions]);

  const handleToggle = async (permission: Permission) => {
    const permName = permission.permission.permissions?.[0];
    if (!permName) return;

    const isEnabled = permissions[permName];
    if (!isEnabled) {
      const granted = await chrome.permissions.request(permission.permission);
      if (granted) {
        setPermissions((prev) => ({ ...prev, [permName]: true }));
      }
    } else {
      const removed = await chrome.permissions.remove(permission.permission);
      if (removed) {
        setPermissions((prev) => ({ ...prev, [permName]: false }));
      }
    }
  };

  return (
    <div {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.heading)}>Optional Permissions</h2>
      {optionalPermissions.map((permission) => {
        const permName = permission.permission.permissions?.[0];
        const isEnabled = permName ? permissions[permName] || false : false;

        return (
          <div key={permName} {...stylex.props(styles.permissionItem)}>
            <div {...stylex.props(styles.permissionInfo)}>
              <div {...stylex.props(styles.permissionLabel)}>
                {permission.label}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(permission)}
              {...stylex.props(
                styles.toggle,
                isEnabled && styles.toggleEnabled,
              )}
              aria-label={`Toggle ${permission.label}`}
              aria-pressed={isEnabled}
            >
              <span
                {...stylex.props(
                  styles.toggleSlider,
                  isEnabled && styles.toggleSliderEnabled,
                )}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};
