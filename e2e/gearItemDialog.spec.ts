import { expect, test } from "@playwright/test"

import { Artemis } from "#/data/fixtures/artemis.ts"

const GEAR_URL = `/#/${Artemis.id}/gear`

test.describe("Gear page – misc item dialog", () => {
  test.beforeEach(async ({ page }) => {
    // Visit the root to trigger ensureRunners and seed localStorage
    await page.goto("/")
    await expect(page.getByRole("banner").getByText(/ShadowSIN/i)).toBeVisible()

    await page.goto(GEAR_URL)
    await expect(page.getByRole("heading", { name: "Gear" })).toBeVisible()
  })

  test("can edit an existing misc item and the change persists", async ({ page }) => {
    // Arrange — expand the Misc accordion to reveal items
    // The accordion's accessible name is prefixed with its item count (e.g. "3 Misc"), so match on
    // the section label rather than requiring an exact "Misc".
    const miscAccordion = page.getByRole("button", { name: /Misc$/i })
    await miscAccordion.click()

    // The Artemis fixture contains a misc item named "Engineering Shop"
    const itemCard = page.getByText("Engineering Shop").first()
    await expect(itemCard).toBeVisible()

    // Act — tapping the card (its ItemCard, like every other gear section) navigates to the
    // item's details page rather than opening the edit dialog directly.
    await itemCard.click()
    await expect(page.getByRole("heading", { name: "Engineering Shop" })).toBeVisible()

    await page.getByRole("button", { name: "Edit" }).click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText("Edit Item")).toBeVisible()

    const nameField = dialog.getByRole("textbox", { name: /Name/i })
    await nameField.clear()
    await nameField.fill("Medkit")

    await dialog.getByRole("button", { name: "Save" }).click()

    // Assert — dialog closes and the details page reflects the rename
    await expect(dialog).not.toBeVisible()
    await expect(page.getByRole("heading", { name: "Medkit", exact: true })).toBeVisible()

    // Assert — the change persists back on the gear list too. Navigating back to the list
    // remounts the page, so the Misc accordion starts collapsed again.
    await page.getByRole("button", { name: "Back" }).click()
    await miscAccordion.click()
    // exact: true — the fixture also carries an unrelated "Medkit (Rating 6)" item.
    await expect(page.getByText("Medkit", { exact: true })).toBeVisible()
    await expect(page.getByText("Engineering Shop")).not.toBeVisible()
  })

  test("can add a new misc item and it appears in the list", async ({ page }) => {
    // Arrange — expand the Misc accordion
    // The accordion's accessible name is prefixed with its item count (e.g. "3 Misc"), so match on
    // the section label rather than requiring an exact "Misc".
    const miscAccordion = page.getByRole("button", { name: /Misc$/i })
    await miscAccordion.click()

    // Act — click the Add Item button
    const addButton = page.getByRole("button", { name: /Add Item/i })
    await expect(addButton).toBeVisible()
    await addButton.click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText("Add Item")).toBeVisible()

    await dialog.getByRole("textbox", { name: /Name/i }).fill("Medkit")

    // In runner-sheet view (non-builder) new items use Acquire mode
    await dialog.getByRole("button", { name: "Acquire" }).click()

    // Assert — dialog closes and new item is in the list
    await expect(dialog).not.toBeVisible()
    // exact: true — the fixture also carries an unrelated "Medkit (Rating 6)" item.
    await expect(page.getByText("Medkit", { exact: true })).toBeVisible()
  })
})
