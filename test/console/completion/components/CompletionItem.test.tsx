/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { CompletionItem } from "../../../../src/console/completion/components/CompletionItem";
import { describe, it, expect } from "vitest";

describe("console/components/console/completion/CompletionItem", () => {
  it("renders a CompletionItem", () => {
    render(
      <CompletionItem
        shown={true}
        highlight={false}
        primary="twitter"
        secondary="https://twitter.com/"
      />,
    );

    const row = screen.getByRole("menuitem");
    expect(row.textContent).toContain("twitter");
    expect(row.textContent).toContain("https://twitter.com/");
  });
});
