---
title: Keymaps
---

# Keymaps

The following descriptions are the default keymaps.
You can configure keymaps in the add-on's preferences by navigating to `about:addons` and selecting "Extensions".

In the following descriptions, <kbd>Ctrl</kbd>+<kbd>x</kbd> means "press <kbd>x</kbd> with <kbd>Ctrl</kbd>", and <kbd>g</kbd><kbd>x</kbd> means "press <kbd>g</kbd>, then press <kbd>x</kbd>".
Some commands may be preceded by a decimal number, such as <kbd>3</kbd><kbd>d</kbd> deletes three tabs.

## Scrolling

- <kbd>k</kbd>: scroll up
- <kbd>j</kbd>: scroll down
- <kbd>h</kbd>: scroll left
- <kbd>l</kbd>: scroll right
- <kbd>Ctrl</kbd>+<kbd>u</kbd>: scroll up half a page
- <kbd>Ctrl</kbd>+<kbd>d</kbd>: scroll down half a page
- <kbd>Ctrl</kbd>+<kbd>b</kbd>: scroll up a page
- <kbd>Ctrl</kbd>+<kbd>f</kbd>: scroll down a page
- <kbd>g</kbd><kbd>g</kbd>: scroll to the top of a page
- <kbd>G</kbd>: scroll to the bottom of a page
- <kbd>0</kbd>: scroll to the leftmost part of a page
- <kbd>$</kbd>: scroll to the rightmost part of a page
- <kbd>m</kbd>: set a mark for the current position
- <kbd>'</kbd>: jump to a marked position

Lowercase marks (`[a-z]`) store the position of the current tab. Uppercase and
numeric marks (`[A-Z0-9]`) store the position and the tab.

## Select and manage tabs

- <kbd>d</kbd>: delete the current tab and select the tab to its right
- <kbd>D</kbd>: delete the current tab and select the tab to its left
- <kbd>!</kbd><kbd>d</kbd>: delete a pinned tab
- <kbd>u</kbd>: reopen a closed tab
- <kbd>r</kbd>: reload the current tab
- <kbd>R</kbd>: reload the current tab, bypassing the cache
- <kbd>K</kbd> or <kbd>g</kbd><kbd>T</kbd>: select the previous tab
- <kbd>J</kbd> or <kbd>g</kbd><kbd>t</kbd>: select the next tab
- <kbd>g</kbd><kbd>0</kbd>: select the first tab
- <kbd>g</kbd><kbd>$</kbd>: select the last tab
- <kbd>Ctrl</kbd>+<kbd>6</kbd>: open the previously-selected tab
- <kbd>z</kbd><kbd>p</kbd>: pin the curent tab tab
- <kbd>z</kbd><kbd>d</kbd>: duplicate the current tab

## Console

- <kbd>:</kbd>: open the console
- <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>: open a page in the current tab, a new tab, or new window
- <kbd>O</kbd>, <kbd>T</kbd>, <kbd>W</kbd>: similar to <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>, but using the current URL
- <kbd>b</kbd>: select tabs by URL or title
- <kbd>a</kbd>: add the current page to your bookmarks

See the [console commands](./console_commands) section for a more detailed description.

## Zoom

- <kbd>z</kbd><kbd>i</kbd>: zoom in
- <kbd>z</kbd><kbd>o</kbd>: zoom out
- <kbd>z</kbd><kbd>z</kbd>: zoom neutral (reset)

## Navigation

- <kbd>H</kbd>: go back in history
- <kbd>L</kbd>: go forward in history
- <kbd>[</kbd><kbd>[</kbd>, <kbd>]</kbd><kbd>]</kbd>: find a link to the previous/next page and open it
- <kbd>g</kbd><kbd>u</kbd>: go to the parent directory
- <kbd>g</kbd><kbd>U</kbd>: go to the root directory
- <kbd>g</kbd><kbd>i</kbd>: focus the first input field

Vimmatic can be configured to follow links opened in tabs in the background
instead of switching to a new tab immediately. To do this, you'll need to update
the config file: change the `"background"` property of the `"hint.quick"`
action to `true`, e.g.:

```json
{
    "keymaps": {
        "F": { "type": "hint.quick", "newTab": true, "background": false }
    }
}
```

## Hints

Hint mode is a way to follow links or select elements on a page by typing
characters.  Users can type the sequence of characters to select a hint, or
press.  <kbd>Enter</kbd> selects the hint which is currently typed, and <kbd>
Esc</kbd> or <kbd>Ctrl</kbd>+<kbd>[</kbd> cancels hint mode.

The following keymaps are available in hint mode:

- <kbd>f</kbd>: start a quick hint mode to open links in the current tab or select elements
- <kbd>F</kbd>: start a quick hint mode to open links in a new tab
- <kbd>;</kbd><kbd>i</kbd>: open an image in the current tab
- <kbd>;</kbd><kbd>I</kbd>: open an image in a new tab
- <kbd>;</kbd><kbd>y</kbd>: copy a link URL to the clipboard
- <kbd>;</kbd><kbd>Y</kbd>: copy a link text to the clipboard
- <kbd>;</kbd><kbd>v</kbd>: open a source URL in the current tab
- <kbd>;</kbd><kbd>V</kbd>: open a source URL in a new tab
- <kbd>;</kbd><kbd>o</kbd>: open a URL in the current tab
- <kbd>;</kbd><kbd>t</kbd>: open a URL in a new tab
- <kbd>;</kbd><kbd>w</kbd>: open a URL in a new window
- <kbd>;</kbd><kbd>O</kbd>: open the console with `:open` and the selected URL
- <kbd>;</kbd><kbd>T</kbd>: open the console with `:tabopen` and the selected URL
- <kbd>;</kbd><kbd>W</kbd>: open the console with `:winopen` and the selected URL

## Misc

- <kbd>y</kbd>: copy the URL of the current tab to the clipboard
- <kbd>p</kbd>: open the clipboard's URL in the current tab
- <kbd>P</kbd>: open the clipboard's URL in new tab
- <kbd>Shift</kbd>+<kbd>Esc</kbd>: enable or disable the add-on in the current tab
- <kbd>/</kbd>: start searching for text in the page
- <kbd>n</kbd>: find the next search result in the page
- <kbd>N</kbd>: find the previous search result in the page
- <kbd>g</kbd><kbd>f</kbd>: view the source of the current tab


