/**
 * CRUD (add / edit / remove) tests for the Complex Forms section.
 * Requires Technomancer awakening.
 */
import { expect, test } from "@playwright/test"

import { CharacterBuilderPage } from "../page-objects/CharacterBuilderPage.ts"

test.describe("Complex forms list (Technomancer awakening required)", () => {
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
    await builder.setAwakening("Technomancer")
    await page.getByText("Complex Forms").waitFor()
    // Raise resonance to 5 so all rating options are available.
    await builder.attributes.setValue("RES", 5)
  })

  test("adds a complex form", async ({ page }) => {
    await builder.complexForms.add("Exploit", 5)
    await expect(page.getByText("Exploit")).toBeVisible()
  })

  test("edits a complex form name", async ({ page }) => {
    await builder.complexForms.add("Exploit", 3)
    await builder.complexForms.rename("Exploit", "Analyze")
    await expect(page.getByText("Analyze")).toBeVisible()
    await expect(page.getByText("Exploit")).not.toBeVisible()
  })

  test("removes a complex form", async ({ page }) => {
    await builder.complexForms.add("Stealth", 4)
    await expect(page.getByText("Stealth")).toBeVisible()

    await builder.complexForms.remove("Stealth")
    await expect(page.getByText("Stealth")).not.toBeVisible()
  })

  test("adds multiple complex forms and all appear in the list", async ({
    page,
  }) => {
    const forms = ["Analyze", "Browse", "Attack", "Edit", "Scan"]
    for (const name of forms) {
      await builder.complexForms.add(name, 3)
    }
    for (const name of forms) {
      await expect(page.getByText(name)).toBeVisible()
    }
  })
})
