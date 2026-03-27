import type { Page } from "@playwright/test"

export interface AddImplantOptions {
  name: string
  cost: string
  essenceCost: string
  grade?: string
  implantType?: string
}

/**
 * POM for the Cyberware accordion panel inside the Gear section.
 */
export class CyberwareSection {
  constructor(private readonly page: Page) {}

  private dialog() {
    return this.page.locator("[role=\"dialog\"]")
  }

  /** Expand the Cyberware accordion and wait for the Add Implant button. */
  async open(): Promise<void> {
    await this.page.getByText("Cyberware").first().click()
    await this.page.getByRole("button", { name: "Add Implant" }).waitFor()
  }

  async addImplant(opts: AddImplantOptions): Promise<void> {
    await this.page.getByRole("button", { name: "Add Implant" }).click()
    await this.dialog().getByLabel("Name").fill(opts.name)
    await this.dialog().getByLabel("Base Cost (¥)").fill(opts.cost)
    await this.dialog().getByLabel("Base Essence Cost").fill(opts.essenceCost)
    if (opts.grade) {
      await this.dialog().getByRole("combobox", { name: "Grade" }).click()
      await this.page.getByRole("option", { name: opts.grade }).click()
    }
    if (opts.implantType) {
      await this.dialog().getByRole("combobox", { name: "Type" }).click()
      await this.page.getByRole("option", { name: opts.implantType }).click()
    }
    await this.dialog().getByRole("button", { name: "Save" }).click()
  }

  async renameImplant(currentName: string, newName: string): Promise<void> {
    await this.page.getByText(currentName).click()
    await this.dialog().getByLabel("Name").clear()
    await this.dialog().getByLabel("Name").fill(newName)
    await this.dialog().getByRole("button", { name: "Save" }).click()
  }

  /** Remove an implant via the delete icon on its list row (not the edit dialog).
   * Uses the parent container of the item name text to find the row's trailing
   * delete button.
   */
  async removeImplant(name: string): Promise<void> {
    const row = this.page.locator(`text=${name}`).locator("..")
    await row.getByRole("button").last().click()
  }
}
