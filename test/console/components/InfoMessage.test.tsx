/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InfoMessage } from "../../../src/console/components/InfoMessage";

describe("console/components/console/completion/InfoMessage", () => {
  it("renders an information message", () => {
    render(<InfoMessage>Hello!</InfoMessage>);

    const p = screen.getByRole("status");
    expect(p.textContent).toEqual("Hello!");
  });
});
