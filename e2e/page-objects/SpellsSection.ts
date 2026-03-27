import type { Page } from "@playwright/test"

export type SpellType = "Physical" | "Mana"
export type SpellDamage = "Physical" | "Stun"
export type SpellRange = "Touch" | "Line of Sight" | "Line of Sight (Area)"

/**
 * POM for the Spells section of the character builder (Magician / Mystic Adept).
 */
export class SpellsSection {
  constructor(private readonly page: Page) {}

  private dialog() {
    return this.page.locator("[role=\"dialog\"]")
  }

  async add(
    name: string,
    type: SpellType = "Physical",
    damage: SpellDamage = "Physical",
    range: SpellRange = "Line of Sight",
  ): Promise<void> {
    await this.page.getByRole("button", { name: "Add Spell" }).click()
    await this.dialog().getByLabel("Name").fill(name)
    await this.dialog().getByRole("combobox", { name: "Type" }).click()
    await this.page.getByRole("option", { name: type }).click()
    await this.dialog().getByRole("combobox", { name: "Damage" }).click()
    await this.page.getByRole("option", { name: damage }).click()
    await this.dialog().getByRole("combobox", { name: "Range" }).click()
    await this.page.getByRole("option", { name: range }).click()
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
