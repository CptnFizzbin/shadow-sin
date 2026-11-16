/** The kinds of Focus a Runner can own and Bond. */
export enum FocusType {
  Spellcasting = "Spellcasting",
  Counterspelling = "Counterspelling",
  Sustaining = "Sustaining",
  Summoning = "Summoning",
  Banishing = "Banishing",
  Binding = "Binding",
  Weapon = "Weapon",
  Power = "Power",
}

/**
 * What a Focus of a given type is tied to when it's made: a spell category, a spirit type, the
 * weapon it's attached to, or nothing at all.
 */
export enum FocusLink {
  spellCategory = "spellCategory",
  spiritType = "spiritType",
  weapon = "weapon",
  none = "none",
}

export const focusLinkByType: Record<FocusType, FocusLink> = {
  [FocusType.Spellcasting]: FocusLink.spellCategory,
  [FocusType.Counterspelling]: FocusLink.spellCategory,
  [FocusType.Sustaining]: FocusLink.spellCategory,
  [FocusType.Summoning]: FocusLink.spiritType,
  [FocusType.Banishing]: FocusLink.spiritType,
  [FocusType.Binding]: FocusLink.spiritType,
  [FocusType.Weapon]: FocusLink.weapon,
  [FocusType.Power]: FocusLink.none,
}

/** Karma per point of Force it costs to Bond a Focus of each type. */
export const focusBondingKarmaMultiplier: Record<FocusType, number> = {
  [FocusType.Spellcasting]: 4,
  [FocusType.Counterspelling]: 3,
  [FocusType.Sustaining]: 2,
  [FocusType.Summoning]: 4,
  [FocusType.Banishing]: 3,
  [FocusType.Binding]: 3,
  [FocusType.Weapon]: 3,
  [FocusType.Power]: 8,
}
