import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DesignStudyTodayPage from "./page";
import DesignStudyPage from "../page";

describe("DesignStudyTodayPage", () => {
  it("renders a placeholder name, not a real contact", () => {
    render(<DesignStudyTodayPage />);

    expect(screen.getByText("Placeholder Contact")).toBeInTheDocument();
  });

  it("renders placeholder avatar initials PC", () => {
    render(<DesignStudyTodayPage />);

    expect(screen.getByText("PC")).toBeInTheDocument();
  });

  it("renders an example-birthday badge", () => {
    render(<DesignStudyTodayPage />);

    expect(screen.getByText(/example birthday/i)).toBeInTheDocument();
  });

  it("renders a mock disclaimer noting the screen has no live data", () => {
    render(<DesignStudyTodayPage />);

    expect(screen.getByText(/no live data/i)).toBeInTheDocument();
  });

  it("renders a Call button", () => {
    render(<DesignStudyTodayPage />);

    const callButton = screen.getByRole("button", { name: /call/i });
    expect(callButton).toBeInTheDocument();
    expect(callButton).not.toHaveAttribute("onclick");
  });

  it("renders a Message button", () => {
    render(<DesignStudyTodayPage />);

    const messageButton = screen.getByRole("button", { name: /message/i });
    expect(messageButton).toBeInTheDocument();
    expect(messageButton).not.toHaveAttribute("onclick");
  });

  it("renders a back link to /design-study", () => {
    render(<DesignStudyTodayPage />);

    const backLink = screen.getByRole("link", {
      name: /back to upcoming birthdays/i,
    });
    expect(backLink).toHaveAttribute("href", "/design-study");
  });

  it("matches the phone-frame chrome of /design-study exactly", () => {
    const { container: todayContainer } = render(<DesignStudyTodayPage />);
    const { container: studyContainer } = render(<DesignStudyPage />);

    const todayOuter = todayContainer.querySelector(
      'div[class*="rounded-\\[2\\.5rem\\]"]',
    );
    const studyOuter = studyContainer.querySelector(
      'div[class*="rounded-\\[2\\.5rem\\]"]',
    );
    expect(todayOuter).not.toBeNull();
    expect(studyOuter).not.toBeNull();
    expect(todayOuter?.className).toBe(studyOuter?.className);

    const todayInner = todayOuter?.querySelector(
      'div[class*="rounded-\\[1\\.75rem\\]"]',
    );
    const studyInner = studyOuter?.querySelector(
      'div[class*="rounded-\\[1\\.75rem\\]"]',
    );
    expect(todayInner).not.toBeNull();
    expect(studyInner).not.toBeNull();
    expect(todayInner?.className).toBe(studyInner?.className);
  });
});
