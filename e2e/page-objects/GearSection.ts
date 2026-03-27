import type { Page } from "@playwright/test"

import { CyberwareSection } from "./CyberwareSection.ts"

/**
 * POM for the Gear section of the character builder.
 * Provides access to sub-sections (Misc, Cyberware) as child POMs.
 */
export class GearSection {
  readonly cyberware: CyberwareSection

  constructor(private readonly page: Page) {
    this.cyberware = new CyberwareSection(page)
  }

  private dialog() {
    return this.page.locator("[role=\"dialog\"]")
  }

  /**
   * Open the Misc accordion and add a single generic gear item.
   *
   * Gear BP formula: `ceil((itemCost + lifestyleCost) / 5_000)`.
   * The default lifestyle is Low × 1 month = 2,000 ¥.
   */
  async addMiscItem(name: string, cost: number): Promise<void> {
    await this.page.getByRole("button", { name: "Misc" }).click()
    await this.page.getByRole("button", { name: "Add Item" }).waitFor()
    await this.page.getByRole("button", { name: "Add Item" }).click()
    await this.dialog().getByLabel("Name").fill(name)
    await this.dialog().getByLabel("Cost (¥)").fill(String(cost))
    await this.dialog().getByRole("button", { name: "Save" }).click()
  }
}
