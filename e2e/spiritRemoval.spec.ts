import { expect, test } from "@playwright/test"

import { Artemis } from "#/data/fixtures/artemis.ts"

const SPIRITS_URL = `/#/${Artemis.id}/spirits`

test.describe("Spirits page – removal", () => {
  test.beforeEach(async ({ page }) => {
    // Visit the root to trigger ensureRunners and seed localStorage
    await page.goto("/")
    await expect(page.getByRole("banner").getByText(/ShadowSIN/i)).toBeVisible()

    await page.goto(SPIRITS_URL)
    await expect(page.getByRole("heading", { name: "Spirits" })).toBeVisible()
  })

  test("dismissing a spirit persists across reload", async ({ page }) => {
    // Arrange — summon a spirit so there's something to remove
    await page.getByRole("button", { name: "Summon Spirit" }).click()

    const summonDialog = page.getByRole("dialog")
    await expect(summonDialog).toBeVisible()
    await summonDialog.getByRole("textbox", { name: /Name/i }).fill("Ember")
    await summonDialog.getByRole("button", { name: "Save" }).click()
    await expect(summonDialog).not.toBeVisible()

    const spiritCard = page.getByText("Ember")
    await expect(spiritCard).toBeVisible()

    // Act — dismiss the spirit through the confirm dialog, the flow that races
    // useCloseOnBrowserBack's history push/pop against the loader (#401)
    await page.getByRole("button", { name: "Actions menu" }).click()
    await page.getByRole("menuitem", { name: "Remove" }).click()
    await page.getByRole("button", { name: "Dismiss" }).click()

    // Assert — gone immediately...
    await expect(spiritCard).not.toBeVisible()

    // ...and still gone after a reload, proving the removal actually persisted
    // rather than the in-memory store racing ahead of a stale-reloaded RunnerDataStore.
    await page.reload()
    await expect(page.getByRole("heading", { name: "Spirits" })).toBeVisible()
    await expect(page.getByText("Ember")).not.toBeVisible()
  })
})
