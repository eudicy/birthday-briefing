"use server";

import { BrevoClient, BrevoError } from "@getbrevo/brevo";

export type SubscribeState = {
  success: boolean;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prevState: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return { success: false, message: "Enter a valid email address." };
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[subscribe] dry-run, no BREVO_API_KEY/BREVO_LIST_ID set");
      return { success: true, message: "You're on the list! (dry-run)" };
    }
    console.error("[subscribe] missing BREVO_API_KEY/BREVO_LIST_ID in production");
    return { success: false, message: "Signup temporarily unavailable, try again later." };
  }

  const client = new BrevoClient({ apiKey });

  try {
    await client.contacts.createContact({
      email,
      listIds: [Number(listId)],
    });
    return { success: true, message: "You're on the list!" };
  } catch (error) {
    if (error instanceof BrevoError && error.body && typeof error.body === "object" && "code" in error.body && error.body.code === "duplicate_parameter") {
      return { success: true, message: "You're already on the list!" };
    }
    console.error("[subscribe] Brevo error", error);
    return { success: false, message: "Something went wrong, try again." };
  }
}
