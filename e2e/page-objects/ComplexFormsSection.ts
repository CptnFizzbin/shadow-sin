import type { Page } from "@playwright/test"

/**
 * POM for the Complex Forms section of the character builder (Technomancer).
 */
export class ComplexFormsSection {
  constructor(private readonly page: Page) {}

  async add(name: string, rating: number): Promise<void> {
    await this.page.getByRole("button", { name: "Add Complex Form" }).click()
    await this.page.getByLabel("Program Name").fill(name)
    await this.page.getByRole("combobox", { name: "Rating" }).click()
    await this.page.getByRole("option", { name: String(rating), exact: true }).click()
    await this.page.getByRole("button", { name: "Save" }).click()
  }

  async rename(currentName: string, newName: string): Promise<void> {
    await this.page.getByText(currentName).click()
    await this.page.getByLabel("Program Name").clear()
    await this.page.getByLabel("Program Name").fill(newName)
    await this.page.getByRole("button", { name: "Save" }).click()
  }

  async remove(name: string): Promise<void> {
    await this.page.getByText(name).click()
    await this.page.getByRole("button", { name: "Delete" }).click()
  }
}
