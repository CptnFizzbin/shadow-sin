import { nextRecordId } from '../Api/Model'
import { AwakenedType } from '../Character/AwakenedType'
import { Character } from '../Character/Character'
import { CharacterAttr } from '../Character/CharacterAttr'
import { CharacterPoolTypes } from '../Character/CharacterPoolTypes'
import { Metatype } from '../Character/Metatypes'
import { ArmorAttr } from '../Gear/Armor/ArmorAttr'
import { ArmorData } from '../Gear/Armor/ArmorData'
import { AugmentAttr } from '../Gear/Augments/AugmentAttr'
import { AugmentData, AugmentGrade, AugmentSlot } from '../Gear/Augments/AugmentData'
import { CommlinkAttr } from '../Gear/Commlink/CommlinkAttr'
import { EffectType } from '../Gear/Effect'
import { GearData, GearType } from '../Gear/GearData'
import { KitAttr } from '../Gear/Kit/KitAttr'
import { KitType } from '../Gear/Kit/KitType'
import { LicenseAttr } from '../Gear/License/LicenseAttr'
import { SinAttr } from '../Gear/License/SinAttr'
import { SinData } from '../Gear/License/SinData'
import { OtherGearAttr, OtherGearData } from '../Gear/OtherGearData'
import { VehicleAttr } from '../Gear/Vehicles/VehicleAttr'
import { VehicleData } from '../Gear/Vehicles/VehicleData'
import { ModType } from '../Gear/Vehicles/VehicleModData'
import { WeaponAttr } from '../Gear/Weapons/WeaponAttr'
import { WeaponData } from '../Gear/Weapons/WeaponData'
import { WeaponModData, WeaponModSlot } from '../Gear/Weapons/WeaponModData'
import { ActiveSkillId, FirearmSpecialties } from '../System/Skill/ActiveSkill/ActiveSkillId'
import { SkillType } from '../System/Skill/SkillData'

export const Silicus: Character = {
  name: 'Silicus',
  id: 'fc7d8ad1-c25e-4c1b-8c13-0e795a449ef2',
  userId: 'affbd8b8-8c41-4e82-86b6-85d184a71318',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  data: {
    dataVersion: 3,

    bio: {
      name: 'Silicus',
      metatype: Metatype.Elf,
      awakened: AwakenedType.Mundane,
      gender: 'male',
      role: 'Street Samurai',
    },

    karma: [
      {
        id: nextRecordId(),
        date: '2021-10-17T16:00',
        value: 5,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-10-03T16:00',
        value: 3,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-09-19T16:00',
        value: 5,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-09-12',
        value: 2,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-08-29T16:05',
        value: -10,
        note: 'Buy reaction 1 -> 2',
      },
      {
        id: nextRecordId(),
        date: '2021-08-29T16:04',
        value: -25,
        note: 'Buy charisma 1 -> 3',
      },
      {
        id: nextRecordId(),
        date: '2021-08-29T16:03',
        value: -12,
        note: 'Buy Exceptional (Agility)',
      },
      {
        id: nextRecordId(),
        date: '2021-08-29T16:02',
        value: -3,
        note: 'Buy Analytical Mind',
      },
      {
        id: nextRecordId(),
        date: '2021-08-29T16:01',
        value: 10,
        note: 'Gain Bad Luck',
      },
      {
        id: nextRecordId(),
        date: '2021-08-29T16:00',
        value: 50,
        note: 'Character Creation',
      },
    ],

    nuyen: [
      {
        id: nextRecordId(),
        date: '2021-10-24T16:01',
        value: -500,
        note: 'Loan to Artemis',
      },
      {
        id: nextRecordId(),
        date: '2021-10-24T16:00',
        value: 2_050 + 75 + 500,
        note: 'Ranger Arms AA-16',
      },
      {
        id: nextRecordId(),
        date: '2021-10-17T16:00',
        value: 11_400,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-10-03T16:00',
        value: -30_000,
        note: 'Orthoskin',
      },
      {
        id: nextRecordId(),
        date: '2021-09-26T16:00',
        value: 10_166,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-09-25T13:45',
        value: 2 * 100,
        note: 'Medical Supplies',
      },
      {
        id: nextRecordId(),
        date: '2021-09-25T13:44',
        value: 8 * 500,
        note: 'Trauma Patch',
      },
      {
        id: nextRecordId(),
        date: '2021-09-19T16:00',
        value: 25_000,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-08-28T00:03',
        value: -9_000,
        note: '3 months lifestyle (middle)',
      },
      {
        id: nextRecordId(),
        date: '2021-08-28T00:02',
        value: -439_575,
        note: 'Char creation Gear',
      },
      {
        id: nextRecordId(),
        date: '2021-08-28T00:01',
        value: 450_000,
        note: 'Char creation',
      },
    ],

    lifestyle: {
      grade: 'middle',
      upkeep: 5_000,
      prepaid: 3,
    },

    attributes: {
      [CharacterAttr.body]: 4,
      [CharacterAttr.agility]: 8,
      [CharacterAttr.reaction]: 2,
      [CharacterAttr.strength]: 1,
      [CharacterAttr.willpower]: 1,
      [CharacterAttr.logic]: 5,
      [CharacterAttr.intuition]: 4,
      [CharacterAttr.charisma]: 3,
      [CharacterAttr.edge]: 4,
      [CharacterAttr.magic]: 0,
      [CharacterAttr.resonance]: 0,
      [CharacterAttr.essence]: 6,
    },

    contacts: [
      {
        name: 'Hunter Morgan',
        connection: 3,
        loyalty: 3,
        description: 'Researcher at Kamino Biotech',
      },
      {
        name: 'Johennes',
        connection: 3,
        loyalty: 3,
        description: 'Fence',
      },
      {
        name: 'Dr. Weber',
        connection: 3,
        loyalty: 3,
        description: 'Ripperdoc',
      },
    ],

    skills: [
      {
        type: SkillType.active,
        skillId: ActiveSkillId.biotech,
        rank: 5,
        attr: 'logic',
        altAttr: 'intuition',
        expertise: 'First Aid',
      },
      {
        type: SkillType.active,
        skillId: ActiveSkillId.firearms,
        rank: 6,
        attr: 'agility',
        speciality: FirearmSpecialties.submachineGuns,
      },
      {
        type: SkillType.active,
        skillId: ActiveSkillId.perception,
        rank: 3,
        attr: 'intuition',
        altAttr: 'logic',
      },
      {
        type: SkillType.active,
        skillId: ActiveSkillId.closeCombat,
        rank: 5,
        attr: 'agility',
      },
      {
        type: SkillType.language,
        name: 'English',
        rank: 'native',
      },
      {
        type: SkillType.knowledge,
        name: 'Law Enforcement Corps',
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
        name: 'Local Gangs',
      },
    ],

    gear: [],

    qualities: [
      {
        name: 'Analytical Mind',
        source: { book: 'CRB', page: 70 },
        gameEffect: 'Bonus edge when making Logic tests',
        cost: 3,
      },
      {
        name: 'Exceptional (Agility)',
        source: { book: 'CRB', page: 71 },
        gameEffect: 'Increase max of one Physical or Mental attribute by 1',
        cost: 12,
      },
      {
        name: 'Bad Luck',
        source: { book: 'CRB', page: 70 },
        gameEffect: 'Glitch on 2s',
        bonus: 10,
      },
    ],
  },
}

function addGear<T extends GearData = OtherGearData> (gear: T, attachedGear: GearData[] = []): T {
  gear = { ...gear, dataVersion: 1, id: nextRecordId() };

  (Silicus.data.gear as GearData[]).push(gear)
  attachedGear.forEach(item => item.attachedTo = gear.id)

  return gear
}

const smartGunIntMod: WeaponModData = {
  id: null,
  source: { book: 'CRB', page: 260 },
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
    effects: [
      { type: EffectType.dicePoolBonus, poolType: 'weapon.all', bonus: 1 },
    ],
  },
}

addGear<WeaponData>({
  id: null,
  source: { book: 'FSQ', page: 22 },
  gearType: GearType.weapon,
  name: 'Ranger Arms AA-16',
  type: 'Shotgun',
  avail: { rarity: 6, illegal: true },
  cost: 2_050,

  attributes: {
    [WeaponAttr.dv]: '5P',
    [WeaponAttr.modes]: 'SA/BF/FA',
    [WeaponAttr.attackRatings]: '5/11/7/-/-',
    [WeaponAttr.ammo]: '12(c)',
  },

  skill: ActiveSkillId.firearms,
  specialtyName: FirearmSpecialties.shotguns,
},[
  addGear({...smartGunIntMod, removable: false }),
  addGear({
    id: null,
    source: { book: 'FSQ', page: 22 },
    gearType: GearType.weaponMod,
    name: 'Foregrip',
    type: 'Weapon Mod',

    slot: null,
    removable: false,
  }),
  addGear({
    id: null,
    source: { book: 'FSQ', page: 71 },
    cost: 75,
    gearType: GearType.weaponMod,
    name: 'Detachable Drum Magazine',
    type: 'Weapon Mod',

    slot: WeaponModSlot.under,
  }),
  addGear<WeaponModData>({
    id: null,
    source: { book: 'CRB', page: 259 },
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
  source: { book: 'CRB', page: 254 },
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

  skill: ActiveSkillId.firearms,
  specialtyName: FirearmSpecialties.submachineGuns,
}, [
  addGear<WeaponModData>({
    id: null,
    source: { book: 'CRB', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Rigid Stock',
    type: 'Weapon Mod',

    slot: null,
    removable: false,
  }),
  addGear<WeaponModData>({
    id: null,
    source: { book: 'CRB', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Laser sight',
    type: 'Weapon Mod',

    slot: WeaponModSlot.topOrUnder,
  }),
  addGear<WeaponModData>({
    id: null,
    source: { book: 'CRB', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Flashlight',
    type: 'Weapon Mod',

    slot: null,
    removable: false,
  }),
  addGear(smartGunIntMod),
  addGear<WeaponModData>({
    id: null,
    source: { book: 'CRB', page: 259 },
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
  source: { book: 'CRB', page: 255 },
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

  skill: ActiveSkillId.firearms,
  specialtyName: FirearmSpecialties.heavyPistols,
}, [
  addGear(smartGunIntMod),
  addGear<WeaponModData>({
    id: null,
    source: { book: 'CRB', page: 260 },
    gearType: GearType.weaponMod,
    name: 'Quick Draw Holster',
    type: 'Weapon Mod',
    avail: { rarity: 2 },
    cost: 175,

    description: 'Use of a Quick-Draw holster provides a bonus Minor action when the Quick-Draw Action is taken',
    slot: null,
  }),
])

addGear<WeaponData>({
  id: null,
  source: { book: 'CRB', page: 255 },
  gearType: GearType.weapon,
  name: 'Defiance SuperShocker',
  type: 'Taser',
  avail: { rarity: 1 },
  cost: 340,

  attributes: {
    [WeaponAttr.dv]: '6S(e)',
    [WeaponAttr.modes]: 'SS',
    [WeaponAttr.attackRatings]: '10/6/-/-/-',
    [WeaponAttr.ammo]: '4(m)',
    [WeaponAttr.maxRange]: '20m',
  },

  skill: ActiveSkillId.firearms,
  specialtyName: FirearmSpecialties.trasers,
}, [
  addGear(smartGunIntMod),
])

addGear<WeaponData>({
  id: null,
  source: { book: 'CRB', page: 254 },
  gearType: GearType.weapon,
  name: 'Survival Knife',
  type: 'Blade',
  avail: { rarity: 2 },
  cost: 250,

  attributes: {
    [WeaponAttr.dv]: '3P',
    [WeaponAttr.modes]: 'SA/BF/FA',
    [WeaponAttr.attackRatings]: '8/2/-/-/-',
    [WeaponAttr.maxRange]: '20m',
  },

  skill: ActiveSkillId.closeCombat,
  specialtyName: 'Blades',
})

addGear<WeaponData>({
  id: null,
  source: { book: 'CRB', page: 254 },
  gearType: GearType.weapon,
  name: 'Shock Gloves',
  type: 'Other Melee',
  avail: { rarity: 4 },
  cost: 790,

  attributes: {
    [WeaponAttr.type]: 'Unarmed',
    [WeaponAttr.dv]: '4S(e)',
    [WeaponAttr.attackRatings]: '5/-/-/-/-',
  },

  skill: ActiveSkillId.closeCombat,
  specialtyName: 'Blades',
})

addGear<AugmentData>({
  id: null,
  name: 'Synaptic Booster',
  type: 'Cultured Bioware Augment',
  gearType: GearType.augment,
  source: { book: 'CRB', page: 293 },
  avail: { rarity: 4, license: true },
  cost: 142_500,

  description: (`
    The nerve cells making up the spinal cord are both broadened and replicated 
    with this bioware, allowing for neural bandwidth. The result is a much faster 
    reaction time. The booster confers a bonus of +1 Reaction (and the accompanying 
    adjustment to Initiative Score), 1 additional Initiative Die, and 1 additional
    Minor Action per point of Rating. The synaptic booster cannot be combined with 
    any other form of Reaction or Initiative enhancement. Unlike other enhancements,
    this cannot be turned off, leaving the user in a perpetual state of being in
    surrounded by slow motion.  
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 1.65,
    [AugmentAttr.slot]: AugmentSlot.bioware,
    [AugmentAttr.rating]: 3,
  },

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.reaction, bonus: 3 },
    { type: EffectType.initBonus, dice: 3 },
  ],
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Platelet Factories',
  type: 'Bioware Augment',
  source: { book: 'CRB', page: 292 },
  avail: { rarity: 3 },
  cost: 8_500,

  description: (`
    Any time you would take 2 or more boxes of damage to your Physical Condition 
    Monitor, reduce the damage by 1 box.
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 0.22,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Muscle Toner',
  type: 'Bioware Augment',
  source: { book: 'CRB', page: 292 },
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
    [AugmentAttr.essenceCost]: 0.88,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.agility, bonus: 4 },
  ],
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Bone Density',
  type: 'Bioware Augment',
  source: { book: 'CRB', page: 291 },
  avail: { rarity: 3, license: true },
  cost: 24_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.alpha,
    [AugmentAttr.rating]: 4,
    [AugmentAttr.essenceCost]: 0.48,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  description: (`
      Increases Body during damage resistance test by rating. 
      Melee damage: 3P, Atk. Rating: +2
  `),

  effects: [
    { type: EffectType.dicePoolBonus, poolType: CharacterPoolTypes.dmgResist, bonus: 4 },
    // Melee damage: 3P
    // Melee Atk. Rating: +2
  ],
})

addGear<AugmentData>({
  id: null,
  name: 'Pain Editor',
  type: 'Cultured Bioware Augment',
  gearType: GearType.augment,
  source: { book: 'CRB', page: 293 },
  avail: { rarity: 5, illegal: true },
  cost: 72_000,

  description: (`
    This cluster of specialized nervous tissue is designed to filter sensory stimuli.
    If the pain editor is active, this allows you to ignore all injury modifiers, 
    and you can even stay conscious when your stun condition monitor is completely 
    full. You feel no pain—you're blissfully, dangerously, recklessly unaware of
    the extent of the damage you've taken without either performing a self-examination
    (Observe in Detail action) or being informed by a biomonitor. While active, the
    pain editor increases your willpower by 1 and decreases your intuition by 1;
    additionally, all tactile Perception tests you make have their threshold increased
    by 1. 
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.beta,
    [AugmentAttr.essenceCost]: 0.21,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.willpower, bonus: 1 },
    { type: EffectType.attrBonus, attr: CharacterAttr.intuition, bonus: -1 },
  ],
})

addGear<AugmentData>({
  id: null,
  name: 'Orthoskin',
  type: 'Bioware Augment',
  gearType: GearType.augment,
  source: { book: 'CRB', page: 292 },
  avail: { rarity: 7, license: true },
  cost: 30_000,

  description: (`
    A web of biofibers in the skin provides the
    equivalent of personal armor while being virtually
    indistinguishable from natural skin. Orthoskin
    provides a bonus equal to its rating to your Defense
    Rating. Orthoskin cannot be combined with
    skin augmentations, including dermal plating. 
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.delta,
    [AugmentAttr.essenceCost]: 0.25,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  effects: [
    { type: EffectType.defRatingBonus, bonus: 2 },
  ],
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Reflex Recorder (Firearms)',
  type: 'Cultured Bioware Augment',
  source: { book: 'CRB', page: 293 },
  avail: { rarity: 4 },
  cost: 7_000,

  description: (`
    This system uses extra nervous tissue linked to
    specific areas of the body to improve muscle memory.
    The reflex recorder adds 1 to the rating of a
    skill linked to a Physical attribute. Multiple recorders
    may be taken for multiple skills, but you can’t
    implant two reflex recorders for the same skill.
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 0.11,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  enabled: true,
  effects: [
    { type: EffectType.skillBonus, skill: ActiveSkillId.firearms, bonus: 1 },
  ],
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Cerebral Booster',
  type: 'Cultured Bioware Augment',
  source: { book: 'CRB', page: 293 },
  avail: { rarity: 5 },
  cost: 47_250,

  description: (`
    The convolutions and gyri of your cerebrum
    are augmented and amplified with additional
    nervous tissue, improving overall brain function.
    Your cerebral booster increases your Logic attribute
    by its rating.
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 3,
    [AugmentAttr.essenceCost]: 0.66,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.logic, bonus: 3 },
  ],
})

addGear({
  id: null,
  gearType: GearType.other,
  name: 'Sony Emperor',
  type: 'Commlink',
  source: { book: 'CRB', page: 267 },
  avail: { rarity: 2 },
  cost: 700,

  attributes: {
    [CommlinkAttr.deviceRating]: 2,
    [CommlinkAttr.attributes]: '1/1',
    [CommlinkAttr.programSlots]: 1,
  },
})

addGear({
  id: null,
  gearType: GearType.other,
  name: 'Biomonitor',
  type: 'Biotech',
  source: { book: 'CRB', page: 281 },
  avail: { rarity: 2 },
  cost: 300,
})

addGear({
  id: null,
  gearType: GearType.other,
  name: 'Glasses',
  type: 'Clothing',
  source: { book: 'CRB', page: 285 },
  avail: { rarity: 2 },
  cost: 400,

  attributes: {
    [OtherGearAttr.capacity]: 4,
  },
}, [
  addGear({
    id: null,
    gearType: GearType.other,
    name: 'Smartlink',
    type: 'Visual Enhancement',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 2 },
    cost: 2_000,

    attributes: {
      [OtherGearAttr.capacityCost]: 2,
    },
  }),
  addGear({
    id: null,
    gearType: GearType.other,
    name: 'Imagelink',
    type: 'Visual Enhancement',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 1 },
    cost: 25,

    attributes: {
      [OtherGearAttr.capacityCost]: 1,
    },
  }),
  addGear({
    id: null,
    gearType: GearType.other,
    name: 'Thermographic Vision',
    type: 'Visual Enhancement',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 2 },
    cost: 500,

    attributes: {
      [OtherGearAttr.capacityCost]: 1,
    },
  }),
])

addGear<ArmorData>({
  id: null,
  gearType: GearType.armor,
  name: 'Armor Jacket',
  type: 'Armor',
  source: { book: 'CRB', page: 265 },
  avail: { rarity: 2 },
  cost: 1_000,

  attributes: {
    [ArmorAttr.defenseBonus]: 4,
    [ArmorAttr.capacity]: 8,
  },
})

addGear({
  id: null,
  gearType: GearType.armor,
  name: 'Auctioneer Business Clothes',
  type: 'Armor',
  source: { book: 'CRB', page: 265 },
  avail: { rarity: 2 },
  cost: 1_500,

  attributes: {
    'armor.defenseBonus': 2,
    'armor.capacity': 6,
  },
}, [
  addGear({
    id: null,
    gearType: GearType.armorMod,
    name: 'Concealed Hostler',
    type: 'Armor Mod',
    source: { book: 'CRB', page: 259 },

    wirelessBonus: {
      enabled: true,
      description: 'Increases cancellability threshold by 1',
    },
  }),
])

addGear({
  id: null,
  gearType: GearType.other,
  name: 'Medkit',
  type: 'Biotech',
  source: { book: 'CRB', page: 281 },
  avail: { rarity: 3 },
  cost: 1_500,

  attributes: {
    [KitAttr.medkitRating]: 6,
  },

  wirelessBonus: {
    enabled: true,
    description: (`
      The medkit provides a +1 dice pool modifier to healing tests
    `),
  },

  kit: KitType.medKit,
}, [
  addGear({
    id: null,
    gearType: GearType.other,
    name: 'Medkit Supplies',
    type: 'Supplies',
    source: { book: 'CRB', page: 273 },
    avail: { rarity: 1 },
    cost: 100,
    quantity: 5,
  }),
])

addGear({
  id: null,
  gearType: GearType.other,
  name: 'First Aid Kit',
  type: 'Kit',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 1 },
  cost: 500,

  kit: KitType.firstAid,
})

addGear({
  id: null,
  gearType: GearType.other,
  name: 'Trauma Patch',
  type: 'Slap Patch',
  source: { book: 'CRB', page: 282 },
  avail: { rarity: 3 },
  cost: 500,
  quantity: 10,
  description: (`
    If placed on a patient with Overflow Damage, the patient is automatically stabilized.
    These patches are always wireless, and connect to the matrix the moment they are applied.
  `),
})

addGear<VehicleData>({
  id: null,
  gearType: GearType.vehicle,
  name: 'Suzuki Mirage',
  type: 'Bike',
  cost: 12_000,
  avail: { rarity: 2 },
  source: { book: 'CRB', page: 295 },

  attributes: {
    [VehicleAttr.handling]: '2/6',
    [VehicleAttr.accel]: 29,
    [VehicleAttr.speedInterval]: 30,
    [VehicleAttr.topSpeed]: 260,
    [VehicleAttr.body]: 4,
    [VehicleAttr.armor]: 2,
    [VehicleAttr.pilot]: 1,
    [VehicleAttr.sensor]: 1,
    [VehicleAttr.seat]: 1,
  },

  pilotingSpeciality: 'Ground Craft',
})

addGear<VehicleData>({
  id: null,
  gearType: GearType.vehicle,
  name: 'Hyundai Shin-Hyung',
  type: 'Car',
  cost: 20_000,
  avail: { rarity: 2 },
  source: { book: 'CRB', page: 295 },

  attributes: {
    [VehicleAttr.handling]: '3/5',
    [VehicleAttr.accel]: 12,
    [VehicleAttr.speedInterval]: 25,
    [VehicleAttr.topSpeed]: 200,
    [VehicleAttr.body]: 7,
    [VehicleAttr.armor]: 1,
    [VehicleAttr.pilot]: 1,
    [VehicleAttr.sensor]: 1,
    [VehicleAttr.seat]: 3,
  },

  pilotingSpeciality: 'Ground Craft',
}, [
  addGear({
    id: null,
    gearType: GearType.vehicleMod,
    modType: ModType.riggerInterface,
    name: 'Rigger Interface',
    type: 'vehicle mod',
    avail: { rarity: 2, license: true },
    cost: 1_000,
  }),
])

addGear<SinData>({
  id: null,
  gearType: GearType.sin,
  name: 'Jake Ozbourne',
  type: 'Fake SIN',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 4, illegal: true },
  cost: 15_000,

  description: 'General use SIN',

  attributes: {
    [SinAttr.rating]: 6,
  },
}, [
  addGear({
    id: null,
    gearType: GearType.license,
    name: 'License: Concealed Carry',
    type: 'Fake License',
    source: { book: 'CRB', page: 273 },
    avail: { rarity: 4, illegal: true },
    cost: 1_000,

    attributes: {
      [LicenseAttr.rating]: 5,
    },
  }),
  addGear({
    id: null,
    gearType: GearType.license,
    name: 'License: Firearm Carry',
    type: 'Fake License',
    source: { book: 'CRB', page: 273 },
    avail: { rarity: 4, illegal: true },
    cost: 1_000,

    attributes: {
      [LicenseAttr.rating]: 5,
    },
  }),
  addGear({
    id: null,
    gearType: GearType.license,
    name: 'License: Ares Viper Silvergun',
    type: 'Fake License',
    source: { book: 'CRB', page: 273 },
    avail: { rarity: 4, illegal: true },
    cost: 1_000,

    attributes: {
      [LicenseAttr.rating]: 5,
    },
  }),
])

addGear<SinData>({
  id: null,
  gearType: GearType.sin,
  name: 'Picard DeLance',
  type: 'Fake SIN',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 4, illegal: true },
  cost: 10_000,

  description: 'Runner use SIN',

  attributes: {
    [SinAttr.rating]: 4,
  },
})
