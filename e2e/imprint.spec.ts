import { expect, test } from "@playwright/test";

test("visitor can reach the imprint page from the footer", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /imprint/i }).click();

  await expect(page).toHaveURL(/\/imprint$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Imprint (Impressum)" }),
  ).toBeVisible();
});
