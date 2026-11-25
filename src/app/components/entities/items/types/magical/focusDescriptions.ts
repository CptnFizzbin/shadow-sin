import type { FocusData } from "#/data/items/magicalData.ts"
import { FocusType } from "#/data/magic/focusData.ts"
import { SpiritTypePluralLabels } from "#/data/magic/spiritData.ts"

/**
 * What `focus` is tied to, in on-screen words — e.g. "Combat spells", "Spirits of Fire", or the
 * name of its weapon (`weaponName`) — or `undefined` when its type needs a link it doesn't have yet,
 * or needs none.
 */
export function getFocusLinkLabel(focus: FocusData, weaponName?: string): string | undefined {
  switch (focus.focusType) {
    case FocusType.Spellcasting:
    case FocusType.Counterspelling:
    case FocusType.Sustaining:
      return focus.spellCategory ? `${focus.spellCategory} spells` : undefined
    case FocusType.Summoning:
    case FocusType.Banishing:
    case FocusType.Binding:
      return focus.spiritType ? SpiritTypePluralLabels[focus.spiritType] : undefined
    case FocusType.Weapon:
      return weaponName
    case FocusType.Power:
      return undefined
  }
}

/**
 * A one-line, on-screen summary of what `focus` does while Bonded and Equipped, e.g. "+3 dice to
 * summon Spirits of Fire". Names what's missing instead when the Focus lacks its link.
 */
export function getFocusBonusDescription(focus: FocusData, weaponName?: string): string {
  const dice = `+${focus.force} ${focus.force === 1 ? "die" : "dice"}`
  const link = getFocusLinkLabel(focus, weaponName)

  switch (focus.focusType) {
    case FocusType.Spellcasting:
      return link ? `${dice} to cast ${link}` : "Choose a spell category"
    case FocusType.Counterspelling:
      return link ? `${dice} to counterspell ${link}` : "Choose a spell category"
    case FocusType.Sustaining:
      return link ? `Sustains one of your ${link}` : "Choose a spell category"
    case FocusType.Summoning:
      return link ? `${dice} to summon ${link}` : "Choose a spirit type"
    case FocusType.Banishing:
      return link ? `${dice} to banish ${link}` : "Choose a spirit type"
    case FocusType.Binding:
      return link ? `${dice} to bind ${link}` : "Choose a spirit type"
    case FocusType.Weapon:
      return link ? `${dice} to attacks with ${link}` : "Attach it to a weapon"
    case FocusType.Power:
      return `${dice} to Magic tests`
  }
}
