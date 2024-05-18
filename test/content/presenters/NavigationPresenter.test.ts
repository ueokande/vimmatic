/**
 * @vitest-environment jsdom
 */

import { NavigationPresenterImpl } from "../../../src/content/presenters/NavigationPresenter";
import { describe, beforeEach, test, expect } from "vitest";

describe("NavigationPresenterImpl", () => {
  beforeEach(() => {
    document.location.hash = "";
    document.body.innerHTML = "";
  });

  test.each([
    '<link rel="prev" href="#prev" />',
    '<link rel="prev bar" href="#prev" />',
    '<link rel="foo prev" href="#prev" />',
    '<link rel="foo prev bar" href="#prev" />',
    '<a rel="prev" href="#prev">click me</a>',
    '<a rel="prev bar" href="#prev">click me</a>',
    '<a rel="foo prev" href="#prev">click me</a>',
    '<a rel="foo prev bar" href="#prev">click me</a>',
    '<a href="#dummy">preview</a><a href="#prev">go to prev</a>',
    '<a href="#dummy">previously</a><a href="#prev">previous page</a>',
    '<a href="#dummy">click me</a><a href="#prev">&lt;&lt;</a>',
    `<a rel="prev" href="#dummy" onclick="return location = '#prev', false">go to prev</a>`,
    '<a rel="prev" href="#dummy">click me</a><link rel="prev" href="#prev" />',
    '<a href="#dummy">go to prev</a><a rel="prev" href="#prev">click me</a>',
  ])("navigates to #prev for %s", async (html) => {
    document.body.innerHTML = html;
    new NavigationPresenterImpl().openLinkPrev();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.location.hash).toEqual("#prev");
  });

  test.each([
    '<link rel="next" href="#next" />',
    '<link rel="next bar" href="#next" />',
    '<link rel="foo next" href="#next" />',
    '<link rel="foo next bar" href="#next" />',
    '<a rel="next" href="#next">click me</a>',
    '<a rel="next bar" href="#next">click me</a>',
    '<a rel="foo next" href="#next">click me</a>',
    '<a rel="foo next bar" href="#next">click me</a>',
    '<a href="#dummy">inextricable</a><a href="#next">go to next</a>',
    '<a href="#dummy">click me</a><a href="#next">&gt;&gt;</a>',
    `<a rel="next" href="#dummy" onclick="return location = '#next', false">go to next</a>`,
    '<a rel="next" href="#dummy">click me</a><link rel="next" href="#next" />',
    '<a href="#dummy">next page</a><a rel="next" href="#next">click me</a>',
  ])("navigates to #next for %s", async (html) => {
    document.body.innerHTML = html;
    new NavigationPresenterImpl().openLinkNext();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.location.hash).toEqual("#next");
  });
});
