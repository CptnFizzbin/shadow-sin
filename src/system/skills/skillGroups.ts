import { MagicAwakeningTypes, TechAwakeningTypes } from "#/system/awakeningType"
import { MetatypeType } from "#/system/metatypeData"
import type { SkillGroupInfo } from "#/system/skills/skillGroupInfo"
import { SkillGroupKey } from "#/system/skills/skillGroupKey"

export const SkillGroups: Readonly<Record<SkillGroupKey, SkillGroupInfo>> = {
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
      metatypes: [MetatypeType.AI],
    },
  },
}
