import { AwakenedType } from '../Character/AwakenedType'
import { CharacterAttr } from '../Character/CharacterAttr'
import { CharacterData } from '../Character/CharacterData'
import { Metatype } from '../Character/Metatypes'
import { ArmorAttr } from '../Gear/Armor/ArmorAttr'
import { CommlinkAttr } from '../Gear/Commlink/CommlinkAttr'
import { GearType } from '../Gear/GearData'
import { WeaponAttr } from '../Gear/Weapons/WeaponAttr'
import { SpellCategory } from '../Spells/SpellCategory'
import { SpellType } from '../Spells/SpellType'
import { EffectType } from '../System/Effect'
import { ActiveSkill, FirearmSpecialties } from '../System/Skill/ActiveSkill/ActiveSkillId'
import { SkillType } from '../System/Skill/SkillData'

export const Xendris: CharacterData = {
  dataVersion: 3,

  bio: {
    name: 'Xendris',
    metatype: Metatype.Human,
    awakened: AwakenedType.Full,
    gender: 'male',
    role: 'Hermetic Mage',
  },

  karma: [
    {
      date: '2021-11-21T15:05',
      value: 3,
      note: 'Session reward',
    },
    {
      date: '2021-11-07T16:00',
      value: 3,
      note: 'Session reward',
    },
    {
      date: '2021-11-21T12:17',
      value: 2,
      note: 'Character Creation',
    },
  ],
  nuyen: [
    {
      date: '2021-11-27T16:00',
      value: 4,
      note: 'Session reward',
    },
    {
      date: '2021-11-21T16:00',
      value: 2_000,
      note: 'Stream income',
    },
    {
      date: '2021-11-21T12:21',
      value: -5_000,
      note: 'Lifestyle (1 month)',
    },
    {
      date: '2021-11-21T12:20',
      value: -2_450,
      note: 'Char creation Gear',
    },
    {
      date: '2021-11-21T12:19',
      value: 8_000,
      note: 'Char creation',
    },
  ],

  lifestyle: {
    grade: 'middle',
    upkeep: 5_000,
    prepaid: 1,
  },

  attributes: {
    [CharacterAttr.body]: 6,
    [CharacterAttr.agility]: 4,
    [CharacterAttr.reaction]: 2,
    [CharacterAttr.strength]: 2,
    [CharacterAttr.willpower]: 3,
    [CharacterAttr.logic]: 5,
    [CharacterAttr.intuition]: 1,
    [CharacterAttr.charisma]: 2,
    [CharacterAttr.edge]: 4,
    [CharacterAttr.magic]: 5,
    [CharacterAttr.resonance]: 0,
    [CharacterAttr.essence]: 6,
  },

  contacts: [
    {
      name: 'Tracy Caldwell',
      connection: 2,
      loyalty: 2,
      description: 'Arcane Professor',
    },
    {
      name: 'Wish',
      connection: 2,
      loyalty: 2,
      description: 'Black Market Dealer',
    },
    {
      name: 'Sparky',
      connection: 2,
      loyalty: 2,
      description: 'Smuggler',
    },
  ],

  skills: [
    {
      type: SkillType.active,
      name: ActiveSkill.closeCombat,
      rank: 7,
      attr: CharacterAttr.agility,
      speciality: 'Blades',
    },
    {
      type: SkillType.active,
      name: ActiveSkill.sorcery,
      rank: 6,
      attr: CharacterAttr.logic,
    },
    {
      type: SkillType.active,
      name: ActiveSkill.firearms,
      rank: 6,
      attr: CharacterAttr.agility,
    },
    {
      type: SkillType.language,
      name: 'English',
      rank: 'native',
    },
  ],

  qualities: [
    {
      name: 'High Pain Tolerance',
      source: { book: 'CRB', page: 72 },
      gameEffect: 'When wounded, reduce your wound penalty by 1 (to a minimum of 0).',
      cost: 7,
    },
    {
      name: 'Analytical Mind',
      source: { book: 'CRB', page: 70 },
      gameEffect: 'Bonus edge when making Logic tests',
      cost: 3,
    },
    {
      name: 'Built Tough (4)',
      source: { book: 'CRB', page: 70 },
      gameEffect: `
        You have a number of additional boxes on your physical Condition
        Monitor equal to the rank of this quality
      `,
      effects: [
        {
          type: EffectType.conditionTrackBonus,
          track: 'physical',
          bonus: 4,
        },
      ],
      cost: 12,
    },
    {
      name: 'Long Reach',
      source: { book: 'CRB', page: 72 },
      gameEffect: `
        When you are using a melee weapon, Close range is extended to 5 meters
        instead of 3.
      `,
      cost: 3,
    },
  ],

  gear: [
    {
      id: '501f13ec-01c5-4369-8e2b-c61381ca3555',
      source: { book: 'CRB', page: 265 },
      gearType: GearType.armor,
      name: 'Armored Jacket',
      type: 'Armor',
      avail: { rarity: 2 },
      cost: 1_000,
      attributes: {
        [ArmorAttr.defenseBonus]: 4,
        [ArmorAttr.capacity]: 8,
      },
      description: `
        Available in all manner of styles, it offers good protection without 
        catching too much attention. But don’t think of wearing one to a 
        social event or government building.
      `,
    },
    {
      id: '0795383b-4050-4979-9623-0ad057d14422',
      source: { book: 'CRB', page: 267 },
      gearType: GearType.other,
      name: 'Sony Emperor',
      type: 'Commlink',
      avail: { rarity: 2 },
      cost: 700,
      attributes: {
        [CommlinkAttr.deviceRating]: 2,
        [CommlinkAttr.attributes]: '1/1',
        [CommlinkAttr.programSlots]: 1,
      },
    },
    {
      id: '0e6bd0a9-822b-4e5e-931b-82fdab1f4ec8',
      source: { book: 'CRB', page: 267 },
      gearType: GearType.weapon,
      name: 'Ares Predator VI',
      type: 'Heavy Pistol',
      avail: { rarity: 2, license: true },
      cost: 750,
      attributes: {
        [WeaponAttr.dv]: '3P',
        [WeaponAttr.modes]: 'SA/BF',
        [WeaponAttr.attackRatings]: '10/10/8/-/-',
        [WeaponAttr.ammo]: '15(c)',
      },
      skill: ActiveSkill.firearms,
      specialtyName: FirearmSpecialties.heavyPistols,
    },
    {
      id: 'c6b2b887-c31c-4ba4-8fa2-fe6e3b5b1f19',
      source: { book: 'CRB', page: 247 },
      gearType: GearType.weapon,
      name: 'Katana',
      type: 'Blade Weapon',
      avail: { rarity: 3 },
      cost: 350,
      attributes: {
        [WeaponAttr.dv]: '4P',
        [WeaponAttr.attackRatings]: '10/-/-/-/-',
      },
      skill: ActiveSkill.closeCombat,
      specialtyName: 'Blades',
    },
  ],

  spellDrainAttr: CharacterAttr.logic,
  spells: [
    {
      id: '56e45b2d-d181-4d48-94f4-c343bd324815',
      name: 'Manabolt',
      source: { book: 'CRB', page: 133 },
      category: SpellCategory.Combat,
      range: 'LOS',
      type: SpellType.Mana,
      duration: 'Instant',
      drainValue: 4,
      damage: 'P',
      damageType: 'Direct',
      area: false,
      effect: `
        Essential spellcasting, shaping mana to crack skulls. Who can argue
        with the purity? Manabolt targets individuals, while Manaball is area
        effect.
      `,
    },
    {
      id: 'e8c1b202-0af1-41c5-a1e0-a97a8737a1bf',
      name: 'Fireball',
      source: { book: 'CRB', page: 133 },
      category: SpellCategory.Combat,
      range: 'LOS (A)',
      type: SpellType.Physical,
      duration: 'Instant',
      drainValue: 6,
      damage: 'P, Special',
      damageType: 'Indirect',
      area: true,
      effect: `
        A classic. When you think of hurting people with magic, the first
        thing that comes to mind is making fire explode in their faces.
        These are the spells that'll get that done. Flamestrike hits
        individuals, Fireball is area effect. Both spells do Fire elemental
        damage, and impose the Burning status with a rating equal to net hits
        on the Spellcasting test.
      `,
    },
    {
      id: '94ed6946-dd22-43a7-9110-6349169092a8',
      name: 'Firestrike',
      source: { book: 'CRB', page: 133 },
      category: SpellCategory.Combat,
      range: 'LOS',
      type: SpellType.Physical,
      duration: 'Instant',
      drainValue: 5,
      damage: 'P, Special',
      damageType: 'Indirect',
      area: false,
      effect: `
        A classic. When you think of hurting people with magic, the first
        thing that comes to mind is making fire explode in their faces.
        These are the spells that'll get that done. Flamestrike hits
        individuals, Fireball is area effect. Both spells do Fire elemental
        damage, and impose the Burning status with a rating equal to net hits
        on the Spellcasting test.
      `,
    },
    {
      id: 'c06c0782-4c65-4dc8-9685-122563f6d600',
      name: 'Resist Pain',
      source: { book: 'CRB', page: 137 },
      category: SpellCategory.Health,
      range: 'Touch',
      type: SpellType.Mana,
      duration: 'Sustained',
      drainValue: 5,
      effect: `
        While not providing healing, this spell allows the target to ignore
        the effects of damage, moving forward as if they did not have that
        pain. Roll Sorcery + Magic (5 - Essence); for each net hit, the target
        can reduce dice-pool modifiers from damage by 1.
      `,
    },
    {
      id: 'fe3a1eea-140c-4b09-a324-9832bbe70b83',
      name: 'Increase Attribute',
      source: { book: 'CRB', page: 137 },
      category: SpellCategory.Health,
      range: 'Touch',
      type: SpellType.Physical,
      duration: 'Sustained',
      drainValue: 3,
      effect: `
        The touch of the mage strengthens, speeds, or enlightens the target,
        temporarily raising one of their attributes. The caster decides which
        attribute to target before casting the spell. The caster rolls a
        Sorcery + Magic (5 - essence) test. They can select how many net hits
        they actually apply to the target to increase the selected attribute, 
        at a rate of 1 point of increase per net hit (maximum bonus +4); for
        each net hit applied beyond the first, the Drain Value of the spell
        increases by 1. The spell cannot affect Edge, Essence, Magic, or
        Resonance.
      `,
    },
    {
      id: 'e1bc877c-539a-4df3-8653-bac9219f5b55',
      name: 'Decrease Attribute',
      source: { book: 'CRB', page: 136 },
      category: SpellCategory.Health,
      range: 'Touch',
      type: SpellType.Physical,
      duration: 'Sustained',
      drainValue: 3,
      effect: `
        The touch of the mage weakens, slows, or stupefies the target,
        temporarily lowering one of their attributes. The caster decides which
        attribute to target before casting the spell. The caster rolls a
        Sorcery + Magic vs Willpower + targeted attribute. They can select how 
        many net hits they actually apply to the target at a rate of 1 point 
        of decrease per net hit; for each net hit applied beyond the first, 
        the Drain Value of the spell increases by 1. The spell cannot affect 
        Edge, Essence, Magic, or Resonance.
      `,
    },
    {
      id: '5b2c4a6e-5898-4abb-a795-7c8fffbf02ba',
      name: 'Increase Reflexes',
      source: { book: 'CRB', page: 137 },
      category: SpellCategory.Health,
      range: 'Touch',
      type: SpellType.Physical,
      duration: 'Sustained',
      drainValue: 5,
      effect: `
        The reaction time and speed of the target increase, making them better
        able to anticipate and respond to others. The caster rolls a Sorcery +
        Magic (5 - Essence) test. They can select how many net hits they
        actually apply to the target to increase both their Reaction score and
        the number of Initiative Die, at a rate of 1 point of increase and 1
        Initiative die per net hit; for each net hit applied beyond the first,
        the Drain Value of the spell increases by 1.
      `,
    },
    {
      id: '0f906a30-d84d-40af-8adb-76e23892e323',
      name: 'Heal',
      source: { book: 'CRB', page: 136 },
      category: SpellCategory.Health,
      range: 'Touch',
      type: SpellType.Physical,
      duration: 'Permanent',
      drainValue: 3,
      effect: `
        Shadowrunning comes with bumps, bruises, and bullet wounds, and
        magic is perhaps the quickest and most effective way to repair it.
        When casting this spell, roll Sorcery + Magic with a threshold of (5 -
        Essence). Heal 1 box of Stun, Physical, or Overflow damage per net hit.
        Injuries can only be affected once by any Heal spell (including
        Cleansing Heal, Colling Heal, and Warming Heal).
      `,
    },
  ],
}
