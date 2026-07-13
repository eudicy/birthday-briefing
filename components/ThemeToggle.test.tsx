import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

function renderToggle() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

afterEach(() => {
  document.documentElement.classList.remove("dark");
  window.localStorage.clear();
});

describe("ThemeToggle", () => {
  it("offers light, dark, and system options", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));

    expect(
      await screen.findByRole("menuitem", { name: /light/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /dark/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /system/i }),
    ).toBeInTheDocument();
  });

  it("applies the dark class to the document when Dark is selected", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    await user.click(await screen.findByRole("menuitem", { name: /dark/i }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
