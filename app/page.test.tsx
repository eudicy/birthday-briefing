import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders all 4 sections in order: hero, problem, solution, CTA", () => {
    render(<Home />);

    const bodyText = document.body.textContent ?? "";
    const heroIndex = bodyText.search(/never miss a birthday again/i);
    const problemIndex = bodyText.search(/birthdays slip through the cracks/i);
    const solutionIndex = bodyText.search(/birthday briefing has you covered/i);
    const ctaIndex = bodyText.search(/join waitlist/i);

    expect(heroIndex).toBeGreaterThanOrEqual(0);
    expect(problemIndex).toBeGreaterThan(heroIndex);
    expect(solutionIndex).toBeGreaterThan(problemIndex);
    expect(ctaIndex).toBeGreaterThan(solutionIndex);

    expect(
      screen.getByRole("textbox", { name: /email/i }),
    ).toBeInTheDocument();
  });
});
