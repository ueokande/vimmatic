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
        primary="x"
        secondary="https://x.com/"
      />,
    );

    const item = screen.getByRole("menuitem");
    expect(item.textContent).toContain("x");
    expect(item.textContent).toContain("https://x.com/");
  });
});
