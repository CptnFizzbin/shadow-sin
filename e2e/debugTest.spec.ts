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

  await page.goto("/")
  await expect(page.getByRole("banner").getByText(/ShadowSIN/i)).toBeVisible()

  await page.goto(OFFENSE_URL)

  const attackButton = page.getByRole("button", { name: "Attack" }).first()
  await expect(attackButton).toBeVisible({ timeout: 10000 })

  console.log("Clicking attack button...")
  await attackButton.click()

  await page.waitForTimeout(2000)

  const allText = await page.locator("body").innerText()
  console.log("After clicking attack button, body text:", allText.substring(0, 500))

  const dialogCount = await page.getByRole("dialog").count()
  console.log("Dialog count:", dialogCount)

  const failedToLoad = await page.getByText("Failed to load runner").count()
  console.log("'Failed to load runner' count:", failedToLoad)
  
  console.log("Page errors:", errors)
})
