/**
 * CRUD (add / edit / remove) tests for the Spells section.
 * Requires Magician awakening.
 */
import { expect, test } from "@playwright/test"

import { CharacterBuilderPage } from "../page-objects/CharacterBuilderPage.ts"

test.describe("Spells list (Magician awakening required)", () => {
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
    await builder.setAwakening("Magician")
    await page.getByText("Spells").waitFor()
  })

  test("adds a spell", async ({ page }) => {
    await builder.spells.add("Manabolt", "Mana", "Physical", "Line of Sight")
    await expect(page.getByText("Manabolt")).toBeVisible()
  })

  test("edits a spell name", async ({ page }) => {
    await builder.spells.add("Manabolt", "Mana", "Physical", "Line of Sight")
    await builder.spells.rename("Manabolt", "Manaball")
    await expect(page.getByText("Manaball")).toBeVisible()
    await expect(page.getByText("Manabolt")).not.toBeVisible()
  })

  test("removes a spell", async ({ page }) => {
    await builder.spells.add("Lightning Bolt", "Physical", "Physical", "Line of Sight")
    await expect(page.getByText("Lightning Bolt")).toBeVisible()

    await builder.spells.remove("Lightning Bolt")
    await expect(page.getByText("Lightning Bolt")).not.toBeVisible()
  })
})
