import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { subscribeMock } = vi.hoisted(() => ({ subscribeMock: vi.fn() }));

vi.mock("@/app/actions/subscribe", () => ({
  subscribe: subscribeMock,
}));

import { SignupForm } from "./SignupForm";

afterEach(() => {
  subscribeMock.mockReset();
});

describe("SignupForm", () => {
  it("shows a success message after a successful submit", async () => {
    subscribeMock.mockResolvedValue({
      success: true,
      message: "You're on the list!",
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "a@example.com");
    await user.click(screen.getByRole("button", { name: /join waitlist/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "You're on the list!",
    );
    expect(subscribeMock).toHaveBeenCalled();
  });

  it("shows an error message when submit fails", async () => {
    subscribeMock.mockResolvedValue({
      success: false,
      message: "Something went wrong, try again.",
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "a@example.com");
    await user.click(screen.getByRole("button", { name: /join waitlist/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Something went wrong, try again.",
    );
  });

  it("shows a pending state while the action is in flight", async () => {
    let resolve!: (value: { success: boolean; message: string }) => void;
    const promise = new Promise<{ success: boolean; message: string }>(
      (r) => {
        resolve = r;
      },
    );
    subscribeMock.mockReturnValue(promise);
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "a@example.com");
    await user.click(screen.getByRole("button", { name: /join waitlist/i }));

    expect(
      await screen.findByRole("button", { name: /joining/i }),
    ).toBeDisabled();

    resolve({ success: true, message: "You're on the list!" });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "You're on the list!",
    );
  });
});
