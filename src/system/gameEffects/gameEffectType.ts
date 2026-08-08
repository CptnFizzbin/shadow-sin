export enum GameEffectType {
  initiativeBonus = "initiativeBonus",
  recoilReduction = "recoilReduction",
  dicePoolMod = "dicePoolMod",
  attrMod = "attrMod",
  skillMod = "skillMod",
  skillSpecializationMod = "skillSpecializationMod",
  extraInitiativePasses = "extraInitiativePasses",
  extraInitiativeDice = "extraInitiativeDice",

  /**
   * @deprecated Use `highPainTolerance` or `lowPainTolerance` instead.
   * Retained only for the 011_splitPainToleranceEffects migration that converts existing records.
   */
  painTolerance = "painTolerance",

  /** Ignore the first `value` boxes of damage before calculating wound modifiers. */
  highPainTolerance = "highPainTolerance",

  /** Shrink the wound interval so wound penalties trigger sooner. `value` must be negative. */
  lowPainTolerance = "lowPainTolerance",
}
