import type { Page } from "@playwright/test"

/**
 * POM for the Skills section of the character builder.
 * Covers active skills and skill groups.
 */
export class SkillsSection {
  constructor(private readonly page: Page) {}

  // ─── Active skills ──────────────────────────────────────────────────────────

  async addSkill(name: string, rating: number, specialization?: string): Promise<void> {
    await this.page.getByRole("button", { name: "Add Skill" }).click()
    await this.page.getByRole("combobox", { name: "Skill" }).click()
    await this.page.getByRole("option", { name, exact: true }).click()
    await this.page.getByRole("combobox", { name: "Rating" }).click()
    await this.page.getByRole("option", { name: String(rating), exact: true }).click()
    if (specialization) {
      await this.page.getByLabel("Specialization (optional)").fill(specialization)
    }
    await this.page.getByRole("button", { name: "Save" }).click()
  }

  /**
   * Open the edit dialog for a skill and set or clear its specialization.
   * Pass `null` to clear the existing value.
   */
  async editSpecialization(skillName: string, specialization: string | null): Promise<void> {
    await this.page.getByText(skillName).click()
    const specField = this.page.getByLabel("Specialization (optional)")
    if (specialization === null) {
      await specField.clear()
    } else {
      await specField.fill(specialization)
    }
    await this.page.getByRole("button", { name: "Save" }).click()
  }

  async removeSkill(skillName: string): Promise<void> {
    await this.page.getByText(skillName).click()
    await this.page.getByRole("button", { name: "Delete" }).click()
  }

  // ─── Skill groups ───────────────────────────────────────────────────────────

  async addGroup(name: string, rating: number): Promise<void> {
    await this.page.getByRole("button", { name: "Add Group" }).click()
    await this.page.getByRole("combobox", { name: "Skill Group" }).click()
    await this.page.getByRole("option", { name, exact: true }).click()
    await this.page.getByRole("combobox", { name: "Rating" }).click()
    await this.page.getByRole("option", { name: String(rating), exact: true }).click()
    await this.page.getByRole("button", { name: "Save" }).click()
  }

  async editGroupRating(groupName: string, newRating: number): Promise<void> {
    await this.page.getByText(groupName).click()
    await this.page.getByRole("combobox", { name: "Rating" }).click()
    await this.page.getByRole("option", { name: String(newRating), exact: true }).click()
    await this.page.getByRole("button", { name: "Save" }).click()
  }

  async removeGroup(groupName: string): Promise<void> {
    await this.page.getByText(groupName).click()
    await this.page.getByRole("button", { name: "Delete" }).click()
  }
}
