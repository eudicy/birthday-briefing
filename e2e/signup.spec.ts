import { expect, test } from "@playwright/test";

test("visitor can join the waitlist", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Email").fill("visitor@example.com");
  await page.getByRole("button", { name: /join waitlist/i }).click();

  await expect(page.getByRole("status")).toContainText("You're on the list!");
});

test("invalid email is blocked client-side and never reaches the success message", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: /join waitlist/i }).click();

  await expect(page.getByRole("status")).toHaveCount(0);
});
