import { expect, test } from "@playwright/test"

import { CharacterBuilderPage } from "./page-objects/CharacterBuilderPage.ts"

/**
 * Character builder (/#/new) smoke tests.
 *
 * These tests verify that the new-character route renders correctly and that
 * the key UI regions of the character form are present. They do not submit the
 * form or create a real character — that level of coverage belongs in a
 * dedicated integration suite.
 */
test.describe("Character builder", () => {
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
  })

  // ─── Page-level elements ──────────────────────────────────────────────────

  test("renders the app header without a character alias", async ({ page }) => {
    // When no character is loaded the header shows the default app title.
    // The Typography component uses component="div" so we match by text content.
    await expect(page.getByText("ShadowSIN 4e")).toBeVisible()
  })

  // ─── Character form structure ─────────────────────────────────────────────

  test("shows the Profile section", async ({ page }) => {
    await expect(page.getByText("Profile")).toBeVisible()
  })

  test("shows the Biology section", async ({ page }) => {
    await expect(page.getByText("Biology")).toBeVisible()
  })

  test("shows the Attributes section", async ({ page }) => {
    await expect(page.getByText("Attributes")).toBeVisible()
  })

  test("shows the Skills section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Skills" })).toBeVisible()
  })

  // ─── Build-points summary footer ─────────────────────────────────────────

  test("shows the BP summary footer with the full 400 BP allowance", async ({
    page,
  }) => {
    // The BpSummaryFooter displays total build points. The max is 400 BP.
    await expect(page.getByText(/400/)).toBeVisible()
  })

  // ─── Form controls ────────────────────────────────────────────────────────

  test("shows a Reset button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Reset" })).toBeVisible()
  })

  test("shows a Name field in the Profile section", async ({ page }) => {
    // Alias / name input exists and is editable.
    const nameInput = page.getByRole("textbox", { name: /name/i }).first()
    await expect(nameInput).toBeVisible()
    await expect(nameInput).toBeEditable()
  })

  // ─── Interaction smoke test ───────────────────────────────────────────────

  test("allows typing in the Name field", async ({ page }) => {
    const nameInput = page.getByRole("textbox", { name: /name/i }).first()
    await nameInput.fill("Ghost")
    await expect(nameInput).toHaveValue("Ghost")
  })
})
