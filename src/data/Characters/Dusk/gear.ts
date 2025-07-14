import { ArmorAttr } from '../../../Gear/Armor/ArmorAttr'
import { CommlinkAttr } from '../../../Gear/Commlink/CommlinkAttr'
import { GearData, GearType } from '../../../Gear/GearData'
import { EffectType } from '../../../System/Effect'
import { weapons } from './weapons'

export const gear: GearData[] = [
  ...weapons,
  {
    id: 'd6321f23-cc7d-4828-b4db-650ba9abcddd',
    gearType: GearType.armor,
    name: 'Armored Jacket',
    type: 'Armor',
    source: { book: 'CRB', page: 265 },
    avail: { rarity: 2 },
    cost: 1_000,

    effects: [
      { type: EffectType.defRatingAdj, value: 4 },
    ],

    attributes: {
      [ArmorAttr.defenseBonus]: 4,
      [ArmorAttr.capacity]: 8,
    },
  },
  {
    id: 'db4e62f3-7ad8-4604-bdd7-d70a03590501',
    gearType: GearType.other,
    name: 'Spellcasting Foci',
    type: 'Spell Foci, Spellcasting',
    cost: 4_000,
    source: { book: 'CRB', page: 194 },
    avail: { rarity: 1, license: true },

    attributes: {
      'Category': 'Combat',
      'Force': 1,
    },
  },
  {
    id: '694d1107-e1fc-47fe-a15b-9927341b9e94',
    gearType: GearType.other,
    name: 'Renraku Sensei',
    type: 'Commlink',
    cost: 1_000,
    source: { book: 'CRB', page: 267 },
    avail: { rarity: 2 },

    attributes: {
      [CommlinkAttr.deviceRating]: 3,
      [CommlinkAttr.attributes]: '2/0',
      [CommlinkAttr.programSlots]: '1',
    },
  },
]
