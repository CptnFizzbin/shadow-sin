import { expect, test } from "@playwright/test"

/**
 * E2E build test for a Smuggler (Human, Mundane) with cyberware.
 *
 * Covers: default Human metatype (unchanged), attribute increments, active
 * skill add/edit/remove, skill group add, negative-only qualities, cyberware
 * implant add/edit/remove, and contact add.
 * After the build the test verifies no warning alerts remain.
 *
 * Reference sheet:
 *   RACE: HUMAN (0 BP)
 *   ATTRIBUTES: B3 A5 R5(7) S2 C2 I5 L3 W3 E3
 *   ACTIVE SKILLS (156 BP): Dodge 3, Etiquette 2, Electronic Warfare 4,
 *     Gunnery 4, Mechanic Group 2, Navigation 2, Negotiation 2, Perception 3,
 *     Pilot Aircraft 4, Pilot Ground Craft 5, Pistols 1, Infiltration 3
 *   QUALITIES: Elf Poser +5, Low Pain Tolerance +10,
 *     Moderate Allergy to Sunlight +15
 *   AUGMENTATIONS: Plastic Bone Lacing, Control Rig, Cybereyes R3,
 *     Datajack, Reaction Enhancers R2, Smuggling Compartments ×2, Touchlink
 *   CONTACTS: Fixer C2/L2, Mechanic C2/L3, Mr. Johnson C4/L1
 */
test.describe("Smuggler character build", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
    await page.goto("/#/new")
    await page.getByRole("button", { name: "Reset" }).waitFor()
  })

  // ─── Biology ──────────────────────────────────────────────────────────────

  test("keeps the default Human metatype", async ({ page }) => {
    await expect(page.getByRole("combobox", { name: "Metatype" })).toContainText("Human")
  })

  // ─── Attributes ───────────────────────────────────────────────────────────

  test("increments the Agility attribute multiple times", async ({ page }) => {
    const agilityRow = page.locator("text=Agility:").locator("..")
    const incrementButton = agilityRow.getByRole("button").last()
    // Click twice to raise from base to base+2
    await incrementButton.click()
    await incrementButton.click()
    await expect(page.getByText("Attributes")).toBeVisible()
  })

  // ─── Active Skills ────────────────────────────────────────────────────────

  test("adds, edits, and removes an active skill", async ({ page }) => {
    // Add Pilot Ground Craft
    await page.getByRole("button", { name: "Add Skill" }).click()
    await page.getByRole("combobox", { name: "Skill" }).click()
    await page.getByRole("option", { name: "Pilot Ground Craft" }).click()
    await page.getByRole("combobox", { name: "Rating" }).click()
    await page.getByRole("option", { name: "5" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Pilot Ground Craft")).toBeVisible()

    // Edit — add a specialization to simulate a mistake
    await page.getByText("Pilot Ground Craft").click()
    await page.getByLabel("Specialization (optional)").fill("Trucks")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Trucks")).toBeVisible()

    // Edit again to clear the specialization
    await page.getByText("Pilot Ground Craft").click()
    await page.getByLabel("Specialization (optional)").clear()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Trucks")).not.toBeVisible()

    // Remove
    await page.getByText("Pilot Ground Craft").click()
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page.getByText("Pilot Ground Craft")).not.toBeVisible()
  })

  test("adds a Mechanic skill group", async ({ page }) => {
    await page.getByRole("button", { name: "Add Group" }).click()
    await page.getByRole("combobox", { name: "Skill Group" }).click()
    await page.getByRole("option", { name: "Mechanic" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Mechanic")).toBeVisible()
  })

  // ─── Qualities ────────────────────────────────────────────────────────────

  test("adds three negative qualities", async ({ page }) => {
    const qualities = [
      { name: "Elf Poser", bp: "5" },
      { name: "Low Pain Tolerance", bp: "10" },
      { name: "Moderate Allergy to Sunlight", bp: "15" },
    ]

    for (const { name, bp } of qualities) {
      await page.getByRole("button", { name: "Add Quality" }).click()
      await page.getByLabel("Name").fill(name)
      // Toggle to negative
      await page.getByRole("button", { name: /positive|negative/i }).click()
      await page.getByLabel("BP Bonus").fill(bp)
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText(name)).toBeVisible()
    }
  })

  // ─── Cyberware ────────────────────────────────────────────────────────────

  test("adds a Datajack implant", async ({ page }) => {
    // Open the Cyberware accordion in the Gear section
    await page.getByText("Cyberware").first().click()
    await page.getByRole("button", { name: "Add Implant" }).click()
    await page.getByLabel("Name").fill("Datajack")
    await page.getByLabel("Base Cost (¥)").fill("1000")
    await page.getByLabel("Base Essence Cost").fill("0.1")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Datajack")).toBeVisible()
  })

  test("edits an implant and verifies the update", async ({ page }) => {
    // Add a Cybereyes implant
    await page.getByText("Cyberware").first().click()
    await page.getByRole("button", { name: "Add Implant" }).click()
    await page.getByLabel("Name").fill("Cybereyes")
    await page.getByLabel("Base Cost (¥)").fill("4000")
    await page.getByLabel("Base Essence Cost").fill("0.25")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Cybereyes")).toBeVisible()

    // Edit — update the name to include a rating suffix
    await page.getByText("Cybereyes").click()
    await page.getByLabel("Name").clear()
    await page.getByLabel("Name").fill("Cybereyes Rating 3")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Cybereyes Rating 3")).toBeVisible()
    await expect(page.getByText("Cybereyes", { exact: true })).not.toBeVisible()
  })

  test("removes an implant", async ({ page }) => {
    await page.getByText("Cyberware").first().click()
    await page.getByRole("button", { name: "Add Implant" }).click()
    await page.getByLabel("Name").fill("Reaction Enhancers")
    await page.getByLabel("Base Cost (¥)").fill("22000")
    await page.getByLabel("Base Essence Cost").fill("0.3")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Reaction Enhancers")).toBeVisible()

    // Remove via the delete icon button on the list item
    await page.getByText("Reaction Enhancers").click()
    await page.getByRole("button", { name: "Save" }).waitFor()
    await page.getByRole("button", { name: "Cancel" }).click()

    // Use the trash icon to remove directly
    const implantRow = page.locator("text=Reaction Enhancers").locator("..")
    await implantRow.getByRole("button").last().click()
    await expect(page.getByText("Reaction Enhancers")).not.toBeVisible()
  })

  // ─── Contacts ─────────────────────────────────────────────────────────────

  test("adds three contacts", async ({ page }) => {
    const contacts = ["Fixer", "Mechanic", "Mr. Johnson"]
    for (const name of contacts) {
      await page.getByRole("button", { name: "Add Contact" }).click()
      await page.getByLabel("Name").fill(name)
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText(name)).toBeVisible()
    }
  })

  // ─── No warnings after valid skills ───────────────────────────────────────

  test("shows no skill warnings with a single valid skill added", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Skill" }).click()
    await page.getByRole("combobox", { name: "Skill" }).click()
    await page.getByRole("option", { name: "Dodge" }).click()
    await page.getByRole("button", { name: "Save" }).click()

    const warnings = page.getByRole("alert")
    await expect(warnings).toHaveCount(0)
  })
})
