import { expect, test } from "@playwright/test"
import { Artemis } from "#/data/fixtures/artemis.ts"

const OFFENSE_URL = `/#/${Artemis.id}/offense`

test("Click attack button - does it crash?", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => {
    errors.push(error.message)
    console.log("PAGE ERROR:", error.message)
  })
  
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log("CONSOLE ERROR:", msg.text())
    }
  })

  // Seed localStorage
  await page.goto("/")
  await expect(page.getByRole("banner").getByText(/ShadowSIN/i)).toBeVisible()

  // Navigate to offense page  
  await page.goto(OFFENSE_URL)
  
  // Wait for attack button
  const attackButton = page.getByRole("button", { name: "Attack" }).first()
  await expect(attackButton).toBeVisible({ timeout: 10000 })

  // Click the attack button
  console.log("Clicking attack button...")
  await attackButton.click()

  // Check what happened - wait a moment
  await page.waitForTimeout(2000)
  
  // Check all visible text
  const allText = await page.locator("body").innerText()
  console.log("After clicking attack button, body text:", allText.substring(0, 500))
  
  // Check for dialog
  const dialogCount = await page.getByRole("dialog").count()
  console.log("Dialog count:", dialogCount)
  
  // Check for crash
  const failedToLoad = await page.getByText("Failed to load runner").count()
  console.log("'Failed to load runner' count:", failedToLoad)
  
  console.log("Page errors:", errors)
})
