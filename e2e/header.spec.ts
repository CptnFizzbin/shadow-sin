import { test, expect } from "@playwright/test"

test("header shows ShadowSIN", async ({ page }) => {
  // ShadowSIN uses hash-based routing; root path is sufficient for the header
  await page.goto("/")

  // Scope the search to the header landmark (banner) to avoid matching footer/captions.
  const shadowText = page.getByRole("banner").getByText(/ShadowSIN/i)
  await expect(shadowText).toBeVisible({ timeout: 10000 })
})
