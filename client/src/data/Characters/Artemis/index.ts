import { AwakenedType } from '../../../Character/AwakenedType'
import { CharacterAttr } from '../../../Character/CharacterAttr'
import { CharacterData } from '../../../Character/CharacterData'
import { toCharQuality } from '../../../Qualities/CharacterQuality'
import { Qualities, QualityIds } from '../../../Qualities/Quality'
import { ActiveSkillIds, SkillType, Specializations } from '../../../Skills'
import { addAllGear } from './gear'
import { karma } from './karma'
import { nuyen } from './nuyen'

export const Artemis: CharacterData = {
  dataVersion: 3,

  bio: {
    name: 'Jessica Nelson',
    alias: 'Artemis',
    role: 'Rigger',
    gender: 'Female',
    metatype: 'Elf',
    awakened: AwakenedType.Mundane,
    age: '26',
    height: '190cm',
  },

  karma,
  nuyen,
  gear: [],

  lifestyle: {
    grade: 'middle',
    upkeep: 5_000,
    prepaid: 3,
  },

  attributes: {
    [CharacterAttr.body]: 2,
    [CharacterAttr.agility]: 6,
    [CharacterAttr.reaction]: 5,
    [CharacterAttr.strength]: 3,
    [CharacterAttr.willpower]: 1,
    [CharacterAttr.logic]: 7,
    [CharacterAttr.intuition]: 5,
    [CharacterAttr.charisma]: 2,
    [CharacterAttr.edge]: 4,
    [CharacterAttr.magic]: 0,
    [CharacterAttr.resonance]: 0,
    [CharacterAttr.essence]: 6,
  },

  contacts: [
    {
      name: 'James Serif',
      connection: 2,
      loyalty: 2,
      description: 'Drone Parts Dealer',
    },
    {
      name: 'Frank',
      connection: 2,
      loyalty: 2,
      description: 'Matrix Developer',
    },
    {
      name: 'George Crabtree',
      connection: 2,
      loyalty: 2,
      description: 'Lone Star officer',
    },
  ],

  skills: [
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.electronics,
      rank: 3,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.firearms,
      rank: 5,
      specialization: Specializations.CRB.Firearms.SubmachineGuns,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.piloting,
      rank: 5,
      specialization: Specializations.CRB.Piloting.Aircraft,
      expertise: Specializations.CRB.Piloting.GroundCraft,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.engineering,
      rank: 7,
    },
    {
      type: SkillType.language,
      name: 'English',
      rank: 'native',
    },
    {
      type: SkillType.language,
      name: 'Elven',
      rank: 'speciality',
    },
    {
      type: SkillType.knowledge,
      name: 'Drone Models',
    },
    {
      type: SkillType.knowledge,
      name: '80/90s Pop Culture',
    },
    {
      type: SkillType.knowledge,
      name: 'Trideo Series',
    },
    {
      type: SkillType.knowledge,
      name: 'Security Systems',
    },
    {
      type: SkillType.knowledge,
      name: 'Virtual Nightclubs',
    },
    {
      type: SkillType.knowledge,
      name: 'Tech Companies',
    },
  ],

  qualities: [
    toCharQuality(Qualities[QualityIds.CRB.exceptional], {type: CharacterAttr.logic}),
    toCharQuality(Qualities[QualityIds.CRB.aptitude], {type: ActiveSkillIds.CRB.engineering}),
    toCharQuality(Qualities[QualityIds.CRB.photographicMemory]),
    toCharQuality(Qualities[QualityIds.CRB.analyticalMind]),
    toCharQuality(Qualities[QualityIds.CRB.ambidextrous]),
    toCharQuality(Qualities[QualityIds.CRB.socialStress], {type: 'Large Groups'}),
  ],
}

addAllGear(Artemis)
