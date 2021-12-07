import { AwakenedType } from '../Character/AwakenedType'
import { CharacterAttr } from '../Character/CharacterAttr'
import { CharacterData } from '../Character/CharacterData'
import { Metatype } from '../Character/Metatypes'
import { ArmorAttr } from '../Gear/Armor/ArmorAttr'
import { AugmentAttr } from '../Gear/Augments/AugmentAttr'
import { AugmentData, AugmentGrade, AugmentSlot } from '../Gear/Augments/AugmentData'
import { CommlinkAttr } from '../Gear/Commlink/CommlinkAttr'
import { GearType } from '../Gear/GearData'
import { OtherGearAttr } from '../Gear/OtherGearData'
import { VehicleAttr } from '../Gear/Vehicles/VehicleAttr'
import { VehicleData } from '../Gear/Vehicles/VehicleData'
import { WeaponPoolKeys } from '../Gear/Weapons/DicePools'
import { WeaponAttr } from '../Gear/Weapons/WeaponAttr'
import { WeaponModData, WeaponModSlot } from '../Gear/Weapons/WeaponModData'
import { EffectType } from '../System/Effect'
import { ActiveSkill, FirearmSpecialties } from '../System/Skill/ActiveSkill/ActiveSkillId'
import { SkillType } from '../System/Skill/SkillData'
import { Silicus } from './Silicus'

import { addGear } from '.'

export const Spike: CharacterData = {
  dataVersion: 3,

  bio: {
    name: 'Spike',
    metatype: Metatype.Elf,
    awakened: AwakenedType.Mundane,
    gender: 'male',
    role: 'Street Samurai',
  },

  karma: [
    {
      date: '2021-12-05',
      value: 27,
      note: 'Balance import',
    },
  ],

  nuyen: [
    {
      date: '2021-12-05',
      value: 13_066,
      note: 'Balance import',
    },
  ],

  lifestyle: {
    grade: 'low',
    upkeep: 2_000,
    prepaid: 1,
  },

  attributes: {
    [CharacterAttr.body]: 5,
    [CharacterAttr.agility]: 8,
    [CharacterAttr.reaction]: 5,
    [CharacterAttr.strength]: 1,
    [CharacterAttr.willpower]: 5,
    [CharacterAttr.logic]: 1,
    [CharacterAttr.intuition]: 5,
    [CharacterAttr.charisma]: 4,
    [CharacterAttr.edge]: 5,
    [CharacterAttr.magic]: 0,
    [CharacterAttr.resonance]: 0,
    [CharacterAttr.essence]: 6,
  },

  contacts: [
    {
      name: 'Roy',
      connection: 4,
      loyalty: 4,
      description: 'Weapons Dealer',
    },
    {
      name: 'Jackie',
      connection: 4,
      loyalty: 4,
      description: 'Mobster',
    },
    {
      name: 'Michi',
      connection: 4,
      loyalty: 4,
      description: 'Ripper Doc',
    },
  ],

  skills: [
    {
      type: SkillType.active,
      name: ActiveSkill.firearms,
      rank: 7,
      attr: 'agility',
      speciality: FirearmSpecialties.submachineGuns,
    },
    {
      type: SkillType.active,
      name: ActiveSkill.stealth,
      rank: 3,
      attr: 'agility',
    },
    {
      type: SkillType.active,
      name: ActiveSkill.athletics,
      rank: 4,
      attr: 'agility',
    },
    {
      type: SkillType.active,
      name: ActiveSkill.piloting,
      rank: 1,
      attr: 'reaction',
    },
    {
      type: SkillType.active,
      name: ActiveSkill.perception,
      rank: 4,
      attr: 'intuition',
    },
    {
      type: SkillType.active,
      name: ActiveSkill.con,
      rank: 2,
      attr: 'charisma',
    },

    {
      type: SkillType.language,
      name: 'English',
      rank: 'native',
    },
  ],

  qualities: [
    {
      name: 'Low Light Vision',
      source: { book: 'CRB', page: 72 },
      gameEffect: 'You can see clearly in any light level that is not total darkness.',
    },
    {
      name: 'Exceptional (Agility)',
      source: { book: 'CRB', page: 71 },
      gameEffect: 'Your maximum for Agility is 8',
      cost: 12,
    },
    {
      name: 'Aptitude (Firearms)',
      source: { book: 'CRB', page: 70 },
      gameEffect: 'Your firearms skill maximum is for Firearms is 10',
      cost: 12,
    },
    {
      name: 'High Pain Tolerance',
      source: { book: 'CRB', page: 72 },
      gameEffect: 'When wounded, reduce your wound penalty by 1 (to a minimum of 0)',
      effects: [{ type: EffectType.woundPenaltyReduction, value: 1 }],
      cost: 7,
    },
    {
      name: 'Catlike',
      source: { book: 'CRB', page: 71 },
      gameEffect: 'You gain a bonus edge on all tests for balance, falling, and landing safely.',
      cost: 12,
    },
    {
      name: 'Allergy (Sun, Moderate)',
      source: { book: 'CRB', page: 74 },
      gameEffect: `
        You can not spend or earn edge while exposed to Sunlight. You 
        experience -4 dice pool modifier to any test involving a Physical
        attribute while in Sunlight. 
      `,
      bonus: 14,
    },
    {
      name: 'Addiction (Deepweed, 1 Day)',
      source: { book: 'CRB', page: 74 },
      gameEffect: `
        You can not earn or spend edge while under the effects of withdrawal
        from Deepweed. When in withdrawal, take a penalty on all tests: -2 
        after 1 day, -4 after 3 days, and -6 after a week 
      `,
      bonus: 6,
    },
  ],

  gear: [],
}

addGear(Spike, {
  id: '2dd5ed6d-14aa-450b-b5f2-85e1d7ca5063',
  source: { book: 'CRB', page: 265 },
  gearType: GearType.armor,
  name: 'Chameleon Suit',
  type: 'Armor',
  avail: { rarity: 4, illegal: true },
  cost: 2_000,
  attributes: {
    [ArmorAttr.defenseBonus]: 2,
    [ArmorAttr.capacity]: 4,
  },
  description: `
    Available in all manner of styles, it offers good protection without 
    catching too much attention. But don’t think of wearing one to a 
    social event or government building.
  `,
  wirelessBonus: {
    enabled: true,
    description: 'Raises defense rating by 2 thanks to improved hiding ability',
    effects: [
      { type: EffectType.defRatingBonus, bonus: 2 },
    ],
  },
}, [
  addGear(Silicus, {
    attachedTo: '2dd5ed6d-14aa-450b-b5f2-85e1d7ca5063',
    id: '91aa36e4-a048-41c9-9652-3b84b99468e9',
    gearType: GearType.armorMod,
    name: 'Electricity Resistance',
    type: 'Armor Mod',
    source: { book: 'CRB', page: 266 },
    avail: { rarity: 3 },
    cost: 1_000,
    attributes: { 'Rating': 4, 'Uses': 4 },
    description: 'Cancels the Zapped status up to 4 times, then is worn away',
  }),
])

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
  },
  effects: [
    {
      wireless: true,
      name: 'Smart Gun',
      type: EffectType.dicePoolBonus,
      poolType: WeaponPoolKeys.basicAttack,
      bonus: 1,
    },
  ],
}

addGear(Spike, {
  id: 'c64c19a8-ada0-4f4a-9bdd-df10da7ea1b2',
  gearType: GearType.weapon,
  name: 'Ruger 101',
  type: 'Rifle',
  source: { book: 'CRB', page: 258 },
  avail: { rarity: 2, license: true },
  cost: 11_100,
  attributes: {
    [WeaponAttr.dv]: '5P',
    [WeaponAttr.attackRatings]: '2/6/10/12/11',
    [WeaponAttr.modes]: 'SA',
    [WeaponAttr.ammo]: '8(m)',
  },
  skill: ActiveSkill.firearms,
  specialtyName: FirearmSpecialties.rifles,
}, [
  addGear(Silicus, {
    ...smartGunIntMod,
    id: '5c6a5325-1f21-435e-b39d-559b8d7367ba',
  }),
  addGear(Silicus, {
    id: 'ff521abf-4f69-43bc-8842-42c70fa57677',
    gearType: GearType.weaponMod,
    name: 'Rigid Stock with shock pad',
    type: 'Weapon Mod',
    slot: WeaponModSlot.under,
  }),
  addGear(Silicus, {
    id: '604f8e10-23ee-49c0-9e03-47129f56f984',
    gearType: GearType.weaponMod,
    name: 'Imaging Scope',
    type: 'Weapon Mod',
    slot: WeaponModSlot.top,
    removable: true,
  }),
])

addGear(Spike, {
  id: 'fe479daa-c729-41d5-9b25-e8d60c375a86',
  gearType: GearType.weapon,
  name: 'Ares Desert Strike',
  type: 'Rifle',
  source: { book: 'CRB', page: 258 },
  avail: { rarity: 4, illegal: true },
  cost: 11_000,
  attributes: {
    [WeaponAttr.dv]: '5P',
    [WeaponAttr.attackRatings]: '3/10/10/10/10',
    [WeaponAttr.modes]: 'SA/BF/FA',
    [WeaponAttr.ammo]: '14(c)',
  },
  skill: ActiveSkill.firearms,
  specialtyName: FirearmSpecialties.rifles,
}, [
  addGear(Silicus, {
    ...smartGunIntMod,
    id: '34253074-4c73-4e12-9434-856d363a394c',
  }),
  addGear(Silicus, {
    id: 'd3f6211d-9057-498b-8c52-9f137a63a248',
    gearType: GearType.weaponMod,
    name: 'Rigid Stock with shock pad',
    type: 'Weapon Mod',
    slot: WeaponModSlot.under,
  }),
  addGear(Silicus, {
    id: '71e863dc-c0e8-4b71-b0a4-69ce58e5e4d1',
    gearType: GearType.weaponMod,
    name: 'Imaging Scope',
    type: 'Weapon Mod',
    slot: WeaponModSlot.top,
    removable: true,
  }),
])

addGear(Spike, {
  id: 'fb5d82be-83eb-4cab-afaf-2cabbcd4dabd',
  gearType: GearType.weapon,
  name: 'Ingram Smartgun XI',
  type: 'Submachine Gun',
  source: { book: 'CRB', page: 255 },
  avail: { rarity: 3, license: true },
  cost: 750,
  attributes: {
    [WeaponAttr.dv]: '3P',
    [WeaponAttr.attackRatings]: '11/9/6/-/-',
    [WeaponAttr.modes]: 'SA/BF',
    [WeaponAttr.ammo]: '32(c)',
  },
  skill: ActiveSkill.firearms,
  specialtyName: FirearmSpecialties.submachineGuns,
}, [
  addGear(Silicus, {
    ...smartGunIntMod,
    id: '3443bc88-c268-4b39-940e-d3c4adf1bfe9',
  }),
  addGear(Silicus, {
    id: 'a746b9e4-8076-4ca9-9ee9-bb6f6bea0e15',
    gearType: GearType.weaponMod,
    name: 'Gas Vent System',
    type: 'Weapon Mod',
    slot: WeaponModSlot.barrel,
    removable: false,
  }),
  addGear(Silicus, {
    id: 'f47ecf4d-36bc-4a16-8abb-7006dcfc1461',
    gearType: GearType.weaponMod,
    name: 'Silencer',
    type: 'Weapon Mod',
    slot: WeaponModSlot.barrel,
    removable: false,
  }),
])

addGear(Spike, {
  id: 'c0985b9f-2e82-4e7e-9038-4e4bae5bda14',
  gearType: GearType.weapon,
  name: 'Fichetti Security 600',
  type: 'Light Pistol',
  source: { book: 'CRB', page: 255 },
  avail: { rarity: 3, license: true },
  cost: 390,
  attributes: {
    [WeaponAttr.dv]: '2P',
    [WeaponAttr.attackRatings]: '10/9/6/-/-',
    [WeaponAttr.modes]: 'SA',
    [WeaponAttr.ammo]: '30(c)',
  },
  skill: ActiveSkill.firearms,
  specialtyName: FirearmSpecialties.lightPistols,
}, [
  addGear(Silicus, {
    ...smartGunIntMod,
    id: '9d32fd3a-25ed-4954-9d69-e27f6f153830',
  }),
  addGear(Silicus, {
    id: '1a8c4cb4-f56c-41df-9884-36373fbf698f',
    gearType: GearType.weaponMod,
    name: 'Folding Stock',
    type: 'Weapon Mod',
    slot: WeaponModSlot.under,
  }),
  addGear(Silicus, {
    id: '5001b8fc-817f-41fc-afee-118e39a0bbea',
    gearType: GearType.weaponMod,
    name: 'Laser Sight',
    type: 'Weapon Mod',
    slot: WeaponModSlot.barrel,
  }),
])

addGear<AugmentData>(Spike, {
  id: '4e9b405a-34c3-4048-b2dc-292136759017',
  gearType: GearType.augment,
  name: 'Muscle Replacement',
  type: 'Bodyware Augment',
  source: { book: 'CRB', page: 287 },
  avail: { rarity: 3, license: true },
  cost: 60_000,
  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 3,
    [AugmentAttr.essenceCost]: 2.31,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },
  description: `
    Vat-grown synthetic muscles replace or augment your own, and calcium 
    treatments and skeletal reinforcement contribute to your overall strength. 
    It increases both your Strength and Agility attributes by its rating. It
    cannot be combined with other augmentations to the muscles, including muscle
    augmentation or muscle toner bioware
  `,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.strength, bonus: 3 },
    { type: EffectType.attrBonus, attr: CharacterAttr.agility, bonus: 3 },
  ],
})

addGear<AugmentData>(Spike, {
  id: 'e3f46b05-c6a8-4bbc-9044-2dd98695d332',
  gearType: GearType.augment,
  name: 'Wired Reflexes',
  type: 'Bodyware Augment',
  source: { book: 'CRB', page: 287 },
  avail: { rarity: 3, license: true },
  cost: 60_000,
  attributes: {
    [AugmentAttr.grade]: AugmentGrade.standard,
    [AugmentAttr.rating]: 2,
    [AugmentAttr.essenceCost]: 2.0,
    [AugmentAttr.slot]: AugmentSlot.bodyware,
  },
  enabled: true,
  description: `
    This highly invasive, painful, life-changing operation adds a multitude of 
    neural boosters and adrenaline stimulators in strategic locations throughout 
    your body to catapult you into a whole new world where everything around you 
    seems to move in slow motion. The system includes both manual and wireless 
    triggers to turn the wired reflexes on and off; activating or deactivating 
    the trigger manually requires a Major Action, while doing so wirelessly is a
    Minor Action. When activated, each rating point of wired reflexes gives you
    +1 Reaction (with accompanying bonus to your Initiative Score) and 1 
    additional Initiative Die (with accompanying Minor Action). Wired reflexes 
    are incompatible with augmentations that affect Reaction or Initiative
  `,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.reaction, bonus: 2 },
    { type: EffectType.initBonus, bonus: 2 },
  ],
  wirelessBonus: {
    enabled: true,
    description: `
      The system is compatible with wireless reaction enhancers, and activation
      or deactivation requires a minor action
    `,
  },
})

addGear<AugmentData>(Spike, {
  id: 'eb203072-4a18-4866-b6ec-04c3769396f8',
  gearType: GearType.augment,
  name: 'Orthoskin',
  type: 'Bioware Augment',
  source: { book: 'CRB', page: 292 },
  avail: { rarity: 7, license: true },
  cost: 15_000,
  attributes: {
    [AugmentAttr.grade]: AugmentGrade.delta,
    [AugmentAttr.rating]: 1,
    [AugmentAttr.essenceCost]: 0.125,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },
  description: `
    A web of biofibers in the skin provides the equivalent of personal armor 
    while being virtually indistinguishable from natural skin. Orthoskin 
    provides a bonus equal to its rating to your Defense Rating. Orthoskin 
    cannot be combined with skin augmentations, including dermal plating.
  `,
  effects: [
    { type: EffectType.defRatingBonus, bonus: 1 },
  ],
})

addGear<AugmentData>(Spike, {
  id: 'deeb37c3-beee-4cf7-ab69-7dd75aad52ad',
  gearType: GearType.augment,
  name: 'Symbiotes',
  type: 'Bioware Augment',
  source: { book: 'CRB', page: 292 },
  avail: { rarity: 4 },
  cost: 17_500,
  attributes: {
    [AugmentAttr.grade]: AugmentGrade.delta,
    [AugmentAttr.rating]: 2,
    [AugmentAttr.essenceCost]: 0.2,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },
  description: `
    Tailored micro-organisms in your bloodstream greatly enhance your healing. 
    Add the rating of the symbiotes as a dice pool modifier on healing tests 
    (Physical and Stun). However, the symbiotes have unusual dietary 
    requirements that must be met to keep them alive. You need to pay (Rating x 
    200) nuyen per month for special symbiote food, although if you have a High 
    Lifestyle or better, it’s covered. If they are not fed, they die in a month.
  `,
})

addGear<VehicleData>(Spike, {
  id: 'c455159b-cc52-4cf6-af44-3b25f7ad349b',
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

addGear(Spike, {
  id: '35828ade-2256-401b-b99a-cf6c4d4b0712',
  source: { book: 'CRB', page: 267 },
  gearType: GearType.other,
  name: 'Renraku Sensei',
  type: 'Commlink',
  avail: { rarity: 2 },
  cost: 1_000,
  attributes: {
    [CommlinkAttr.deviceRating]: 3,
    [CommlinkAttr.attributes]: '2/0',
    [CommlinkAttr.programSlots]: 1,
  },
})

addGear(Spike, {
  id: 'b08ecea5-1373-4f6e-9ad0-4e37a2625505',
  gearType: GearType.other,
  name: 'Glasses',
  type: 'Clothing',
  source: { book: 'CRB', page: 285 },
  avail: { rarity: 2 },
  cost: 300,

  attributes: {
    [OtherGearAttr.capacity]: 3,
  },
}, [
  addGear(Spike, {
    id: 'b7163b5c-a354-49f2-b776-82f66871d1a4',
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
  addGear(Spike, {
    id: 'ec45ddcb-fd6a-4752-a9f0-57aacd8bb8cd',
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
])
