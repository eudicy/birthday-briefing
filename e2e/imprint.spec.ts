import { expect, test } from "@playwright/test";

test("visitor can reach the imprint page from the footer", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /imprint/i }).click();

  await expect(page).toHaveURL(/\/imprint$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Imprint" }),
  ).toBeVisible();
});

test("visitor can navigate back to home from the imprint page", async ({ page }) => {
  await page.goto("/imprint");

  await page.getByRole("link", { name: /back to home/i }).click();

  await expect(page).toHaveURL(/\/$/);
});
