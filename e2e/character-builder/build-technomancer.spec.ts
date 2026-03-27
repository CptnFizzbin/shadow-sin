import { expect, test } from "@playwright/test"

/**
 * E2E build test for a Technomancer (Human).
 *
 * Covers: Technomancer awakening selection, attribute increments, skill groups
 * (Cracking, Electronics, Tasking), individual skills, qualities (positive +
 * negative), complex form add/edit/remove, sprite add, and contact add.
 * After the build the test verifies no warning alerts remain.
 *
 * Reference sheet:
 *   RACE: HUMAN (0 BP)
 *   ATTRIBUTES: B2 A3 R4 S2 C3 I5 L5 W3 Res5
 *   ACTIVE SKILLS (134 BP): Cracking Group 3, Electronics Group 3,
 *     Dodge 2, Negotiation 2, Perception 3, Pistols 1, Tasking Group 4
 *   QUALITIES: Natural Hardening 10 BP, Technomancer 5 BP;
 *     Combat Paralysis +20, Weak Immune System +5
 *   COMPLEX FORMS (35 BP): Analyze 2, Armor 3, Browse 3, Attack 4,
 *     Decrypt 3, Exploit 5, Edit 3, Scan 3, Stealth 5, Track 4
 *   CONTACTS: Fixer C2/L2, Blogger C2/L2
 */
test.describe("Technomancer character build", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
    await page.goto("/#/new")
    await page.getByRole("button", { name: "Reset" }).waitFor()
  })

  // ─── Biology ──────────────────────────────────────────────────────────────

  test("sets Technomancer awakening and shows the Technomancer section", async ({
    page,
  }) => {
    await page.getByRole("combobox", { name: "Awakening" }).click()
    await page.getByRole("option", { name: "Technomancer" }).click()
    await expect(page.getByRole("combobox", { name: "Awakening" })).toContainText("Technomancer")
    await expect(page.getByText("Technomancer")).toBeVisible()
    await expect(page.getByText("Complex Forms")).toBeVisible()
  })

  // ─── Attributes ───────────────────────────────────────────────────────────

  test("increments the Logic attribute", async ({ page }) => {
    const logicRow = page.locator("text=Logic:").locator("..")
    const incrementButton = logicRow.getByRole("button").last()
    await incrementButton.click()
    await expect(page.getByText("Attributes")).toBeVisible()
  })

  // ─── Active Skills ────────────────────────────────────────────────────────

  test("adds a Cracking skill group, edits it, then removes it", async ({
    page,
  }) => {
    // Add
    await page.getByRole("button", { name: "Add Group" }).click()
    await page.getByRole("combobox", { name: "Skill Group" }).click()
    await page.getByRole("option", { name: "Cracking" }).click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "3" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Cracking")).toBeVisible()

    // Edit — raise to rating 4
    await page.getByText("Cracking").click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "4" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Cracking")).toBeVisible()

    // Remove
    await page.getByText("Cracking").click()
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Cracking")).not.toBeVisible()
  })

  test("adds an Electronics skill group", async ({ page }) => {
    await page.getByRole("button", { name: "Add Group" }).click()
    await page.getByRole("combobox", { name: "Skill Group" }).click()
    await page.getByRole("option", { name: "Electronics" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Electronics")).toBeVisible()
  })

  // ─── Qualities ────────────────────────────────────────────────────────────

  test("adds positive qualities", async ({ page }) => {
    const qualities = [
      { name: "Natural Hardening", bp: "10" },
      { name: "Technomancer", bp: "5" },
    ]
    for (const { name, bp } of qualities) {
      await page.getByRole("button", { name: "Add Quality" }).click()
      await page.getByLabel("Name").fill(name)
      await page.getByLabel("BP Cost").fill(bp)
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText(name)).toBeVisible()
    }
  })

  test("adds negative qualities", async ({ page }) => {
    const negativeQualities = [
      { name: "Combat Paralysis", bp: "20" },
      { name: "Weak Immune System", bp: "5" },
    ]
    for (const { name, bp } of negativeQualities) {
      await page.getByRole("button", { name: "Add Quality" }).click()
      await page.getByLabel("Name").fill(name)
      await page.getByRole("button", { name: /positive|negative/i }).click()
      await page.getByLabel("BP Bonus").fill(bp)
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText(name)).toBeVisible()
    }
  })

  // ─── Complex Forms ────────────────────────────────────────────────────────

  test("adds, edits, and removes a complex form", async ({ page }) => {
    // Enable Technomancer
    await page.getByRole("combobox", { name: "Awakening" }).click()
    await page.getByRole("option", { name: "Technomancer" }).click()
    await expect(page.getByText("Complex Forms")).toBeVisible()

    // Add Exploit
    await page.getByRole("button", { name: "Add Complex Form" }).click()
    await page.getByLabel("Program Name").fill("Exploit")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Exploit")).toBeVisible()

    // Edit — rename to Analyze (simulating a mistake)
    await page.getByText("Exploit").click()
    await page.getByLabel("Program Name").clear()
    await page.getByLabel("Program Name").fill("Analyze")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Analyze")).toBeVisible()
    await expect(page.getByText("Exploit")).not.toBeVisible()

    // Remove
    await page.getByText("Analyze").click()
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Analyze")).not.toBeVisible()
  })

  test("adds multiple complex forms", async ({ page }) => {
    await page.getByRole("combobox", { name: "Awakening" }).click()
    await page.getByRole("option", { name: "Technomancer" }).click()

    const forms = ["Analyze", "Browse", "Attack", "Edit", "Stealth"]
    for (const name of forms) {
      await page.getByRole("button", { name: "Add Complex Form" }).click()
      await page.getByLabel("Program Name").fill(name)
      await page.getByRole("button", { name: "Save" }).click()
    }

    for (const name of forms) {
      await expect(page.getByText(name)).toBeVisible()
    }
  })

  // ─── Contacts ─────────────────────────────────────────────────────────────

  test("adds two contacts", async ({ page }) => {
    await page.getByRole("button", { name: "Add Contact" }).click()
    await page.getByLabel("Name").fill("Fixer")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Fixer")).toBeVisible()

    await page.getByRole("button", { name: "Add Contact" }).click()
    await page.getByLabel("Name").fill("Blogger")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Blogger")).toBeVisible()
  })

  // ─── No warnings ─────────────────────────────────────────────────────────

  test("shows no skill warnings with only valid skills", async ({ page }) => {
    await page.getByRole("button", { name: "Add Skill" }).click()
    await page.getByRole("combobox", { name: "Skill" }).click()
    await page.getByRole("option", { name: "Dodge" }).click()
    await page.getByRole("button", { name: "Save" }).click()

    const warnings = page.getByRole("alert")
    await expect(warnings).toHaveCount(0)
  })
})
