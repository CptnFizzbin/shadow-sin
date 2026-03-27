import type { Page } from "@playwright/test"

/**
 * POM for the Contacts section of the character builder.
 */
export class ContactsSection {
  constructor(private readonly page: Page) {}

  private dialog() {
    return this.page.locator("[role=\"dialog\"]")
  }

  async add(name: string, connection: number, loyalty: number): Promise<void> {
    await this.page.getByRole("button", { name: "Add Contact" }).click()
    await this.dialog().getByLabel("Name").fill(name)
    await this.dialog().getByRole("combobox", { name: "Connection" }).click()
    await this.page.getByRole("option", { name: String(connection), exact: true }).click()
    await this.dialog().getByRole("combobox", { name: "Loyalty" }).click()
    await this.page.getByRole("option", { name: String(loyalty), exact: true }).click()
    await this.dialog().getByRole("button", { name: "Save" }).click()
  }

  async rename(currentName: string, newName: string): Promise<void> {
    await this.page.getByText(currentName).click()
    await this.dialog().getByLabel("Name").clear()
    await this.dialog().getByLabel("Name").fill(newName)
    await this.dialog().getByRole("button", { name: "Save" }).click()
  }

  async remove(name: string): Promise<void> {
    await this.page.getByText(name).click()
    await this.dialog().getByRole("button", { name: "Delete" }).click()
  }
}
