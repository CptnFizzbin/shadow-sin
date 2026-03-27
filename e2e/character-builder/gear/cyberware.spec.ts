import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

/**
 * E2E tests for the Cyberware section of the Gear panel.
 *
 * Covers:
 * - Adding multiple implants and verifying all fields are reflected in the list
 * - Editing an implant and confirming other implants are not modified
 * - Removing an implant and verifying it is gone (essence cost is implicitly
 *   refunded — the remaining-essence display updates)
 * - Changing grade and verifying the displayed essence cost changes accordingly
 */
test.describe("Cyberware gear panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
    await page.goto("/#/new")
    await page.getByRole("button", { name: "Reset" }).waitFor()
    // Expand the Cyberware accordion in the Gear section
    await page.getByText("Cyberware").first().click()
    await page.getByRole("button", { name: "Add Implant" }).waitFor()
  })

  // ─── Helper: opens the Add Implant dialog and fills basic fields ──────────

  async function addImplant(
    page: Page,
    opts: {
      name: string
      cost: string
      essenceCost: string
      grade?: string
      implantType?: string
    },
  ) {
    await page.getByRole("button", { name: "Add Implant" }).click()
    await page.getByLabel("Name").fill(opts.name)
    await page.getByLabel("Base Cost (¥)").fill(opts.cost)
    await page.getByLabel("Base Essence Cost").fill(opts.essenceCost)
    if (opts.grade) {
      await page.getByRole("combobox", { name: "Grade" }).click()
      await page.getByRole("option", { name: opts.grade }).click()
    }
    if (opts.implantType) {
      await page.getByRole("combobox", { name: "Type" }).click()
      await page.getByRole("option", { name: opts.implantType }).click()
    }
    await page.getByRole("button", { name: "Save" }).click()
  }

  // ─── Add multiple implants ────────────────────────────────────────────────

  test("adds multiple implants and all appear in the list", async ({ page }) => {
    await addImplant(page, { name: "Datajack", cost: "1000", essenceCost: "0.1" })
    await addImplant(page, {
      name: "Cybereyes Rating 3",
      cost: "4000",
      essenceCost: "0.25",
    })
    await addImplant(page, {
      name: "Reaction Enhancers",
      cost: "22000",
      essenceCost: "0.3",
    })

    await expect(page.getByText("Datajack")).toBeVisible()
    await expect(page.getByText("Cybereyes Rating 3")).toBeVisible()
    await expect(page.getByText("Reaction Enhancers")).toBeVisible()
  })

  // ─── Edit an implant ──────────────────────────────────────────────────────

  test("editing one implant does not change the others", async ({ page }) => {
    await addImplant(page, { name: "Datajack", cost: "1000", essenceCost: "0.1" })
    await addImplant(page, {
      name: "Control Rig",
      cost: "97000",
      essenceCost: "3",
    })

    // Edit Control Rig name
    await page.getByText("Control Rig").click()
    await page.getByLabel("Name").clear()
    await page.getByLabel("Name").fill("Control Rig Rating 2")
    await page.getByRole("button", { name: "Save" }).click()

    // Edited implant updated
    await expect(page.getByText("Control Rig Rating 2")).toBeVisible()
    // Other implant unchanged
    await expect(page.getByText("Datajack")).toBeVisible()
    // Old name gone
    await expect(page.getByText("Control Rig", { exact: true })).not.toBeVisible()
  })

  // ─── Remove an implant ────────────────────────────────────────────────────

  test("removing an implant removes it from the list", async ({ page }) => {
    await addImplant(page, { name: "Datajack", cost: "1000", essenceCost: "0.1" })
    await addImplant(page, {
      name: "Wired Reflexes",
      cost: "55000",
      essenceCost: "2",
    })

    // Remove Wired Reflexes via the delete icon on the row
    const wiredReflexesRow = page.locator("text=Wired Reflexes").locator("..")
    await wiredReflexesRow.getByRole("button").last().click()

    await expect(page.getByText("Wired Reflexes")).not.toBeVisible()
    // The other implant must remain
    await expect(page.getByText("Datajack")).toBeVisible()
  })

  test("removing an implant reduces the displayed essence usage", async ({
    page,
  }) => {
    // Add a large-essence implant so the "Essence Used" counter is non-zero
    await addImplant(page, {
      name: "Wired Reflexes",
      cost: "55000",
      essenceCost: "2",
    })

    // Capture the essence-used text before removal
    const essenceText = page.getByText(/Essence Used:/)
    await expect(essenceText).toContainText("2")

    // Remove the implant
    const row = page.locator("text=Wired Reflexes").locator("..")
    await row.getByRole("button").last().click()

    // After removal the essence used should go back to 0
    await expect(essenceText).toContainText("0")
  })

  // ─── Grade changes affect essence cost ───────────────────────────────────

  test("adding an Alpha-grade implant shows a lower effective essence cost than Standard", async ({
    page,
  }) => {
    // Add a Standard implant (1.0 Ess)
    await addImplant(page, {
      name: "Standard Implant",
      cost: "5000",
      essenceCost: "1",
      grade: "Standard",
    })
    const essenceTextAfterStandard = page.getByText(/Essence Used:/)
    await expect(essenceTextAfterStandard).toContainText("1")

    // Remove it and add the same implant at Alpha grade (0.8 × 1.0 = 0.8 Ess)
    const row = page.locator("text=Standard Implant").locator("..")
    await row.getByRole("button").last().click()

    await addImplant(page, {
      name: "Alpha Implant",
      cost: "10000",
      essenceCost: "1",
      grade: "Alpha",
    })
    // Alpha grade reduces essence by 20% → 0.8 Ess displayed
    await expect(essenceTextAfterStandard).toContainText("0.8")
  })
})
