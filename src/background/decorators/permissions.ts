type Permission =
  | "bookmarks"
  | "history"
  | "sessions"
  | "notifications"
  | "browserSettings";

export function requirePermission(permission: Permission): MethodDecorator {
  return function (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const hasPermission = await chrome.permissions.contains({
        permissions: [permission],
      });

      if (!hasPermission) {
        const permissionDisplayName =
          permission.charAt(0).toUpperCase() + permission.slice(1);
        throw new Error(
          `${permissionDisplayName} access was blocked due to lack of user activation.`,
        );
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
