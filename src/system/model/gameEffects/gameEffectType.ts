export enum GameEffectType {
  initiativeBonus = "initiativeBonus",
  recoilReduction = "recoilReduction",
  dicePoolMod = "dicePoolMod",
  attrMod = "attrMod",
  skillMod = "skillMod",
  skillSpecializationMod = "skillSpecializationMod",
  extraInitiativePasses = "extraInitiativePasses",
  extraInitiativeDice = "extraInitiativeDice",

  /** Ignore the first `value` boxes of damage before calculating wound modifiers. */
  highPainTolerance = "highPainTolerance",

  /** Shrink the wound interval so wound penalties trigger sooner. `value` must be negative. */
  lowPainTolerance = "lowPainTolerance",
}
