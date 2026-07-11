import { expect, test } from "@playwright/test"

import { Artemis } from "#/runner/fixtures/artemis.ts"

const GEAR_URL = `/#/${Artemis.id}/gear`

test.describe("Gear page – misc item dialog", () => {
  test.beforeEach(async ({ page }) => {
    // Visit the root to trigger ensureRunners and seed localStorage
    await page.goto("/")
    await expect(page.getByRole("banner").getByText(/ShadowSIN/i)).toBeVisible()

    // Navigate to Artemis's gear page
    await page.goto(GEAR_URL)
    await expect(page.getByRole("heading", { name: "Gear" })).toBeVisible()
  })

  test("can edit an existing misc item and the change persists", async ({ page }) => {
    // Arrange — expand the Misc accordion to reveal items
    const miscAccordion = page.getByRole("button", { name: /^Misc$/i })
    await miscAccordion.click()

    // The Artemis fixture contains a misc item named "Engineering Shop"
    const itemCard = page.getByText("Engineering Shop").first()
    await expect(itemCard).toBeVisible()

    // Act — click the card to open the edit dialog
    await itemCard.click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText("Edit Item")).toBeVisible()

    // Clear the Name field and type a new name
    const nameField = dialog.getByRole("textbox", { name: /Name/i })
    await nameField.clear()
    await nameField.fill("Medkit")

    // Save the edit
    await dialog.getByRole("button", { name: "Save" }).click()

    // Assert — dialog should close and the renamed item appears in the list
    await expect(dialog).not.toBeVisible()
    await expect(page.getByText("Medkit")).toBeVisible()
    await expect(page.getByText("Engineering Shop")).not.toBeVisible()
  })

  test("can add a new misc item and it appears in the list", async ({ page }) => {
    // Arrange — expand the Misc accordion
    const miscAccordion = page.getByRole("button", { name: /^Misc$/i })
    await miscAccordion.click()

    // Act — click the Add Item button
    const addButton = page.getByRole("button", { name: /Add Item/i })
    await expect(addButton).toBeVisible()
    await addButton.click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText("Add Item")).toBeVisible()

    // Fill in the name
    await dialog.getByRole("textbox", { name: /Name/i }).fill("Medkit")

    // In runner-sheet view (non-builder) new items use Acquire mode
    await dialog.getByRole("button", { name: "Acquire" }).click()

    // Assert — dialog closes and new item is in the list
    await expect(dialog).not.toBeVisible()
    await expect(page.getByText("Medkit")).toBeVisible()
  })
})
