import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./HeroSection";

describe("HeroSection", () => {
  it("renders the headline and a CTA link to the signup form", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", { name: /never miss a birthday again/i }),
    ).toBeInTheDocument();

    const cta = screen.getByRole("link", { name: /get early access/i });
    expect(cta).toHaveAttribute("href", "#signup");
  });
});
