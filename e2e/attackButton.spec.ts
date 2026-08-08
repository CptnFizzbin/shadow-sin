import { expect, test } from "@playwright/test"

const ARTEMIS_ID = "5e5b9ece-f1f8-455f-b4fe-9b47758c49b0"
const OFFENSE_URL = `/#/${ARTEMIS_ID}/offense`

test("Weapon attack button opens dialog without crashing", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => {
    errors.push(error.message)
  })

  // Visit root to seed localStorage with Artemis runner
  await page.goto("/")
  await expect(page.getByRole("banner").getByText(/ShadowSIN/i)).toBeVisible()

  await page.goto(OFFENSE_URL)

  const attackButton = page.getByRole("button", { name: "Attack" }).first()
  await expect(attackButton).toBeVisible({ timeout: 10000 })

  await attackButton.click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()

  expect(errors).toEqual([])
})
