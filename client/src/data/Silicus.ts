import { nextRecordId } from '../Api/Model'
import { CharacterAttr, CharacterData } from '../Character/CharacterData'
import { AugmentAttr, AugmentData, AugmentGrade, AugmentSlot } from '../Gear/Augments/AugmentData'
import { EffectType } from '../Gear/Effect'
import { GearData, GearType } from '../Gear/GearData'
import { WeaponAttr, WeaponData } from '../Gear/Weapons/WeaponData'
import { WeaponModData, WeaponModSlot } from '../Gear/Weapons/WeaponModData'
import { ActiveSkillId, SkillType } from '../System/Skill/SkillData'

export const Silicus: CharacterData = {
  id: 'fc7d8ad1-c25e-4c1b-8c13-0e795a449ef2',
  dataVersion: 1,
  name: 'Silicus',
  metaType: 'Elf',
  karma: 7,
  nuyen: 14_420,

  attributes: {
    [CharacterAttr.body]: 3,
    [CharacterAttr.agility]: 7,
    [CharacterAttr.reaction]: 1,
    [CharacterAttr.strength]: 1,
    [CharacterAttr.willpower]: 1,
    [CharacterAttr.logic]: 5,
    [CharacterAttr.intuition]: 2,
    [CharacterAttr.charisma]: 1,
    [CharacterAttr.edge]: 4,
    [CharacterAttr.essence]: 2.55,
  },

  contacts: [],
  skills: [
    {
      type: SkillType.active,
      skillId: ActiveSkillId.athletics,
      name: 'Athletics',
      rank: 4,
      attr: 'agility',
      altAttr: 'strength',
    },
    {
      type: SkillType.active,
      skillId: ActiveSkillId.biotech,
      name: 'Biotech',
      rank: 4,
      attr: 'logic',
      altAttr: 'intuition',
    },
    {
      type: SkillType.active,
      skillId: ActiveSkillId.firearms,
      name: 'Firearms',
      rank: 6,
      attr: 'agility',
      speciality: 'Automatics',
    },
    {
      type: SkillType.active,
      skillId: ActiveSkillId.perception,
      name: 'Perception',
      rank: 3,
      attr: 'intuition',
      altAttr: 'logic',
    },
    {
      type: SkillType.active,
      skillId: ActiveSkillId.stealth,
      name: 'Stealth',
      rank: 5,
      attr: 'agility',
    },
    {
      type: SkillType.active,
      skillId: ActiveSkillId.electronics,
      name: 'Electronics',
      rank: 3,
      attr: 'logic',
    },
    {
      type: SkillType.active,
      skillId: ActiveSkillId.cracking,
      name: 'Cracking',
      rank: 3,
      attr: 'logic',
      altAttr: 'intuition',
    },
    {
      type: SkillType.active,
      skillId: ActiveSkillId.closeCombat,
      name: 'Close Combat',
      rank: 3,
      attr: 'agility',
    },
    {
      type: SkillType.language,
      name: 'English',
      rank: 'native',
    },
    {
      type: SkillType.knowledge,
      name: 'Espionage Techniques',
    },
    {
      type: SkillType.knowledge,
      name: 'Security Systems',
    },
    {
      type: SkillType.knowledge,
      name: 'Tech Companies',
    },
    {
      type: SkillType.knowledge,
      name: 'Weapon Manufacturers',
    },
    {
      type: SkillType.knowledge,
      name: 'Hacker Groups',
    },
  ],

  gear: [],
}

function addGear<T extends GearData> (gear: T, attachedGear: GearData[] = []): T {
  gear = { ...gear, dataVersion: 1, id: nextRecordId() }

  Silicus.gear.push(gear)
  attachedGear.forEach(item => item.attachedTo = gear.id)

  return gear
}

const smartGunIntMod: WeaponModData = {
  id: null,
  source: { book: 'COR', page: 260 },
  gearType: GearType.weaponMod,
  name: 'Smart Gun Int.',
  type: 'Weapon Mod',
  cost: 500,

  slot: null,
  removable: false,

  wirelessBonus: {
    enabled: true,
    description:
      'You gain a +1 dice pool bonus. Gain a bonus Minor Action on a turn when ' +
      'you use the Reload Smartgun or Change Device Mode actions to eject a ' +
      'clip or change fire mode.',
  },
}

addGear<WeaponData>({
  id: null,
  source: { book: 'COR', page: 254 },
  gearType: GearType.weapon,
  name: 'FN P93 Predator',
  type: 'Submachine Gun',
  avail: { rarity: 4, license: true },
  cost: 925,

  attributes: {
    [WeaponAttr.dv]: '4P',
    [WeaponAttr.modes]: 'SA/BF/FA',
    [WeaponAttr.attackRatings]: '9/12/7/-/-',
    [WeaponAttr.ammo]: '50(c)',
  },

  specialtySkill: ActiveSkillId.firearms,
  specialtyName: 'automatics',
}, [
  addGear<WeaponModData>({
    id: null,
    source: { book: 'COR', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Rigid Stock',
    type: 'Weapon Mod',

    slot: null,
    removable: false,
  }),
  addGear<WeaponModData>({
    id: null,
    source: { book: 'COR', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Laser sight',
    type: 'Weapon Mod',

    slot: WeaponModSlot.topOrUnder,
  }),
  addGear<WeaponModData>({
    id: null,
    source: { book: 'COR', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Flashlight',
    type: 'Weapon Mod',

    slot: null,
    removable: false,
  }),
  addGear(smartGunIntMod),
  addGear<WeaponModData>({
    id: null,
    source: { book: 'COR', page: 259 },
    gearType: GearType.weaponMod,
    name: 'Gas Vent',
    type: 'Weapon Mod',
    avail: { rarity: 3 },
    cost: 500,

    description: 'Removes the attack rating penalty for Semi-Automatic fire, and reduces it to 2 for Burst Fire',

    slot: WeaponModSlot.barrel,
    removable: false,
  }),
])

addGear<WeaponData>({
  id: null,
  source: { book: 'COR', page: 255 },
  gearType: GearType.weapon,
  name: 'Ares Viper Silvergun',
  type: 'Heavy Pistol',
  avail: { rarity: 4, license: true },
  cost: 610,

  attributes: {
    [WeaponAttr.dv]: '4P(f)',
    [WeaponAttr.modes]: 'SA/BF',
    [WeaponAttr.attackRatings]: '12/8/6/-/-',
    [WeaponAttr.ammo]: '30(c)',
  },

  specialtySkill: ActiveSkillId.firearms,
  specialtyName: 'pistols',
}, [
  addGear(smartGunIntMod),
  addGear({
    id: null,
    source: { book: 'COR', page: 260 },
    gearType: GearType.weaponMod,
    name: 'Quick Draw Holster',
    type: 'Weapon Mod',
    avail: { rarity: 2 },
    cost: 175,

    description: 'Use of a Quick-Draw holster provides a bonus Minor action when the Quick-Draw Action is taken',
  }),
])

addGear<AugmentData>({
  id: null,
  name: 'Synaptic Booster',
  type: 'Cultured Bioware Augment',
  gearType: GearType.augment,
  source: { book: 'COR', page: 293 },
  avail: { rarity: 4, license: true },
  cost: 47_500,

  description: (`
    The nerve cells making up the spinal cord are both broadened and replicated 
    with this bioware, allowing for neural bandwidth. The result is a much faster 
    reaction time. The booster confers a bonus of +1 Reaction (and the accompanying 
    adjustment to Initiative Score), 1 additional Initiative Die, and 1 additional
    Minor Action per point of Rating. The synaptic booster cannot be combined with 
    any other form of Reaction or Initiative enhancement. Unlike other enhancements,
    this cannot be turned off, leaving the use in a perpetual state of being in
    surrounded by slow motion.  
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 1,
  },

  essenceCost: 0.55,
  augmentSlot: AugmentSlot.bioware,

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.reaction, bonus: 1 },
    { type: EffectType.initBonus, bonus: 1 },
  ],
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Platelet Factories',
  type: 'Bioware Augment',
  source: { book: 'COR', page: 292 },
  avail: { rarity: 3 },
  cost: 8_500,

  description: (`
    Any time you would take 2 or more boxes of damage to your Physical Condition 
    Monitor, reduce the damage by 1 box.
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 1,
  },

  essenceCost: 0.22,
  augmentSlot: AugmentSlot.bioware,
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Muscle Toner',
  type: 'Bioware Augment',
  source: { book: 'COR', page: 292 },
  avail: { rarity: 3, license: true },
  cost: 64_000,

  description: (`
    Muscle Toner adds it's rating to your Agility attribute. This bioware is incompatible
    with augmentations that increase Agility, including the muscle replacement cyberware
    and enhanced articulations bioware
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 4,
  },

  essenceCost: 0.88,
  augmentSlot: AugmentSlot.bioware,

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.agility, bonus: 4 },
  ],
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Cybereyes',
  type: 'Augment',
  source: { book: 'COR', page: 285 },
  avail: { rarity: 2 },
  cost: 5_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 4,
    [AugmentAttr.capacity]: 12,
  },

  essenceCost: 0.44,
  augmentSlot: AugmentSlot.eyeware,
}, [
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Smartlink',
    type: 'Cybereye Augment',
    source: { book: 'COR', page: 285 },
    avail: { rarity: 2, license: true },
    cost: 2_000,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.used,
      [AugmentAttr.capacityCost]: 3,
    },

    essenceCost: 0.22,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Imagelink',
    type: 'Cybereye Augment',
    source: { book: 'COR', page: 285 },
    avail: { rarity: 1 },
    cost: 750,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.used,
    },

    essenceCost: 0.11,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Flare Compensation',
    type: 'Cybereye Augment',
    source: { book: 'COR', page: 285 },
    avail: { rarity: 1 },
    cost: 500,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.used,
      [AugmentAttr.capacityCost]: 1,
    },

    essenceCost: 0.11,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Low-Light Vision',
    type: 'Cybereye Augment',
    source: { book: 'COR', page: 285 },
    avail: { rarity: 1 },
    cost: 750,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.used,
      [AugmentAttr.capacityCost]: 2,
    },

    essenceCost: 0.11,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Thermographic Vision',
    type: 'Cybereye Augment',
    source: { book: 'COR', page: 285 },
    avail: { rarity: 1 },
    cost: 1_000,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.used,
      [AugmentAttr.capacityCost]: 2,
    },

    essenceCost: 0.11,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Vision Enhancement',
    type: 'Cybereye Augment',
    source: { book: 'COR', page: 285 },
    avail: { rarity: 2 },
    cost: 2_000,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.used,
      [AugmentAttr.capacityCost]: 2,
    },

    essenceCost: 0.11,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Vision Magnification',
    type: 'Cybereye Augment',
    source: { book: 'COR', page: 285 },
    avail: { rarity: 2 },
    cost: 1_000,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.used,
      [AugmentAttr.capacityCost]: 2,
    },

    essenceCost: 0.11,
    augmentSlot: AugmentSlot.eyeware,
  }),
])

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Reflex Recorder (Firearms)',
  type: 'Cultured Bioware Augment',
  source: { book: 'COR', page: 293 },
  avail: { rarity: 4 },
  cost: 7_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
  },

  essenceCost: 0.11,
  augmentSlot: AugmentSlot.bioware,

  enabled: true,
  effects: [
    { type: EffectType.skillBonus, skill: ActiveSkillId.firearms, bonus: 1 },
  ],
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Reflex Recorder (Stealth)',
  type: 'Cultured Bioware Augment',
  source: { book: 'COR', page: 293 },
  avail: { rarity: 4 },
  cost: 7_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
  },

  essenceCost: 0.11,
  augmentSlot: AugmentSlot.bioware,

  enabled: true,
  effects: [
    { type: EffectType.skillBonus, skill: ActiveSkillId.stealth, bonus: 1 },
  ],
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Commlink',
  type: 'Headware Augment',
  source: { book: 'COR', page: 283 },
  avail: { rarity: 1 },
  cost: 1_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
  },

  essenceCost: 0.11,
  augmentSlot: AugmentSlot.headware,
}, [
  addGear({
    id: null,
    gearType: GearType.other,
    name: 'Transys Avalon',
    type: 'Commlink',
    source: { book: 'COR', page: 267 },
    avail: { rarity: 3 },
    cost: 8_000,

    attributes: {
      'commlink.deviceRating': 6,
      'commlink.attributes': '3/1',
      'commlink.programSlots': 3,
    },

    essenceCost: 0.11,
    augmentSlot: AugmentSlot.bioware,

    enabled: true,
    effects: [
      { type: EffectType.skillBonus, skill: ActiveSkillId.stealth, bonus: 1 },
    ],
  }),
])

addGear({
  id: null,
  gearType: GearType.armor,
  name: 'Armor Jacket',
  type: 'Armor',
  source: { book: 'COR', page: 265 },
  avail: { rarity: 2 },
  cost: 1_000,

  attributes: {
    'armor.defenseBonus': 4,
    'armor.capacity': 8,
  },
})
