import { expect, test } from "@playwright/test"

/**
 * Home page (/#/) smoke tests.
 *
 * These tests verify the initial view rendered when the app loads with no
 * characters in storage. Each test starts from a clean localStorage state so
 * they are fully independent of each other and of any data seeded by other
 * suites.
 */
test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test so character data never bleeds between runs.
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  // ─── Header component ────────────────────────────────────────────────────────

  test("displays the app title in the header", async ({ page }) => {
    await expect(page.getByText("ShadowSIN 4e")).toBeVisible()
  })

  test("renders the header as a sticky app bar", async ({ page }) => {
    const appBar = page.locator("header")
    await expect(appBar).toBeVisible()
  })

  // ─── Create New button ───────────────────────────────────────────────────────

  test("shows a Create New button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Create New" })).toBeVisible()
  })

  // ─── Navigation ──────────────────────────────────────────────────────────────

  test("navigates to the character builder when Create New is clicked", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Create New" }).click()

    // Hash-based routing: the URL hash should now be #/new
    await expect(page).toHaveURL(/#\/new/)
  })

  // ─── Empty state ─────────────────────────────────────────────────────────────

  test("shows no character list items when storage is empty", async ({
    page,
  }) => {
    const listItems = page.getByRole("listitem")
    await expect(listItems).toHaveCount(0)
  })

  // ─── Footer ──────────────────────────────────────────────────────────────────

  test("renders the disclaimer footer", async ({ page }) => {
    await expect(
      page.getByText("ShadowSIN is an independent fan project"),
    ).toBeVisible()
  })
})
