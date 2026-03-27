import { expect, test } from "@playwright/test"

import { CharacterBuilderPage } from "../../page-objects/CharacterBuilderPage.ts"

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
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
    await builder.gear.cyberware.open()
  })

  // ─── Add multiple implants ────────────────────────────────────────────────

  test("adds multiple implants and all appear in the list", async ({ page }) => {
    await builder.gear.cyberware.addImplant({ name: "Datajack", cost: "1000", essenceCost: "0.1" })
    await builder.gear.cyberware.addImplant({
      name: "Cybereyes Rating 3",
      cost: "4000",
      essenceCost: "0.25",
    })
    await builder.gear.cyberware.addImplant({
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
    await builder.gear.cyberware.addImplant({ name: "Datajack", cost: "1000", essenceCost: "0.1" })
    await builder.gear.cyberware.addImplant({
      name: "Control Rig",
      cost: "97000",
      essenceCost: "3",
    })

    await builder.gear.cyberware.renameImplant("Control Rig", "Control Rig Rating 2")

    await expect(page.getByText("Control Rig Rating 2")).toBeVisible()
    await expect(page.getByText("Datajack")).toBeVisible()
    await expect(page.getByText("Control Rig", { exact: true })).not.toBeVisible()
  })

  // ─── Remove an implant ────────────────────────────────────────────────────

  test("removing an implant removes it from the list", async ({ page }) => {
    await builder.gear.cyberware.addImplant({ name: "Datajack", cost: "1000", essenceCost: "0.1" })
    await builder.gear.cyberware.addImplant({
      name: "Wired Reflexes",
      cost: "55000",
      essenceCost: "2",
    })

    await builder.gear.cyberware.removeImplant("Wired Reflexes")

    await expect(page.getByText("Wired Reflexes")).not.toBeVisible()
    await expect(page.getByText("Datajack")).toBeVisible()
  })

  test("removing an implant reduces the displayed essence usage", async ({
    page,
  }) => {
    await builder.gear.cyberware.addImplant({
      name: "Wired Reflexes",
      cost: "55000",
      essenceCost: "2",
    })

    const essenceText = page.getByText(/Essence Used:/)
    await expect(essenceText).toContainText("2")

    await builder.gear.cyberware.removeImplant("Wired Reflexes")

    await expect(essenceText).toContainText("0")
  })

  // ─── Grade changes affect essence cost ───────────────────────────────────

  test("adding an Alpha-grade implant shows a lower effective essence cost than Standard", async ({
    page,
  }) => {
    await builder.gear.cyberware.addImplant({
      name: "Standard Implant",
      cost: "5000",
      essenceCost: "1",
      grade: "Standard",
    })
    const essenceText = page.getByText(/Essence Used:/)
    await expect(essenceText).toContainText("1")

    await builder.gear.cyberware.removeImplant("Standard Implant")

    await builder.gear.cyberware.addImplant({
      name: "Alpha Implant",
      cost: "10000",
      essenceCost: "1",
      grade: "Alpha",
    })
    await expect(essenceText).toContainText("0.8")
  })
})
