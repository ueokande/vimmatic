/**
 * @vitest-environment jsdom
 */

import { render } from "@testing-library/react";
import { CompletionTitle } from "../../../../src/console/completion/components/CompletionTitle";
import { describe, it, expect } from "vitest";

describe("console/components/console/completion/CompletionTitle", () => {
  it("renders a CompletionTitle", () => {
    const { container } = render(
      <CompletionTitle title="Fruits" shown={true} />,
    );

    expect(container.textContent).toBe("Fruits");
  });
});
