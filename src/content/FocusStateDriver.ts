import * as dom from "../shared/utils/dom";

const isEditable = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) {
    return false;
  }
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    dom.isContentEditable(target)
  );
};

/**
 * Watches a single frame for whether an editable element (input, textarea,
 * select or contentEditable) currently has focus, and reports transitions to a
 * listener.
 *
 * A content script runs once per frame, so this driver observes only its own
 * frame's focus.  Reporting each frame's editable-focus state to the background
 * lets the background aggregate a single per-tab insert/normal mode, which is
 * what keeps the parent frame and the mode indicator consistent with what is
 * actually focused inside a child frame (e.g. an iframe rich-text editor).
 *
 * Focus moving from one editable element to another briefly fires a
 * `focusout` before the next `focusin`.  Naively reporting each event would
 * emit a spurious "not focused" pulse in between.  The transition is therefore
 * debounced to the next microtask/tick and only the settled state is reported,
 * and only when it actually changed.
 */
export class FocusStateDriver {
  private focused = false;

  private scheduled = false;

  private onChangeListeners: ((focused: boolean) => void)[] = [];

  constructor(private readonly doc: Document = window.document) {
    // `focusin`/`focusout` bubble (unlike `focus`/`blur`), so a single pair of
    // listeners on the document sees focus changes for every element.
    this.doc.addEventListener("focusin", this.schedule);
    this.doc.addEventListener("focusout", this.schedule);
    // When the whole frame loses focus (e.g. focus moves to another frame),
    // no `focusout` targeted at our editable element may fire, so also react to
    // the window blur.
    window.addEventListener("blur", this.schedule);
  }

  onChange(cb: (focused: boolean) => void) {
    this.onChangeListeners.push(cb);
  }

  private schedule = () => {
    if (this.scheduled) {
      return;
    }
    this.scheduled = true;
    // Defer so a `focusout` immediately followed by a `focusin` (moving between
    // editable elements) settles to a single state before we report it.
    Promise.resolve().then(this.settle);
  };

  private settle = () => {
    this.scheduled = false;
    const focused = isEditable(this.doc.activeElement);
    if (focused === this.focused) {
      return;
    }
    this.focused = focused;
    for (const listener of this.onChangeListeners) {
      listener(focused);
    }
  };
}
