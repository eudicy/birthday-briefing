import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DesignStudyPage from "./page";

describe("DesignStudyPage", () => {
  it("renders the screen heading", () => {
    render(<DesignStudyPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Upcoming Birthdays" }),
    ).toBeInTheDocument();
  });

  it("renders Today, This Week, Next Week groups in order", () => {
    render(<DesignStudyPage />);

    const bodyText = document.body.textContent ?? "";
    const todayIndex = bodyText.search(/today/i);
    const thisWeekIndex = bodyText.search(/this week/i);
    const nextWeekIndex = bodyText.search(/next week/i);

    expect(todayIndex).toBeGreaterThanOrEqual(0);
    expect(thisWeekIndex).toBeGreaterThan(todayIndex);
    expect(nextWeekIndex).toBeGreaterThan(thisWeekIndex);
  });

  it("renders name + date rows for mock birthdays", () => {
    render(<DesignStudyPage />);

    expect(screen.getByText("Anna Keller")).toBeInTheDocument();
    expect(screen.getByText("Jul 14")).toBeInTheDocument();
    expect(screen.getByText("Markus Lehner")).toBeInTheDocument();
    expect(screen.getByText("Jul 16")).toBeInTheDocument();
  });

  it("renders a link back to home", () => {
    render(<DesignStudyPage />);

    const backLink = screen.getByRole("link", { name: /back to home/i });
    expect(backLink).toHaveAttribute("href", "/");
  });
});
