export enum GameEffectType {
  initiativeBonus = "initiativeBonus",
  recoilReduction = "recoilReduction",
  dicePoolMod = "dicePoolMod",
  attrMod = "attrMod",
  skillMod = "skillMod",
  extraInitiativePasses = "extraInitiativePasses",
  painTolerance = "painTolerance",
}

export interface GameEffectData {
  type: GameEffectType | string
  target?: string
  value: number
}