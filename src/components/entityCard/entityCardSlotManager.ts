import { SlotManager } from "#/lib/slotUtils.ts"

import { EntityCardElements } from "./entityCardElements.tsx"
import EntityCardLayout from "./entityCardLayout.tsx"

export class EntityCardSlotManager extends SlotManager {
  get layout() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const slots = this

    return {
      get titleRight() {
        return slots.filter(EntityCardLayout.TitleRight)
      },

      get topRight() {
        return slots.filter(EntityCardLayout.TopRight)
      },

      get headerRows() {
        return slots.filter(EntityCardLayout.HeaderRow)
      },

      get bodyRows() {
        return slots.filter(EntityCardLayout.BodyRow)
      },

      get footerRows() {
        return slots.filter(EntityCardLayout.FooterRow)
      },

      get footerLeft() {
        return slots.filter(EntityCardLayout.FooterLeft)
      },

      get footerRight() {
        return slots.filter(EntityCardLayout.FooterRight)
      },
    }
  }

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
}
