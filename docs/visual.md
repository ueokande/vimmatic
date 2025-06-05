---
title: Visual Mode
---


# Visual Mode

## How to trigger
Unlike in the classic vim case, simply pressing <V> is not enough, 
due to the specific behavior of the cursor inside the browser. 
Therefore, the main (if not the only) way to unambiguously select the desired 
character or sequence of characters is to search for the desired sequence through the already

# How to use

After finding a match, you can also press <Enter> (find.visual.start key), 
visual mode is activated, after which the following commands are available:
<h> - moving the carriage to the left
<l> - moving the carriage to the right
<e> - moving the carriage to the end of the word
<w> - moving the carriage to the beginning of the word
<b> - moving the carriage back to the beginning of the word

The functionality from FindMode is also available, 
which allows you to change the focus through n/N to the current match. 
With each move, the selection carriage is updated and corresponds to the end of the match.

