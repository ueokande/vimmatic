/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompletionItem } from "../../../../src/console/completion/components/CompletionItem";

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
