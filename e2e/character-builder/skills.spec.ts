/**
 * CRUD (add / edit / remove) tests for Active Skills and Skill Groups.
 */
import { expect, test } from "@playwright/test"

import { CharacterBuilderPage } from "../page-objects/CharacterBuilderPage.ts"

// ─── Active Skills ────────────────────────────────────────────────────────────

test.describe("Active skills list", () => {
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
  })

  test("adds an active skill", async ({ page }) => {
    await builder.skills.addSkill("Spellcasting", 5)
    await expect(page.getByText("Spellcasting")).toBeVisible()
  })

  test("edits an active skill to add a specialization", async ({ page }) => {
    await builder.skills.addSkill("Pilot Ground Craft", 4)
    await builder.skills.editSpecialization("Pilot Ground Craft", "Trucks")
    await expect(page.getByText("Trucks")).toBeVisible()
  })

  test("edits an active skill to clear its specialization", async ({ page }) => {
    await builder.skills.addSkill("Etiquette", 2, "Street")
    await expect(page.getByText("Street")).toBeVisible()

    await builder.skills.editSpecialization("Etiquette", null)
    await expect(page.getByText("Street")).not.toBeVisible()
  })

  test("removes an active skill", async ({ page }) => {
    await builder.skills.addSkill("Dodge", 3)
    await expect(page.getByText("Dodge")).toBeVisible()

    await builder.skills.removeSkill("Dodge")
    await expect(page.getByText("Dodge")).not.toBeVisible()
  })
})

// ─── Skill Groups ─────────────────────────────────────────────────────────────

test.describe("Skill groups list", () => {
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
  })

  test("adds a skill group", async ({ page }) => {
    await builder.skills.addGroup("Conjuring", 3)
    await expect(page.getByText("Conjuring")).toBeVisible()
  })

  test("edits a skill group rating", async ({ page }) => {
    await builder.skills.addGroup("Cracking", 3)
    await builder.skills.editGroupRating("Cracking", 4)
    await expect(page.getByText("Cracking")).toBeVisible()
  })

  test("removes a skill group", async ({ page }) => {
    await builder.skills.addGroup("Electronics", 2)
    await expect(page.getByText("Electronics")).toBeVisible()

    await builder.skills.removeGroup("Electronics")
    await expect(page.getByText("Electronics")).not.toBeVisible()
  })
})
