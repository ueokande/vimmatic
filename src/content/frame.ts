// Some libraries build UI parts (rich-text editors, widgets) inside an iframe
// that has no real document URL of its own -- it is `about:blank` or an
// `about:srcdoc` document that JavaScript populates.  Those frames are not
// "pages" the user navigates, so running Vim key handling inside them is
// unwanted: it fights with the editor and produces the confusing cross-frame
// mode state.  The top window is always treated as a real page (it is never a
// UI-part frame, and disabling it would disable the addon entirely).
export const isBlankUrlFrame = (win: Window): boolean => {
  if (win === win.top) {
    return false;
  }

  let href: string;
  try {
    href = win.location.href;
  } catch {
    // A cross-origin ancestor can make `location` inaccessible; such a frame
    // has a real document, so treat it as a page.
    return false;
  }

  return href === "about:blank" || href === "about:srcdoc" || href === "";
};
