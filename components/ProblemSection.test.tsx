import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemSection } from "./ProblemSection";

describe("ProblemSection", () => {
  it("renders the problem and audience heading and copy", () => {
    render(<ProblemSection />);

    expect(
      screen.getByRole("heading", { name: /birthdays slip through the cracks/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/consistently miss important birthdays/i),
    ).toBeInTheDocument();
  });
});
