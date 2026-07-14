import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the copyright and a contact link", () => {
    render(<Footer />);

    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()} Birthday Briefing`)),
    ).toBeInTheDocument();

    const contact = screen.getByRole("link", { name: /contact/i });
    expect(contact).toHaveAttribute("href", "mailto:hello@birthdaybriefing.app");

    const imprint = screen.getByRole("link", { name: /imprint/i });
    expect(imprint).toHaveAttribute("href", "/imprint");

    const designStudy = screen.getByRole("link", { name: /view design study/i });
    expect(designStudy).toHaveAttribute("href", "/design-study");
  });
});
