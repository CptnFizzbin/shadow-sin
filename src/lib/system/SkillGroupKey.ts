import { MetatypeKey } from "#/lib/system/MetatypeData.ts"
import type { AwakeningType } from "#/lib/system/awakeningType.ts"
import {
  MagicAwakeningTypes,
  TechAwakeningTypes,
} from "#/lib/system/awakeningType.ts"

export enum SkillGroupKey {
  Athletics = "Athletics",
  Biotech = "Biotech",
  CloseCombat = "Close Combat",
  Conjuring = "Conjuring",
  Cracking = "Cracking",
  Electronics = "Electronics",
  Firearms = "Firearms",
  Influence = "Influence",
  Mechanic = "Mechanic",
  Outdoors = "Outdoors",
  Sorcery = "Sorcery",
  Stealth = "Stealth",
  Tasking = "Tasking",
}

export interface SkillGroupInfo {
  name: string
  required?: {
    awakenings?: AwakeningType[]
    metatypes?: MetatypeKey[]
  }
}

export const SkillGroups: Record<SkillGroupKey, SkillGroupInfo> = {
  [SkillGroupKey.Athletics]: {
    name: SkillGroupKey.Athletics,
  },
  [SkillGroupKey.Biotech]: {
    name: SkillGroupKey.Biotech,
  },
  [SkillGroupKey.CloseCombat]: {
    name: SkillGroupKey.CloseCombat,
  },
  [SkillGroupKey.Conjuring]: {
    name: SkillGroupKey.Conjuring,
    required: {
      awakenings: MagicAwakeningTypes,
    },
  },
  [SkillGroupKey.Cracking]: {
    name: SkillGroupKey.Cracking,
  },
  [SkillGroupKey.Electronics]: {
    name: SkillGroupKey.Electronics,
  },
  [SkillGroupKey.Firearms]: {
    name: SkillGroupKey.Firearms,
  },
  [SkillGroupKey.Influence]: {
    name: SkillGroupKey.Influence,
  },
  [SkillGroupKey.Mechanic]: {
    name: SkillGroupKey.Mechanic,
  },
  [SkillGroupKey.Outdoors]: {
    name: SkillGroupKey.Outdoors,
  },
  [SkillGroupKey.Sorcery]: {
    name: SkillGroupKey.Sorcery,
    required: {
      awakenings: MagicAwakeningTypes,
    },
  },
  [SkillGroupKey.Stealth]: {
    name: SkillGroupKey.Stealth,
  },
  [SkillGroupKey.Tasking]: {
    name: SkillGroupKey.Tasking,
    required: {
      awakenings: TechAwakeningTypes,
      metatypes: [MetatypeKey.AI],
    },
  },
}

export const SkillGroupNames = Object.values(SkillGroupKey)
