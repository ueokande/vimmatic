---
title: Vimmatic
---

# Vimmatic

Vimmatic allows you to browse web pages with Vim-like key binds.

This extension enables you to navigate pages, switch tabs, and open a site you
want with your keyboard.  The extension provides a Vim-like experience on your
browser and a new choice for Vim users.  You can configure keymaps and browse
pages with your preferences.

Vimmatic provides the following features:
Scrolling a page and managing tabs with keyboard shortcuts
Also, they are available by a command
Opening a page from bookmarks and histories.
Custom search engined
Setting keymaps by a JSON-format configuration.

For usage and more detailed information, check out our [documentation][].
The development of Vimmatic is publically available as open-source software.
Feel free to contact us at [github repository][].

[documentation]: https://ueokande.github.io/vimmatic/
[github repository]: https://github.com/ueokande/vimmatic

## Getting started

### Install Vimmatic

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Get an add-on][get_firefox]                                                                                                                                                                                      | [Get an extension (experimental support)][get_chrome]                                                                                                                                                         |

### Quick start

After installation, you can control Firefox with vim-like keymaps.  To scroll a
page in the browser, press <kbd>k</kbd>, <kbd>j</kbd>, <kbd>h</kbd> and
<kbd>l</kbd> keys.  You can scroll to the top or the bottom of a page by
<kbd>g</kbd><kbd>g</kbd> and <kbd>G</kbd>.

To select a left and right of current tab, use <kbd>K</kbd> and <kbd>J</kbd>
respectively.  To close current tab, use <kbd>d</kbd> and to restore closed
tabs, use <kbd>u</kbd>.

To open a link, press <kbd>f</kbd> to enter the **follow mode** to select a
link.  Then you can select links by alphabetic keys.

See also [Keymaps](./keymaps.md) for more detailed of keymaps.

### Using commands

Vimmatic supports command line to run commands that control tabs and opens a
tab.  To open command line, press <kbd>:</kbd>.

To open a tab with URL, use `open` command as the following:

```
:open https://github.com/ueokande/vimmatic
```

or search keywords with search engine (such as Google) like:

```
:open How to use Vim
```

You can see completed commands on [Console commands](./console_commands.md).

## Copyright

Copyright © Shin'ya Ueoka and contributors

[Get_firefox]: https://addons.mozilla.org/en-US/firefox/addon/vimmatic/
[Get_chrome]: https://chrome.google.com/webstore/detail/vimmatic/pghmfgnakhjiphmlcnhfpgopkcjhiedc
