import type { Page } from "@playwright/test"

/**
 * POM for the Qualities section of the character builder.
 */
export class QualitiesSection {
  constructor(private readonly page: Page) {}

  /**
   * Open the Add Quality dialog and save a new quality.
   * The dialog defaults to "positive"; one click on the toggle switches to "negative".
   * The BP field label is "BP Cost" for positive and "BP Bonus" for negative.
   */
  async add(name: string, type: "positive" | "negative", bp: number): Promise<void> {
    await this.page.getByRole("button", { name: "Add Quality" }).click()
    await this.page.getByLabel("Name").fill(name)
    if (type === "negative") {
      await this.page.getByRole("button", { name: /positive|negative/i }).click()
      await this.page.getByLabel("BP Bonus").fill(String(bp))
    } else {
      await this.page.getByLabel("BP Cost").fill(String(bp))
    }
    await this.page.getByRole("button", { name: "Save" }).click()
  }

  /** Open the edit dialog for a quality and rename it. */
  async rename(currentName: string, newName: string): Promise<void> {
    await this.page.getByText(currentName).click()
    await this.page.getByLabel("Name").clear()
    await this.page.getByLabel("Name").fill(newName)
    await this.page.getByRole("button", { name: "Save" }).click()
  }

  async remove(name: string): Promise<void> {
    await this.page.getByText(name).click()
    await this.page.getByRole("button", { name: "Delete" }).click()
  }
}
