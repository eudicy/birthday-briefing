import { afterEach, describe, expect, it, vi } from "vitest";

const { createContact, MockBrevoError } = vi.hoisted(() => {
  class MockBrevoError extends Error {
    body?: unknown;
    constructor(opts: { message?: string; body?: unknown }) {
      super(opts.message);
      this.body = opts.body;
    }
  }
  return { createContact: vi.fn(), MockBrevoError };
});

vi.mock("@getbrevo/brevo", () => ({
  BrevoClient: class {
    contacts = { createContact };
  },
  BrevoError: MockBrevoError,
}));

import { subscribe } from "./subscribe";

function formDataWith(email: string) {
  const fd = new FormData();
  fd.set("email", email);
  return fd;
}

const initialState = { success: false, message: "" };

describe("subscribe", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    createContact.mockReset();
  });

  it("rejects an invalid email", async () => {
    const result = await subscribe(initialState, formDataWith("not-an-email"));
    expect(result).toEqual({
      success: false,
      message: "Enter a valid email address.",
    });
    expect(createContact).not.toHaveBeenCalled();
  });

  it("returns a dry-run success when Brevo keys are unset outside production", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    vi.stubEnv("BREVO_LIST_ID", "");
    vi.stubEnv("NODE_ENV", "test");

    const result = await subscribe(initialState, formDataWith("a@example.com"));

    expect(result.success).toBe(true);
    expect(result.message).toContain("dry-run");
    expect(createContact).not.toHaveBeenCalled();
  });

  it("returns a failure when Brevo keys are unset in production", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    vi.stubEnv("BREVO_LIST_ID", "");
    vi.stubEnv("NODE_ENV", "production");

    const result = await subscribe(initialState, formDataWith("a@example.com"));

    expect(result).toEqual({
      success: false,
      message: "Signup temporarily unavailable, try again later.",
    });
    expect(createContact).not.toHaveBeenCalled();
  });

  it("returns success when the contact is created", async () => {
    vi.stubEnv("BREVO_API_KEY", "key");
    vi.stubEnv("BREVO_LIST_ID", "42");
    createContact.mockResolvedValueOnce({});

    const result = await subscribe(initialState, formDataWith("a@example.com"));

    expect(result).toEqual({ success: true, message: "You're on the list!" });
    expect(createContact).toHaveBeenCalledWith({
      email: "a@example.com",
      listIds: [42],
    });
  });

  it("treats a duplicate contact as a friendly success", async () => {
    vi.stubEnv("BREVO_API_KEY", "key");
    vi.stubEnv("BREVO_LIST_ID", "42");
    createContact.mockRejectedValueOnce(
      new MockBrevoError({ body: { code: "duplicate_parameter" } }),
    );

    const result = await subscribe(initialState, formDataWith("a@example.com"));

    expect(result).toEqual({
      success: true,
      message: "You're already on the list!",
    });
  });

  it("returns a failure message on a generic Brevo error", async () => {
    vi.stubEnv("BREVO_API_KEY", "key");
    vi.stubEnv("BREVO_LIST_ID", "42");
    createContact.mockRejectedValueOnce(new Error("network down"));

    const result = await subscribe(initialState, formDataWith("a@example.com"));

    expect(result).toEqual({
      success: false,
      message: "Something went wrong, try again.",
    });
  });
});
