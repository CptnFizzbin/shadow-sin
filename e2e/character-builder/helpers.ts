/**
 * Shared Playwright helpers for character-builder E2E tests.
 *
 * Action helpers are shared by the full-build tests and the list-operations
 * CRUD tests.  verifyBpSummary also includes Playwright assertions.
 */
import { expect } from "@playwright/test"
import type { Page } from "@playwright/test"


// ─── Navigation ───────────────────────────────────────────────────────────────

export async function setupNewCharacter(page: Page): Promise<void> {
  await page.goto("/")
  await page.evaluate(() => localStorage.clear())
  await page.goto("/#/new")
  await page.getByRole("button", { name: "Reset" }).waitFor()
}

// ─── Attributes ───────────────────────────────────────────────────────────────

/**
 * Increment the attribute identified by its abbreviation label (e.g. "BOD",
 * "AGI") the given number of times.  Uses XPath to find the nearest ancestor
 * <div> that contains both the label text and action buttons, then clicks the
 * last (rightmost) button which is always the increment button.
 */
export async function incAttr(
  page: Page,
  abbr: string,
  times: number,
): Promise<void> {
  if (times <= 0) return
  const row = page
    .getByText(`${abbr}:`, { exact: true })
    .locator("xpath=ancestor::div[.//button][1]")
  const incBtn = row.getByRole("button").last()
  for (let i = 0; i < times; i++) {
    await incBtn.click()
  }
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export async function addActiveSkill(
  page: Page,
  skillName: string,
  rating: number,
  specialization?: string,
): Promise<void> {
  await page.getByRole("button", { name: "Add Skill" }).click()
  await page.getByRole("combobox", { name: "Skill" }).click()
  await page.getByRole("option", { name: skillName, exact: true }).click()
  await page.getByRole("combobox", { name: "Rating" }).click()
  await page.getByRole("option", { name: String(rating), exact: true }).click()
  if (specialization) {
    await page.getByLabel("Specialization (optional)").fill(specialization)
  }
  await page.getByRole("button", { name: "Save" }).click()
}

export async function addSkillGroup(
  page: Page,
  groupName: string,
  rating: number,
): Promise<void> {
  await page.getByRole("button", { name: "Add Group" }).click()
  await page.getByRole("combobox", { name: "Skill Group" }).click()
  await page.getByRole("option", { name: groupName, exact: true }).click()
  await page.getByRole("combobox", { name: "Rating" }).click()
  await page.getByRole("option", { name: String(rating), exact: true }).click()
  await page.getByRole("button", { name: "Save" }).click()
}

// ─── Qualities ────────────────────────────────────────────────────────────────

/**
 * Add a quality.  The dialog defaults to positive; click the toggle to switch
 * to negative if needed.  The BP field label differs by type:
 *   positive → "BP Cost"
 *   negative → "BP Bonus"
 */
export async function addQuality(
  page: Page,
  name: string,
  type: "positive" | "negative",
  bpValue: number,
): Promise<void> {
  await page.getByRole("button", { name: "Add Quality" }).click()
  await page.getByLabel("Name").fill(name)
  if (type === "negative") {
    // The toggle button shows the current state; clicking it switches to the
    // other state.  It starts as "Positive", so one click sets it to "Negative".
    await page.getByRole("button", { name: /positive|negative/i }).click()
    await page.getByLabel("BP Bonus").fill(String(bpValue))
  } else {
    await page.getByLabel("BP Cost").fill(String(bpValue))
  }
  await page.getByRole("button", { name: "Save" }).click()
}

// ─── Spells ───────────────────────────────────────────────────────────────────

/**
 * Add a spell using Physical type, Physical damage, and Line of Sight range.
 * BP cost is fixed per spell (3 BP) so type/damage/range do not affect the
 * budget – these defaults keep the helper concise for full-build tests.
 */
export async function addSpell(
  page: Page,
  name: string,
  type: "Physical" | "Mana" = "Physical",
  damage: "Physical" | "Stun" = "Physical",
  range: "Touch" | "Line of Sight" | "Line of Sight (Area)" = "Line of Sight",
): Promise<void> {
  await page.getByRole("button", { name: "Add Spell" }).click()
  await page.getByLabel("Name").fill(name)
  await page.getByRole("combobox", { name: "Type" }).click()
  await page.getByRole("option", { name: type }).click()
  await page.getByRole("combobox", { name: "Damage" }).click()
  await page.getByRole("option", { name: damage }).click()
  await page.getByRole("combobox", { name: "Range" }).click()
  await page.getByRole("option", { name: range }).click()
  await page.getByRole("button", { name: "Save" }).click()
}

// ─── Complex Forms ────────────────────────────────────────────────────────────

export async function addComplexForm(
  page: Page,
  name: string,
  rating: number,
): Promise<void> {
  await page.getByRole("button", { name: "Add Complex Form" }).click()
  await page.getByLabel("Program Name").fill(name)
  await page.getByRole("combobox", { name: "Rating" }).click()
  await page.getByRole("option", { name: String(rating), exact: true }).click()
  await page.getByRole("button", { name: "Save" }).click()
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

export async function addContact(
  page: Page,
  name: string,
  connection: number,
  loyalty: number,
): Promise<void> {
  await page.getByRole("button", { name: "Add Contact" }).click()
  await page.getByLabel("Name").fill(name)
  await page.getByRole("combobox", { name: "Connection" }).click()
  await page.getByRole("option", { name: String(connection), exact: true }).click()
  await page.getByRole("combobox", { name: "Loyalty" }).click()
  await page.getByRole("option", { name: String(loyalty), exact: true }).click()
  await page.getByRole("button", { name: "Save" }).click()
}

// ─── Gear ─────────────────────────────────────────────────────────────────────

/**
 * Open the Misc gear accordion (if not already open) and add a single item
 * with the given name and cost.
 *
 * The gear BP is `Math.ceil((itemsCost + lifestyleCost) / 5_000)`.  The
 * default lifestyle is Low × 1 month = 2,000 ¥.  Pass a cost that, when
 * combined with the 2,000 ¥ lifestyle baseline, produces an exact multiple of
 * 5,000 to avoid any rounding surprises:
 *   - 4 BP  → 18,000 ¥ items  (total 20,000 ¥)
 *   - 50 BP → 248,000 ¥ items (total 250,000 ¥)
 *   - 3 BP  → 13,000 ¥ items  (total 15,000 ¥)
 */
export async function addMiscGearItem(
  page: Page,
  name: string,
  cost: number,
): Promise<void> {
  await page.getByRole("button", { name: "Misc" }).click()
  await page.getByRole("button", { name: "Add Item" }).waitFor()
  await page.getByRole("button", { name: "Add Item" }).click()
  await page.getByLabel("Name").fill(name)
  await page.getByLabel("Cost (¥)").fill(String(cost))
  await page.getByRole("button", { name: "Save" }).click()
}

// ─── BP Summary ───────────────────────────────────────────────────────────────

/**
 * Verify that the BP summary footer shows "0 remaining" and that each of the
 * provided line items appears in the expanded detail table with the expected
 * BP value.  Negative values (e.g. for Qualities) should be passed as negative
 * numbers and will appear as "-35 BP" in the UI.
 *
 * Line items whose `bp` is 0 are skipped because the UI omits the value cell
 * for zero-cost rows.
 */
export async function verifyBpSummary(
  page: Page,
  lineItems: Array<{ label: string; bp: number }>,
): Promise<void> {
  await expect(
    page.getByRole("button").filter({ hasText: "0 remaining" }),
  ).toBeVisible()

  // Expand the detail table.
  await page.getByRole("button").filter({ hasText: "0 remaining" }).click()
  await page.getByRole("table").waitFor()

  for (const { label, bp } of lineItems) {
    if (bp === 0) continue
    const row = page.getByRole("table").locator("tr").filter({ hasText: label })
    await expect(row).toContainText(`${bp} BP`)
  }
}
