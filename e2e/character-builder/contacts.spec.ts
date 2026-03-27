/**
 * CRUD (add / edit / remove) tests for the Contacts section.
 */
import { expect, test } from "@playwright/test"

import { CharacterBuilderPage } from "../page-objects/CharacterBuilderPage.ts"

test.describe("Contacts list", () => {
  let builder: CharacterBuilderPage

  test.beforeEach(async ({ page }) => {
    builder = new CharacterBuilderPage(page)
    await builder.setup()
  })

  test("adds a contact with specific connection and loyalty", async ({ page }) => {
    await builder.contacts.add("Mr. Johnson", 4, 1)
    await expect(page.getByText("Mr. Johnson")).toBeVisible()
  })

  test("edits a contact name", async ({ page }) => {
    await builder.contacts.add("Fixer", 2, 2)
    await builder.contacts.rename("Fixer", "Street Fixer")
    await expect(page.getByText("Street Fixer")).toBeVisible()
    await expect(page.getByText("Fixer", { exact: true })).not.toBeVisible()
  })

  test("removes a contact", async ({ page }) => {
    await builder.contacts.add("Talismonger", 2, 2)
    await expect(page.getByText("Talismonger")).toBeVisible()

    await builder.contacts.remove("Talismonger")
    await expect(page.getByText("Talismonger")).not.toBeVisible()
  })

  test("adds multiple contacts and all appear in the list", async ({ page }) => {
    const contacts = ["Fixer", "Mechanic", "Mr. Johnson"]
    for (const name of contacts) {
      await builder.contacts.add(name, 2, 2)
      await expect(page.getByText(name)).toBeVisible()
    }
  })
})
