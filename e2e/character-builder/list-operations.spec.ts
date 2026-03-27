/**
 * CRUD (add / edit / remove) tests for every list-based section of the
 * character builder: active skills, skill groups, qualities, spells, complex
 * forms, and contacts.
 *
 * These tests were extracted from the individual build-*.spec.ts files so that
 * the build specs can focus solely on the full-build + BP-summary flow.
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

// ─── Qualities ────────────────────────────────────────────────────────────────

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

// ─── Spells ───────────────────────────────────────────────────────────────────

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

// ─── Complex Forms ────────────────────────────────────────────────────────────

test.describe("Complex forms list (Technomancer awakening required)", () => {
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
    await builder.setAwakening("Technomancer")
    await page.getByText("Complex Forms").waitFor()
    // Raise resonance to 5 so all rating options are available.
    await builder.attributes.increment("RES", 4)
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

// ─── Contacts ─────────────────────────────────────────────────────────────────

test.describe("Contacts list", () => {
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
  })

  test("adds a contact with specific connection and loyalty", async ({ page }) => {
    await builder.contacts.add("Mr. Johnson", 4, 1)
    await expect(page.getByText("Mr. Johnson")).toBeVisible()
  })

  test("edits a contact name", async ({ page }) => {
    await builder.contacts.add("Fixer", 2, 2)
    await builder.contacts.rename("Fixer", "Street Fixer")
    await expect(page.getByText("Street Fixer")).toBeVisible()
    await expect(page.getByText("Fixer", { exact: true })).not.toBeVisible()
  })

  test("removes a contact", async ({ page }) => {
    await builder.contacts.add("Talismonger", 2, 2)
    await expect(page.getByText("Talismonger")).toBeVisible()

    await builder.contacts.remove("Talismonger")
    await expect(page.getByText("Talismonger")).not.toBeVisible()
  })

  test("adds multiple contacts and all appear in the list", async ({ page }) => {
    const contacts = ["Fixer", "Mechanic", "Mr. Johnson"]
    for (const name of contacts) {
      await builder.contacts.add(name, 2, 2)
      await expect(page.getByText(name)).toBeVisible()
    }
  })
})
