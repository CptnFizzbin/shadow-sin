import { SlotManager } from "#/lib/slotUtils.ts"

import { EntityCardElements } from "./entityCardElements.tsx"
import { EntityCardLayout } from "./entityCardLayout.tsx"

export class EntityCardSlotManager extends SlotManager {
  get title() {
    return this.find(EntityCardElements.Title)
  }

  get rating() {
    return this.find(EntityCardElements.Rating)
  }

  get source() {
    return this.find(EntityCardElements.Source)
  }

  get effects() {
    return this.find(EntityCardElements.Effects)
  }

  get stats() {
    return this.filter(EntityCardElements.Stat)
  }

  get actions() {
    return this.filter(EntityCardElements.Action)
  }

  get headerRows() {
    return this.filter(EntityCardLayout.HeaderRow)
  }

  get bodyRows() {
    return this.filter(EntityCardLayout.BodyRow)
  }

  get footerRows() {
    return this.filter(EntityCardLayout.FooterRow)
  }
}
