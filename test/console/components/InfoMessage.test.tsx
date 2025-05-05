/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { InfoMessage } from "../../../src/console/components/InfoMessage";
import { describe, it, expect } from "vitest";

describe("console/components/console/completion/InfoMessage", () => {
  it("renders an information message", () => {
    render(<InfoMessage>Hello!</InfoMessage>);

    const p = screen.getByRole("status");
    expect(p.textContent).toEqual("Hello!");
  });
});
