---
title: Console commands
---

# Console commands

Vimmatic provides a console for `ex`-style commands, similar to Vimperator.
The console completes commands by your input.  Press <kbd>Tab</kbd> and <kbd>
Shift</kbd>+<kbd>Tab</kbd> to select next and previous items, respectively.

Open the console with <kbd>:</kbd>. Or populate it with initial values using
<kbd>o</kbd>/<kbd>O</kbd>, <kbd>t</kbd>/<kbd>T</kbd>, or
<kbd>w</kbd>/<kbd>W</kbd>.

## `:help`

Open a [Vimmatic official document](https://ueokande.github.io/vimmatic/) in a new tab.

## `:open`

The `:open` command operates two different ways, depending on the parameter.
When the parameter is a URL, it's opened in the current tab.

```
:open http://github.com/ueokande
```

Otherwise, the current tab opens a search page with the supplied string (defaults to Google).

```
:open How to contribute to Vimmatic
```

To use a search engine other than the default, specify the search engine to use as the first parameter.

```
:open yahoo How to contribute to Vimmatic
```

To adjust the default search-engine and add/remove search engines, see the [search engines](./search_engines) section.

Use <kbd>Tab</kbd> to select from the autocomplete suggestions. To configure this, set the [`complete` property.](./properties#complete)

## `:tabopen`

Open a URL or search-engine query in a new tab.

## `:quit` or `:q`

Close the current tab.

## `:quitall` or `:qa`

Close all tabs.

## `:bdelete`

Close a certain tab.

You can add `!` to the end of the command to close a tab even if it is pinned:

```
:bdelete!
```

## `:bdeletes`

Close tabs matching the specified keywords.

You can add `!` to the end of the command to close pinned tabs:

```
:bdeletes!
```

## `:winopen`

Open a URL or search-engine query in a new window.

## `:buffer`

Select tabs by URL or title keywords.

## `:addbookmark`

Create a bookmark from the current URL.

```
:addbookmark My bookmark title
```

The keymap <kbd>a</kbd> is a convenient way to create a bookmark for the
current page. It populates the console with `:addbookmark` and the title of
the current page.

## `:set`

The `:set` command can be used to temporarily override properties in the
console. See the [properties](./properties) section for more details on
the available properties.

## `:pin`

The `:pin` command pins the current tab or specific tab by URL or title keywords.

```
:pin        " pin the current tab
:pin foobar " pin the tab with "foobar" in the title or URL
```

## `:unpin`

The `:unpin` command unpins the current tab or specific tab by URL or title keywords.

```
:unpin        " unpin the current tab
:unpin foobar " unpin the tab with "foobar" in the title or URL
```

## `:togglepin`

The `:togglepin` command toggles pinning of the current tab or specific tab by URL or title keywords.

```
:togglepin        " toggle pinning of the current tab
:togglepin foobar " toggle pinning of the tab with "foobar" in the title or URL
```
