import type { Page } from "@playwright/test"

import { AttributesSection } from "./AttributesSection.ts"
import { BpSummaryFooter } from "./BpSummaryFooter.ts"
import { ComplexFormsSection } from "./ComplexFormsSection.ts"
import { ContactsSection } from "./ContactsSection.ts"
import { GearSection } from "./GearSection.ts"
import { QualitiesSection } from "./QualitiesSection.ts"
import { SkillsSection } from "./SkillsSection.ts"
import { SpellsSection } from "./SpellsSection.ts"

/**
 * Root Page Object Model for the character-builder route (/#/new).
 *
 * Exposes child section POMs as properties so test code can read naturally:
 *   builder.skills.addSkill("Dodge", 3)
 *   builder.bpSummary.verify([...])
 */
export class CharacterBuilderPage {
  readonly page: Page
  readonly attributes: AttributesSection
  readonly skills: SkillsSection
  readonly qualities: QualitiesSection
  readonly spells: SpellsSection
  readonly complexForms: ComplexFormsSection
  readonly contacts: ContactsSection
  readonly gear: GearSection
  readonly bpSummary: BpSummaryFooter

  constructor(page: Page) {
    this.page = page
    this.attributes = new AttributesSection(page)
    this.skills = new SkillsSection(page)
    this.qualities = new QualitiesSection(page)
    this.spells = new SpellsSection(page)
    this.complexForms = new ComplexFormsSection(page)
    this.contacts = new ContactsSection(page)
    this.gear = new GearSection(page)
    this.bpSummary = new BpSummaryFooter(page)
  }

  /** Navigate to /#/new with a clean localStorage state. */
  async setup(): Promise<void> {
    await this.page.goto("/")
    await this.page.evaluate(() => localStorage.clear())
    await this.page.goto("/#/new")
    await this.page.getByRole("button", { name: "Reset" }).waitFor()
  }

  async setMetatype(metatype: string): Promise<void> {
    await this.page.getByRole("combobox", { name: "Metatype" }).click()
    await this.page.getByRole("option", { name: metatype }).click()
  }

  async setAwakening(awakening: string): Promise<void> {
    await this.page.getByRole("combobox", { name: "Awakening" }).click()
    await this.page.getByRole("option", { name: awakening }).click()
  }
}
