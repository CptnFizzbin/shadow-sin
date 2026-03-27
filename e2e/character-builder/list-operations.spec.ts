/**
 * CRUD (add / edit / remove) tests for every list-based section of the
 * character builder: active skills, skill groups, qualities, spells, complex
 * forms, and contacts.
 *
 * These tests were extracted from the individual build-*.spec.ts files so that
 * the build specs can focus solely on the full-build + BP-summary flow.
 */
import { expect, test } from "@playwright/test"

import { setupNewCharacter } from "./helpers.ts"

// ─── Active Skills ────────────────────────────────────────────────────────────

test.describe("Active skills list", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewCharacter(page)
  })

  test("adds an active skill", async ({ page }) => {
    await page.getByRole("button", { name: "Add Skill" }).click()
    await page.getByRole("combobox", { name: "Skill" }).click()
    await page.getByRole("option", { name: "Spellcasting", exact: true }).click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "5", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Spellcasting")).toBeVisible()
  })

  test("edits an active skill to add a specialization", async ({ page }) => {
    // Add first
    await page.getByRole("button", { name: "Add Skill" }).click()
    await page.getByRole("combobox", { name: "Skill" }).click()
    await page.getByRole("option", { name: "Pilot Ground Craft", exact: true }).click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "4", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()

    // Edit — add specialization
    await page.getByText("Pilot Ground Craft").click()
    await page.getByLabel("Specialization (optional)").fill("Trucks")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Trucks")).toBeVisible()
  })

  test("edits an active skill to clear its specialization", async ({
    page,
  }) => {
    // Add with spec
    await page.getByRole("button", { name: "Add Skill" }).click()
    await page.getByRole("combobox", { name: "Skill" }).click()
    await page.getByRole("option", { name: "Etiquette", exact: true }).click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "2", exact: true }).click()
    await page.getByLabel("Specialization (optional)").fill("Street")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Street")).toBeVisible()

    // Edit — clear spec
    await page.getByText("Etiquette").click()
    await page.getByLabel("Specialization (optional)").clear()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Street")).not.toBeVisible()
  })

  test("removes an active skill", async ({ page }) => {
    await page.getByRole("button", { name: "Add Skill" }).click()
    await page.getByRole("combobox", { name: "Skill" }).click()
    await page.getByRole("option", { name: "Dodge", exact: true }).click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "3", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Dodge")).toBeVisible()

    // Open edit dialog and delete
    await page.getByText("Dodge").click()
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Dodge")).not.toBeVisible()
  })
})

// ─── Skill Groups ─────────────────────────────────────────────────────────────

test.describe("Skill groups list", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewCharacter(page)
  })

  test("adds a skill group", async ({ page }) => {
    await page.getByRole("button", { name: "Add Group" }).click()
    await page.getByRole("combobox", { name: "Skill Group" }).click()
    await page.getByRole("option", { name: "Conjuring", exact: true }).click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "3", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Conjuring")).toBeVisible()
  })

  test("edits a skill group rating", async ({ page }) => {
    // Add at rating 3
    await page.getByRole("button", { name: "Add Group" }).click()
    await page.getByRole("combobox", { name: "Skill Group" }).click()
    await page.getByRole("option", { name: "Cracking", exact: true }).click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "3", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()

    // Edit — raise to 4
    await page.getByText("Cracking").click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "4", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Cracking")).toBeVisible()
  })

  test("removes a skill group", async ({ page }) => {
    await page.getByRole("button", { name: "Add Group" }).click()
    await page.getByRole("combobox", { name: "Skill Group" }).click()
    await page.getByRole("option", { name: "Electronics", exact: true }).click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "2", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Electronics")).toBeVisible()

    await page.getByText("Electronics").click()
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Electronics")).not.toBeVisible()
  })
})

// ─── Qualities ────────────────────────────────────────────────────────────────

test.describe("Qualities list", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewCharacter(page)
  })

  test("adds a positive quality", async ({ page }) => {
    await page.getByRole("button", { name: "Add Quality" }).click()
    await page.getByLabel("Name").fill("Analytical Mind")
    await page.getByLabel("BP Cost").fill("5")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Analytical Mind")).toBeVisible()
  })

  test("adds a negative quality", async ({ page }) => {
    await page.getByRole("button", { name: "Add Quality" }).click()
    await page.getByLabel("Name").fill("Mild Allergy to Sunlight")
    await page.getByRole("button", { name: /positive|negative/i }).click()
    await page.getByLabel("BP Bonus").fill("10")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Mild Allergy to Sunlight")).toBeVisible()
  })

  test("edits a quality name", async ({ page }) => {
    await page.getByRole("button", { name: "Add Quality" }).click()
    await page.getByLabel("Name").fill("Low Pain Tolerance")
    await page.getByRole("button", { name: /positive|negative/i }).click()
    await page.getByLabel("BP Bonus").fill("10")
    await page.getByRole("button", { name: "Save" }).click()

    await page.getByText("Low Pain Tolerance").click()
    await page.getByLabel("Name").clear()
    await page.getByLabel("Name").fill("Low Pain Tolerance (Revised)")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Low Pain Tolerance (Revised)")).toBeVisible()
    await expect(page.getByText("Low Pain Tolerance", { exact: true })).not.toBeVisible()
  })

  test("removes a negative quality", async ({ page }) => {
    await page.getByRole("button", { name: "Add Quality" }).click()
    await page.getByLabel("Name").fill("Sensitive System")
    await page.getByRole("button", { name: /positive|negative/i }).click()
    await page.getByLabel("BP Bonus").fill("15")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Sensitive System")).toBeVisible()

    await page.getByText("Sensitive System").click()
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Sensitive System")).not.toBeVisible()
  })
})

// ─── Spells ───────────────────────────────────────────────────────────────────

test.describe("Spells list (Magician awakening required)", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewCharacter(page)
    await page.getByRole("combobox", { name: "Awakening" }).click()
    await page.getByRole("option", { name: "Magician" }).click()
    await page.getByText("Spells").waitFor()
  })

  test("adds a spell", async ({ page }) => {
    await page.getByRole("button", { name: "Add Spell" }).click()
    await page.getByLabel("Name").fill("Manabolt")
    await page.getByRole("combobox", { name: "Type" }).click()
    await page.getByRole("option", { name: "Mana" }).click()
    await page.getByRole("combobox", { name: "Damage" }).click()
    await page.getByRole("option", { name: "Physical" }).click()
    await page.getByRole("combobox", { name: "Range" }).click()
    await page.getByRole("option", { name: "Line of Sight" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Manabolt")).toBeVisible()
  })

  test("edits a spell name", async ({ page }) => {
    await page.getByRole("button", { name: "Add Spell" }).click()
    await page.getByLabel("Name").fill("Manabolt")
    await page.getByRole("combobox", { name: "Type" }).click()
    await page.getByRole("option", { name: "Mana" }).click()
    await page.getByRole("combobox", { name: "Damage" }).click()
    await page.getByRole("option", { name: "Physical" }).click()
    await page.getByRole("combobox", { name: "Range" }).click()
    await page.getByRole("option", { name: "Line of Sight" }).click()
    await page.getByRole("button", { name: "Save" }).click()

    // Edit — rename to Manaball
    await page.getByText("Manabolt").click()
    await page.getByLabel("Name").clear()
    await page.getByLabel("Name").fill("Manaball")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Manaball")).toBeVisible()
    await expect(page.getByText("Manabolt")).not.toBeVisible()
  })

  test("removes a spell", async ({ page }) => {
    await page.getByRole("button", { name: "Add Spell" }).click()
    await page.getByLabel("Name").fill("Lightning Bolt")
    await page.getByRole("combobox", { name: "Type" }).click()
    await page.getByRole("option", { name: "Physical" }).click()
    await page.getByRole("combobox", { name: "Damage" }).click()
    await page.getByRole("option", { name: "Physical" }).click()
    await page.getByRole("combobox", { name: "Range" }).click()
    await page.getByRole("option", { name: "Line of Sight" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Lightning Bolt")).toBeVisible()

    await page.getByText("Lightning Bolt").click()
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Lightning Bolt")).not.toBeVisible()
  })
})

// ─── Complex Forms ────────────────────────────────────────────────────────────

test.describe("Complex forms list (Technomancer awakening required)", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewCharacter(page)
    await page.getByRole("combobox", { name: "Awakening" }).click()
    await page.getByRole("option", { name: "Technomancer" }).click()
    await page.getByText("Complex Forms").waitFor()
    // Raise resonance to 5 first so all rating options are available.
    // RES starts at 1 for Technomancer; target 5 = 4 clicks.
    const resRow = page
      .getByText("RES:", { exact: true })
      .locator("xpath=ancestor::div[.//button][1]")
    const resInc = resRow.getByRole("button").last()
    for (let i = 0; i < 4; i++) await resInc.click()
  })

  test("adds a complex form", async ({ page }) => {
    await page.getByRole("button", { name: "Add Complex Form" }).click()
    await page.getByLabel("Program Name").fill("Exploit")
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "5", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Exploit")).toBeVisible()
  })

  test("edits a complex form name", async ({ page }) => {
    await page.getByRole("button", { name: "Add Complex Form" }).click()
    await page.getByLabel("Program Name").fill("Exploit")
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "3", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()

    await page.getByText("Exploit").click()
    await page.getByLabel("Program Name").clear()
    await page.getByLabel("Program Name").fill("Analyze")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Analyze")).toBeVisible()
    await expect(page.getByText("Exploit")).not.toBeVisible()
  })

  test("removes a complex form", async ({ page }) => {
    await page.getByRole("button", { name: "Add Complex Form" }).click()
    await page.getByLabel("Program Name").fill("Stealth")
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "4", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Stealth")).toBeVisible()

    await page.getByText("Stealth").click()
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Stealth")).not.toBeVisible()
  })

  test("adds multiple complex forms and all appear in the list", async ({
    page,
  }) => {
    const forms = ["Analyze", "Browse", "Attack", "Edit", "Scan"]
    for (const name of forms) {
      await page.getByRole("button", { name: "Add Complex Form" }).click()
      await page.getByLabel("Program Name").fill(name)
      await page.getByRole("combobox", { name: "Rating" }).click()
      await page.getByRole("option", { name: "3", exact: true }).click()
      await page.getByRole("button", { name: "Save" }).click()
    }
    for (const name of forms) {
      await expect(page.getByText(name)).toBeVisible()
    }
  })
})

// ─── Contacts ─────────────────────────────────────────────────────────────────

test.describe("Contacts list", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewCharacter(page)
  })

  test("adds a contact with specific connection and loyalty", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Contact" }).click()
    await page.getByLabel("Name").fill("Mr. Johnson")
    await page.getByRole("combobox", { name: "Connection" }).click()
    await page.getByRole("option", { name: "4", exact: true }).click()
    await page.getByRole("combobox", { name: "Loyalty" }).click()
    await page.getByRole("option", { name: "1", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Mr. Johnson")).toBeVisible()
  })

  test("edits a contact name", async ({ page }) => {
    await page.getByRole("button", { name: "Add Contact" }).click()
    await page.getByLabel("Name").fill("Fixer")
    await page.getByRole("combobox", { name: "Connection" }).click()
    await page.getByRole("option", { name: "2", exact: true }).click()
    await page.getByRole("combobox", { name: "Loyalty" }).click()
    await page.getByRole("option", { name: "2", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()

    await page.getByText("Fixer").click()
    await page.getByLabel("Name").clear()
    await page.getByLabel("Name").fill("Street Fixer")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Street Fixer")).toBeVisible()
    await expect(page.getByText("Fixer", { exact: true })).not.toBeVisible()
  })

  test("removes a contact", async ({ page }) => {
    await page.getByRole("button", { name: "Add Contact" }).click()
    await page.getByLabel("Name").fill("Talismonger")
    await page.getByRole("combobox", { name: "Connection" }).click()
    await page.getByRole("option", { name: "2", exact: true }).click()
    await page.getByRole("combobox", { name: "Loyalty" }).click()
    await page.getByRole("option", { name: "2", exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Talismonger")).toBeVisible()

    await page.getByText("Talismonger").click()
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Talismonger")).not.toBeVisible()
  })

  test("adds multiple contacts and all appear in the list", async ({
    page,
  }) => {
    const contacts = ["Fixer", "Mechanic", "Mr. Johnson"]
    for (const name of contacts) {
      await page.getByRole("button", { name: "Add Contact" }).click()
      await page.getByLabel("Name").fill(name)
      await page.getByRole("combobox", { name: "Connection" }).click()
      await page.getByRole("option", { name: "2", exact: true }).click()
      await page.getByRole("combobox", { name: "Loyalty" }).click()
      await page.getByRole("option", { name: "2", exact: true }).click()
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText(name)).toBeVisible()
    }
  })
})
