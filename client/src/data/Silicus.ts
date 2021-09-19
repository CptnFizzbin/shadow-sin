import { nextRecordId } from '../Api/Model'
import { CharacterAttr } from '../Character/CharacterAttr'
import { CharacterData } from '../Character/CharacterData'
import { CharacterPoolTypes } from '../Character/CharacterPoolTypes'
import { ArmorAttr } from '../Gear/Armor/ArmorAttr'
import { ArmorData } from '../Gear/Armor/ArmorData'
import { AugmentAttr } from '../Gear/Augments/AugmentAttr'
import { AugmentData, AugmentGrade, AugmentSlot } from '../Gear/Augments/AugmentData'
import { CommlinkAttr } from '../Gear/Commlink/CommlinkAttr'
import { EffectType } from '../Gear/Effect'
import { GearData, GearType } from '../Gear/GearData'
import { KitAttr } from '../Gear/Kit/KitAttr'
import { KitType } from '../Gear/Kit/KitType'
import { SinAttr } from '../Gear/License/SinAttr'
import { SinData } from '../Gear/License/SinData'
import { OtherGearAttr, OtherGearData } from '../Gear/OtherGearData'
import { VehicleAttr } from '../Gear/Vehicles/VehicleAttr'
import { VehicleData } from '../Gear/Vehicles/VehicleData'
import { ModType } from '../Gear/Vehicles/VehicleModData'
import { WeaponAttr } from '../Gear/Weapons/WeaponAttr'
import { WeaponData } from '../Gear/Weapons/WeaponData'
import { WeaponModData, WeaponModSlot } from '../Gear/Weapons/WeaponModData'
import { ActiveSkillId } from '../System/Skill/ActiveSkill/ActiveSkillId'
import { SkillType } from '../System/Skill/SkillData'

export const Silicus: CharacterData = {
  id: 'fc7d8ad1-c25e-4c1b-8c13-0e795a449ef2',
  dataVersion: 3,

  bio: {
    name: 'Silicus',
    metaType: 'Elf',
    gender: 'male',
    role: 'Street Samurai',
  },

  karma: [
    {
      id: '06c06985-4024-45e3-9a73-a49375e0b095',
      date: '2021-09-12',
      value: 2,
      note: 'Session reward',
    },
  ],

  nuyen: [
    {
      id: 'bb9f128e-641a-4a71-a980-b46ae4358b32',
      date: '2021-08-28T00:03',
      value: -9_000,
      note: '3 months lifestyle (middle)',
    },
    {
      id: '737b40e5-9820-4382-98f5-2d564565ed4e',
      date: '2021-08-28T00:02',
      value: -439_575,
      note: 'Char creation Gear',
    },
    {
      id: '24b4f26a-0c8e-42d0-b8e9-49e668785783',
      date: '2021-08-28T00:01',
      value: 450_000,
      note: 'Char creation',
    },
  ],

  lifestyle: {
    grade: 'middle',
    upkeep: 3_000,
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
      speciality: 'Automatics',
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
      source: { book: 'COR', page: 70 },
      gameEffect: 'Bonus edge when making Logic tests',
      cost: 3,
    },
    {
      name: 'Exceptional (Agility)',
      source: { book: 'COR', page: 71 },
      gameEffect: 'Increase max of one Physical or Mental attribute by 1',
      cost: 12,
    },
  ],
}

function addGear<T extends GearData = OtherGearData> (gear: T, attachedGear: GearData[] = []): T {
  gear = { ...gear, dataVersion: 1, id: nextRecordId() };

  (Silicus.gear as GearData[]).push(gear)
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
    effects: [
      { type: EffectType.dicePoolBonus, poolType: 'weapon.all', bonus: 1 },
    ],
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
  addGear<WeaponModData>({
    id: null,
    source: { book: 'COR', page: 260 },
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
  source: { book: 'COR', page: 255 },
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
}, [
  addGear(smartGunIntMod),
])

addGear<WeaponData>({
  id: null,
  source: { book: 'COR', page: 254 },
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

  specialtySkill: ActiveSkillId.closeCombat,
  specialtyName: 'Blades',
})

addGear<AugmentData>({
  id: null,
  name: 'Synaptic Booster',
  type: 'Cultured Bioware Augment',
  gearType: GearType.augment,
  source: { book: 'COR', page: 293 },
  avail: { rarity: 4, license: true },
  cost: 142_500,

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
    [AugmentAttr.rating]: 3,
  },

  essenceCost: 1.65,
  augmentSlot: AugmentSlot.bioware,

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
  source: { book: 'COR', page: 292 },
  avail: { rarity: 3 },
  cost: 8_500,

  description: (`
    Any time you would take 2 or more boxes of damage to your Physical Condition 
    Monitor, reduce the damage by 1 box.
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
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
  name: 'Bone Density',
  type: 'Bioware Augment',
  source: { book: 'COR', page: 291 },
  avail: { rarity: 3, license: true },
  cost: 24_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.alpha,
    [AugmentAttr.rating]: 4,
  },

  description: (`
      Increases Body during damage resistance test by rating. 
      Melee damage: 3P, Atk. Rating: +2
  `),

  essenceCost: 0.48,
  augmentSlot: AugmentSlot.bioware,

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
  source: { book: 'COR', page: 293 },
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
  },

  essenceCost: 0.21,
  augmentSlot: AugmentSlot.bioware,

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.willpower, bonus: 1 },
    { type: EffectType.attrBonus, attr: CharacterAttr.intuition, bonus: -1 },
  ],
})

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
  name: 'Cerebral Booster',
  type: 'Cultured Bioware Augment',
  source: { book: 'COR', page: 293 },
  avail: { rarity: 5 },
  cost: 47_250,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 3,
  },

  essenceCost: 0.66,
  augmentSlot: AugmentSlot.bioware,

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
  source: { book: 'COR', page: 267 },
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
  source: { book: 'COR', page: 281 },
  avail: { rarity: 2 },
  cost: 300,
})

addGear({
  id: null,
  gearType: GearType.other,
  name: 'Glasses',
  type: 'Clothing',
  source: { book: 'COR', page: 285 },
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
    source: { book: 'COR', page: 275 },
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
    source: { book: 'COR', page: 275 },
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
    source: { book: 'COR', page: 275 },
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
  source: { book: 'COR', page: 265 },
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
  source: { book: 'COR', page: 265 },
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
    source: { book: 'COR', page: 259 },

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
  source: { book: 'COR', page: 281 },
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
    source: { book: 'COR', page: 273 },
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
  source: { book: 'COR', page: 273 },
  avail: { rarity: 1 },
  cost: 500,

  kit: KitType.firstAid,
})

addGear({
  id: null,
  gearType: GearType.other,
  name: 'Trauma Patch',
  type: 'Slap Patch',
  source: { book: 'COR', page: 282 },
  avail: { rarity: 3 },
  cost: 500,
  quantity: 2,
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
  source: { book: 'COR', page: 295 },

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
})

addGear<VehicleData>({
  id: null,
  gearType: GearType.vehicle,
  name: 'Hyundai Shin-Hyung',
  type: 'Car',
  cost: 20_000,
  avail: { rarity: 2 },
  source: { book: 'COR', page: 295 },

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
  source: { book: 'COR', page: 273 },
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
    source: { book: 'COR', page: 273 },
    avail: { rarity: 4, illegal: true },
    cost: 1_000,

    attributes: {
      'Rating': 5,
    },
  }),
  addGear({
    id: null,
    gearType: GearType.license,
    name: 'License: Firearm Carry',
    type: 'Fake License',
    source: { book: 'COR', page: 273 },
    avail: { rarity: 4, illegal: true },
    cost: 1_000,

    attributes: {
      'Rating': 5,
    },
  }),
  addGear({
    id: null,
    gearType: GearType.license,
    name: 'License: Ares Viper Silvergun',
    type: 'Fake License',
    source: { book: 'COR', page: 273 },
    avail: { rarity: 4, illegal: true },
    cost: 1_000,

    attributes: {
      'Rating': 5,
    },
  }),
])

addGear<SinData>({
  id: null,
  gearType: GearType.sin,
  name: 'Picard DeLance',
  type: 'Fake SIN',
  source: { book: 'COR', page: 273 },
  avail: { rarity: 4, illegal: true },
  cost: 10_000,

  description: 'Runner use SIN',

  attributes: {
    [SinAttr.rating]: 4,
  },
})
