/**
 * CRUD (add / edit / remove) tests for the Qualities section.
 */
import { expect, test } from "@playwright/test"

import { CharacterBuilderPage } from "../page-objects/CharacterBuilderPage.ts"

test.describe("Qualities list", () => {
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
  })

  test("adds a positive quality", async ({ page }) => {
    await builder.qualities.add("Analytical Mind", "positive", 5)
    await expect(page.getByText("Analytical Mind")).toBeVisible()
  })

  test("adds a negative quality", async ({ page }) => {
    await builder.qualities.add("Mild Allergy to Sunlight", "negative", 10)
    await expect(page.getByText("Mild Allergy to Sunlight")).toBeVisible()
  })

  test("edits a quality name", async ({ page }) => {
    await builder.qualities.add("Low Pain Tolerance", "negative", 10)
    await builder.qualities.rename("Low Pain Tolerance", "Low Pain Tolerance (Revised)")
    await expect(page.getByText("Low Pain Tolerance (Revised)")).toBeVisible()
    await expect(page.getByText("Low Pain Tolerance", { exact: true })).not.toBeVisible()
  })

  test("removes a negative quality", async ({ page }) => {
    await builder.qualities.add("Sensitive System", "negative", 15)
    await expect(page.getByText("Sensitive System")).toBeVisible()

    await builder.qualities.remove("Sensitive System")
    await expect(page.getByText("Sensitive System")).not.toBeVisible()
  })
})
