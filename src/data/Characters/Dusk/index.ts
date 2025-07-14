import { AwakenedType } from "../../../Character/AwakenedType"
import { CharacterAttr } from "../../../Character/CharacterAttr"
import { CharacterData } from "../../../Character/CharacterData"
import { toCharQuality } from "../../../Qualities/CharacterQuality"
import { QualityIds } from "../../../Qualities/Quality"
import { ActiveSkillIds, SkillType } from "../../../Skills"
import { contacts } from "./contacts"
import { gear } from "./gear"
import { karma } from "./karma"
import { nuyen } from "./nuyen"
import { spells } from "./spells"

export const Dusk: CharacterData = {
  dataVersion: 3,

  bio: {
    name: "Dusk",
    role: "Mage",
    gender: "Male",
    metatype: "Elf",
    awakened: AwakenedType.Full,
  },

  lifestyle: {
    grade: "Low",
    prepaid: 0,
    upkeep: 2_000,
  },

  attributes: {
    [CharacterAttr.body]: 3,
    [CharacterAttr.agility]: 7,
    [CharacterAttr.reaction]: 5,
    [CharacterAttr.strength]: 1,
    [CharacterAttr.willpower]: 5,
    [CharacterAttr.logic]: 1,
    [CharacterAttr.intuition]: 5,
    [CharacterAttr.charisma]: 9,
    [CharacterAttr.edge]: 4,
    [CharacterAttr.magic]: 6,
    [CharacterAttr.resonance]: 0,
    [CharacterAttr.essence]: 6,
  },

  qualities: [
    toCharQuality(QualityIds.CRB.lowLightVision, { metaType: true }),
    toCharQuality(QualityIds.CRB.focusedConcentration, { level: 3 }),
    toCharQuality(QualityIds.CRB.aptitude, {
      type: ActiveSkillIds.CRB.sorcery,
    }),
    toCharQuality(QualityIds.CRB.exceptional, { type: CharacterAttr.charisma }),
    toCharQuality(QualityIds.CRB.quickHealer),
    toCharQuality(QualityIds.CRB.arVertigo),
    toCharQuality(QualityIds.CRB.impairedAttr, { type: CharacterAttr.logic }),
  ],

  skills: [
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.sorcery,
      rank: 7,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.astral,
      rank: 4,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.con,
      rank: 4,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.influence,
      rank: 6,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.firearms,
      rank: 3,
    },
    {
      type: SkillType.language,
      name: "English",
      rank: "native",
    },
  ],

  karma,
  nuyen,
  contacts,
  gear,
  spells,
}
