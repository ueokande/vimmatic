import React from "react";
import ReactTestRenderer from "react-test-renderer";
import { CompletionItem } from "../../../../src/console/completion/components/CompletionItem";
import { describe, it, expect } from "vitest";

describe("console/components/console/completion/CompletionItem", () => {
  it("renders a CompletionItem", () => {
    const root = ReactTestRenderer.create(
      <CompletionItem
        shown={true}
        highlight={false}
        primary="twitter"
        secondary="https://twitter.com/"
      />,
    ).root;
    const spans = root.findAllByType("span");
    expect(spans).toHaveLength(2);
    expect(spans[0].children).toEqual(["twitter"]);
    expect(spans[1].children).toEqual(["https://twitter.com/"]);
  });
});
