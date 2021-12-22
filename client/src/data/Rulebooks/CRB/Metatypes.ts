import { CharacterAttr } from '../../../Character/CharacterAttr'
import { Metatype } from '../../../Character/Metatype'
import { toCharQuality } from '../../../Qualities/CharacterQuality'
import { QualityIds } from './Qualities'

export enum MetatypeId {
  dwarf = 'metatype.CRB.dwarf',
  elf = 'metatype.CRB.elf',
  human = 'metatype.CRB.human',
  ork = 'metatype.CRB.ork',
  troll = 'metatype.CRB.troll'
}

export const Metatypes: Metatype[] = [
  {
    id: MetatypeId.dwarf,
    name: 'Dwarf',
    qualities: [
      toCharQuality(QualityIds.toxinResistance),
      toCharQuality(QualityIds.thermographicVision),
    ],
    priorityLevels: ['A', 'B', 'C', 'D', 'E'],
    attrMaximums: {
      [CharacterAttr.body]: 7,
      [CharacterAttr.agility]: 6,
      [CharacterAttr.reaction]: 5,
      [CharacterAttr.strength]: 8,
      [CharacterAttr.willpower]: 7,
      [CharacterAttr.logic]: 6,
      [CharacterAttr.intuition]: 6,
      [CharacterAttr.charisma]: 6,
      [CharacterAttr.edge]: 7,
      [CharacterAttr.magic]: 6,
      [CharacterAttr.resonance]: 6,
      [CharacterAttr.essence]: 6,
    },
  },
  {
    id: MetatypeId.elf,
    name: 'Elf',
    qualities: [
      toCharQuality(QualityIds.lowLightVision),
    ],
    priorityLevels: ['B', 'C', 'D', 'E'],
    attrMaximums: {
      [CharacterAttr.body]: 6,
      [CharacterAttr.agility]: 7,
      [CharacterAttr.reaction]: 6,
      [CharacterAttr.strength]: 6,
      [CharacterAttr.willpower]: 6,
      [CharacterAttr.logic]: 6,
      [CharacterAttr.intuition]: 6,
      [CharacterAttr.charisma]: 8,
      [CharacterAttr.edge]: 6,
      [CharacterAttr.magic]: 6,
      [CharacterAttr.resonance]: 6,
      [CharacterAttr.essence]: 6,
    },
  },
  {
    id: MetatypeId.human,
    name: 'Human',
    qualities: [],
    priorityLevels: ['C', 'D', 'E'],
    attrMaximums: {
      [CharacterAttr.body]: 6,
      [CharacterAttr.agility]: 6,
      [CharacterAttr.reaction]: 6,
      [CharacterAttr.strength]: 6,
      [CharacterAttr.willpower]: 6,
      [CharacterAttr.logic]: 6,
      [CharacterAttr.intuition]: 6,
      [CharacterAttr.charisma]: 6,
      [CharacterAttr.edge]: 7,
      [CharacterAttr.magic]: 6,
      [CharacterAttr.resonance]: 6,
      [CharacterAttr.essence]: 6,
    },
  },
  {
    id: MetatypeId.ork,
    name: 'Ork',
    qualities: [
      toCharQuality(QualityIds.lowLightVision),
      toCharQuality(QualityIds.builtTough, { level: 2 }),
    ],
    priorityLevels: ['A', 'B', 'C', 'D', 'E'],
    attrMaximums: {
      [CharacterAttr.body]: 8,
      [CharacterAttr.agility]: 1,
      [CharacterAttr.reaction]: 1,
      [CharacterAttr.strength]: 8,
      [CharacterAttr.willpower]: 1,
      [CharacterAttr.logic]: 1,
      [CharacterAttr.intuition]: 1,
      [CharacterAttr.charisma]: 5,
      [CharacterAttr.edge]: 1,
      [CharacterAttr.magic]: 6,
      [CharacterAttr.resonance]: 6,
      [CharacterAttr.essence]: 6,
    },
  },
  {
    id: MetatypeId.troll,
    name: 'Troll',
    qualities: [
      toCharQuality(QualityIds.dermalDeposits),
      toCharQuality(QualityIds.thermographicVision),
      toCharQuality(QualityIds.builtTough, { level: 3 }),
    ],
    priorityLevels: ['A', 'B', 'C', 'D', 'E'],
    attrMaximums: {
      [CharacterAttr.body]: 9,
      [CharacterAttr.agility]: 5,
      [CharacterAttr.reaction]: 1,
      [CharacterAttr.strength]: 9,
      [CharacterAttr.willpower]: 1,
      [CharacterAttr.logic]: 1,
      [CharacterAttr.intuition]: 1,
      [CharacterAttr.charisma]: 5,
      [CharacterAttr.edge]: 1,
      [CharacterAttr.magic]: 6,
      [CharacterAttr.resonance]: 6,
      [CharacterAttr.essence]: 6,
    },
  },
]
