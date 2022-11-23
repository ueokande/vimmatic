// Hide console; or cancel some user actions
export const CANCEL = "cancel";

// Command
export const COMMAND_SHOW = "command.show";
export const COMMAND_SHOW_OPEN = "command.show.open";
export const COMMAND_SHOW_TABOPEN = "command.show.tabopen";
export const COMMAND_SHOW_WINOPEN = "command.show.winopen";
export const COMMAND_SHOW_BUFFER = "command.show.buffer";
export const COMMAND_SHOW_ADDBOOKMARK = "command.show.addbookmark";

// Navigations
export const NAVIGATE_HISTORY_PREV = "navigate.history.prev";
export const NAVIGATE_HISTORY_NEXT = "navigate.history.next";
export const NAVIGATE_LINK_PREV = "navigate.link.prev";
export const NAVIGATE_LINK_NEXT = "navigate.link.next";
export const NAVIGATE_PARENT = "navigate.parent";
export const NAVIGATE_ROOT = "navigate.root";

// Page
export const PAGE_SOURCE = "page.source";
export const PAGE_HOME = "page.home";

// Tabs
export const TAB_CLOSE = "tabs.close";
export const TAB_CLOSE_FORCE = "tabs.close.force";
export const TAB_CLOSE_RIGHT = "tabs.close.right";
export const TAB_REOPEN = "tabs.reopen";
export const TAB_PREV = "tabs.prev";
export const TAB_NEXT = "tabs.next";
export const TAB_FIRST = "tabs.first";
export const TAB_LAST = "tabs.last";
export const TAB_PREV_SEL = "tabs.prevsel";
export const TAB_RELOAD = "tabs.reload";
export const TAB_PIN = "tabs.pin";
export const TAB_UNPIN = "tabs.unpin";
export const TAB_TOGGLE_PINNED = "tabs.pin.toggle";
export const TAB_DUPLICATE = "tabs.duplicate";
export const TAB_TOGGLE_READER = "tabs.reader.toggle";

// Zooms
export const ZOOM_IN = "zoom.in";
export const ZOOM_OUT = "zoom.out";
export const ZOOM_NEUTRAL = "zoom.neutral";

// Find
export const FIND_START = "find.start";
export const FIND_NEXT = "find.next";
export const FIND_PREV = "find.prev";

// Repeat
export const REPEAT_LAST = "repeat.last";

// Internal
export const INTERNAL_OPEN_URL = "internal.open.url";

export interface CancelOperation {
  type: typeof CANCEL;
}

export interface CommandShowOperation {
  type: typeof COMMAND_SHOW;
}

export interface CommandShowOpenOperation {
  type: typeof COMMAND_SHOW_OPEN;
  alter: boolean;
}

export interface CommandShowTabopenOperation {
  type: typeof COMMAND_SHOW_TABOPEN;
  alter: boolean;
}

export interface CommandShowWinopenOperation {
  type: typeof COMMAND_SHOW_WINOPEN;
  alter: boolean;
}

export interface CommandShowBufferOperation {
  type: typeof COMMAND_SHOW_BUFFER;
}

export interface CommandShowAddbookmarkOperation {
  type: typeof COMMAND_SHOW_ADDBOOKMARK;
  alter: boolean;
}

export interface NavigateHistoryPrevOperation {
  type: typeof NAVIGATE_HISTORY_PREV;
}

export interface NavigateHistoryNextOperation {
  type: typeof NAVIGATE_HISTORY_NEXT;
}

export interface NavigateLinkPrevOperation {
  type: typeof NAVIGATE_LINK_PREV;
}

export interface NavigateLinkNextOperation {
  type: typeof NAVIGATE_LINK_NEXT;
}

export interface NavigateParentOperation {
  type: typeof NAVIGATE_PARENT;
}

export interface NavigateRootOperation {
  type: typeof NAVIGATE_ROOT;
}

export interface PageSourceOperation {
  type: typeof PAGE_SOURCE;
}

export interface PageHomeOperation {
  type: typeof PAGE_HOME;
  newTab: boolean;
}

export interface TabCloseOperation {
  type: typeof TAB_CLOSE;
  select?: "left" | "right";
}

export interface TabCloseForceOperation {
  type: typeof TAB_CLOSE_FORCE;
}

export interface TabCloseRightOperation {
  type: typeof TAB_CLOSE_RIGHT;
}

export interface TabReopenOperation {
  type: typeof TAB_REOPEN;
}

export interface TabPrevOperation {
  type: typeof TAB_PREV;
}

export interface TabNextOperation {
  type: typeof TAB_NEXT;
}

export interface TabFirstOperation {
  type: typeof TAB_FIRST;
}

export interface TabLastOperation {
  type: typeof TAB_LAST;
}

export interface TabPrevSelOperation {
  type: typeof TAB_PREV_SEL;
}

export interface TabReloadOperation {
  type: typeof TAB_RELOAD;
  cache: boolean;
}

export interface TabPinOperation {
  type: typeof TAB_PIN;
}

export interface TabUnpinOperation {
  type: typeof TAB_UNPIN;
}

export interface TabTogglePinnedOperation {
  type: typeof TAB_TOGGLE_PINNED;
}

export interface TabDuplicateOperation {
  type: typeof TAB_DUPLICATE;
}

export interface TabToggleReaderOperation {
  type: typeof TAB_TOGGLE_READER;
}

export interface ZoomInOperation {
  type: typeof ZOOM_IN;
}

export interface ZoomOutOperation {
  type: typeof ZOOM_OUT;
}

export interface ZoomNeutralOperation {
  type: typeof ZOOM_NEUTRAL;
}

export interface FindStartOperation {
  type: typeof FIND_START;
}

export interface FindNextOperation {
  type: typeof FIND_NEXT;
}

export interface FindPrevOperation {
  type: typeof FIND_PREV;
}

export interface RepeatLastOperation {
  type: typeof REPEAT_LAST;
}

export interface InternalOpenUrl {
  type: typeof INTERNAL_OPEN_URL;
  url: string;
  newTab?: boolean;
  newWindow?: boolean;
  background?: boolean;
}

export type Operation =
  | CancelOperation
  | CommandShowOperation
  | CommandShowOpenOperation
  | CommandShowTabopenOperation
  | CommandShowWinopenOperation
  | CommandShowBufferOperation
  | CommandShowAddbookmarkOperation
  | NavigateHistoryPrevOperation
  | NavigateHistoryNextOperation
  | NavigateLinkPrevOperation
  | NavigateLinkNextOperation
  | NavigateParentOperation
  | NavigateRootOperation
  | PageSourceOperation
  | PageHomeOperation
  | TabCloseOperation
  | TabCloseForceOperation
  | TabCloseRightOperation
  | TabReopenOperation
  | TabPrevOperation
  | TabNextOperation
  | TabFirstOperation
  | TabLastOperation
  | TabPrevSelOperation
  | TabReloadOperation
  | TabPinOperation
  | TabUnpinOperation
  | TabTogglePinnedOperation
  | TabDuplicateOperation
  | TabToggleReaderOperation
  | ZoomInOperation
  | ZoomOutOperation
  | ZoomNeutralOperation
  | FindStartOperation
  | FindNextOperation
  | FindPrevOperation
  | RepeatLastOperation
  | InternalOpenUrl;
