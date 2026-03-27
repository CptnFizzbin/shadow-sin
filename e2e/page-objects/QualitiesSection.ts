import type { Page } from "@playwright/test"

/**
 * POM for the Qualities section of the character builder.
 */
export class QualitiesSection {
  constructor(private readonly page: Page) {}

  private dialog() {
    return this.page.locator("[role=\"dialog\"]")
  }

  /**
   * Open the Add Quality dialog and save a new quality.
   * The dialog defaults to "positive"; one click on the toggle switches to "negative".
   * The BP field label is "BP Cost" for positive and "BP Bonus" for negative.
   */
  async add(name: string, type: "positive" | "negative", bp: number): Promise<void> {
    await this.page.getByRole("button", { name: "Add Quality" }).click()
    await this.dialog().getByLabel("Name").fill(name)
    if (type === "negative") {
      await this.dialog().getByRole("button", { name: /positive|negative/i }).click()
      await this.dialog().getByLabel("BP Bonus").fill(String(bp))
    } else {
      await this.dialog().getByLabel("BP Cost").fill(String(bp))
    }
    await this.dialog().getByRole("button", { name: "Save" }).click()
  }

  /** Open the edit dialog for a quality and rename it. */
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
