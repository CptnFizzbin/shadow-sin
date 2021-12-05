import {nextRecordId} from '../Api/Model'
import {AwakenedType} from '../Character/AwakenedType'
import {Character} from '../Character/Character'
import {CharacterAttr} from '../Character/CharacterAttr'
import {Metatype} from '../Character/Metatypes'
import {ArmorAttr} from '../Gear/Armor/ArmorAttr'
import {AugmentAttr} from '../Gear/Augments/AugmentAttr'
import {AugmentData, AugmentGrade, AugmentSlot} from '../Gear/Augments/AugmentData'
import {CommlinkAttr} from '../Gear/Commlink/CommlinkAttr'
import {GearData, GearType} from '../Gear/GearData'
import {OtherGearAttr, OtherGearData} from '../Gear/OtherGearData'
import {VehicleAttr} from '../Gear/Vehicles/VehicleAttr'
import {VehicleData} from '../Gear/Vehicles/VehicleData'
import {WeaponAttr} from '../Gear/Weapons/WeaponAttr'
import {WeaponModData, WeaponModSlot} from '../Gear/Weapons/WeaponModData'
import {EffectType} from '../System/Effect'
import {ActiveSkill, FirearmSpecialties} from '../System/Skill/ActiveSkill/ActiveSkillId'
import {SkillType} from '../System/Skill/SkillData'

export const Spike: Character = {
  name: 'Spike',
  id: 'a685e270-540b-4fac-a76e-2b30da7bf7c2',
  userId: 'affbd8b8-8c41-4e82-86b6-85d184a71318',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  data: {
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
        id: nextRecordId(),
        date: '2021-12-05',
        value: 27,
        note: 'Balance import',
      },
    ],

    nuyen: [
      {
        id: nextRecordId(),
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
      [CharacterAttr.agility]: 11,
      [CharacterAttr.reaction]: 7,
      [CharacterAttr.strength]: 4,
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
        source: {book: 'CRB', page: 72},
        gameEffect: `
          You can see clearly in any light level that is not total darkness.
        `,
        cost: 0,
      },
      {
        name: 'Exceptional (Agility)',
        source: {book: 'CRB', page: 71},
        gameEffect: 'Your maximum for Agility is 9',
        cost: 12,
      },
      {
        name: 'Aptitude (Firearms)',
        source: {book: 'CRB', page: 70},
        gameEffect: 'Your firearms skill maximum is for Firearms is 10',
        cost: 12,
      },
      {
        name: 'High Pain Tolerance',
        source: {book: 'CRB', page: 72},
        gameEffect: 'When wounded, reduce your wound penalty by 1 (to a minimum of 0)',
        effects: [{type: EffectType.woundPenaltyReduction, value: 1}],
        cost: 7,
      },
      {
        name: 'Catlike',
        source: {book: 'CRB', page: 71},
        gameEffect: 'You gain a bonus edge on all tests for balance, falling, and landing safely.',
        cost: 12,
      },
      {
        name: 'Allergy (Sun, Moderate)',
        source: {book: 'CRB', page: 74},
        gameEffect: `
          You can not spend or earn edge while exposed to Sunlight. You 
          experience -4 dice pool modifier to any test involving a Physical
          attribute while in Sunlight. 
        `,
        bonus: 14,
      },
      {
        name: 'Addiction (Deepweed, 1 Day)',
        source: {book: 'CRB', page: 74},
        gameEffect: `
          You can not earn or spend edge while under the effects of withdrawal
          from Deepweed. When in withdrawal, take a penalty on all tests: -2 
          after 1 day, -4 after 3 days, and -6 after a week 
        `,
        bonus: 6,
      },
    ],

    gear: [],
  },
}

const usedIds = new Set()

export function addGear<T extends GearData = OtherGearData>(gear: T, attachedGear: GearData[] = []): T {
  gear = {...gear}

  if (gear.id === null) { throw new Error(`Null gear id for ${gear.name}`) }
  if (usedIds.has(gear.id)) { throw new Error(`Duplicate gear id for ${gear.name}`) }

  Spike.data.gear.push(gear)
  attachedGear.forEach(item => item.attachedTo = gear.id)
  usedIds.add(gear.id)

  return gear
}

addGear({
  id: '2dd5ed6d-14aa-450b-b5f2-85e1d7ca5063',
  source: {book: 'CRB', page: 265},
  gearType: GearType.armor,
  name: 'Chameleon Suit',
  type: 'Armor',
  avail: {rarity: 4, illegal: true},
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
      {type: EffectType.defRatingBonus, bonus: 2},
    ],
  },
}, [
  {
    attachedTo: '2dd5ed6d-14aa-450b-b5f2-85e1d7ca5063',
    id: nextRecordId(),
    gearType: GearType.armorMod,
    name: 'Electricity Resistance',
    type: 'Armor Mod',
    source: {book: 'CRB', page: 266},
    avail: {rarity: 3},
    cost: 1_000,
    attributes: {'Rating': 4, 'Uses': 4},
    description: 'Cancels the Zapped status up to 4 times, then is worn away',
  },
])

const smartGunIntMod: WeaponModData = {
  id: null,
  source: {book: 'CRB', page: 260},
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

addGear({
  id: nextRecordId(),
  gearType: GearType.weapon,
  name: 'Ruger 101',
  type: 'Rifle',
  source: {book: 'CRB', page: 258},
  avail: {rarity: 2, license: true},
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
  {...smartGunIntMod},
  {
    id: null,
    gearType: GearType.weaponMod,
    name: 'Rigid Stock with shock pad',
    type: 'Weapon Mod',
    slot: WeaponModSlot.under,
  },
  {
    id: null,
    gearType: GearType.weaponMod,
    name: 'Imaging Scope',
    type: 'Weapon Mod',
    slot: WeaponModSlot.top,
    removable: true,
  },
])

addGear({
  id: nextRecordId(),
  gearType: GearType.weapon,
  name: 'Ares Desert Strike',
  type: 'Rifle',
  source: {book: 'CRB', page: 258},
  avail: {rarity: 4, illegal: true},
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
  {...smartGunIntMod},
  {
    id: null,
    gearType: GearType.weaponMod,
    name: 'Rigid Stock with shock pad',
    type: 'Weapon Mod',
    slot: WeaponModSlot.under,
  },
  {
    id: null,
    gearType: GearType.weaponMod,
    name: 'Imaging Scope',
    type: 'Weapon Mod',
    slot: WeaponModSlot.top,
    removable: true,
  },
])

addGear({
  id: nextRecordId(),
  gearType: GearType.weapon,
  name: 'Ingram Smartgun XI',
  type: 'Submachine Gun',
  source: {book: 'CRB', page: 255},
  avail: {rarity: 3, license: true},
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
  {...smartGunIntMod},
  {
    id: null,
    gearType: GearType.weaponMod,
    name: 'Gas Vent System',
    type: 'Weapon Mod',
    slot: WeaponModSlot.barrel,
    removable: false,
  },
  {
    id: null,
    gearType: GearType.weaponMod,
    name: 'Silencer',
    type: 'Weapon Mod',
    slot: WeaponModSlot.barrel,
    removable: false,
  },
])

addGear({
  id: 'c0985b9f-2e82-4e7e-9038-4e4bae5bda14',
  gearType: GearType.weapon,
  name: 'Fichetti Security 600',
  type: 'Light Pistol',
  source: {book: 'CRB', page: 255},
  avail: {rarity: 3, license: true},
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
  {...smartGunIntMod},
  {
    id: null,
    gearType: GearType.weaponMod,
    name: 'Folding Stock',
    type: 'Weapon Mod',
    slot: WeaponModSlot.under,
  },
  {
    id: null,
    gearType: GearType.weaponMod,
    name: 'Laser Sight',
    type: 'Weapon Mod',
    slot: WeaponModSlot.barrel,
  },
])

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Muscle Replacement',
  type: 'Bodyware Augment',
  source: {book: 'CRB', page: 287},
  avail: {rarity: 3, license: true},
  cost: 60_000,
  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 4,
    [AugmentAttr.essenceCost]: 3.08,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Wired Reflexes',
  type: 'Bodyware Augment',
  source: {book: 'CRB', page: 287},
  avail: {rarity: 3, license: true},
  cost: 60_000,
  attributes: {
    [AugmentAttr.grade]: AugmentGrade.standard,
    [AugmentAttr.rating]: 2,
    [AugmentAttr.essenceCost]: 2.0,
    [AugmentAttr.slot]: AugmentSlot.bodyware,
  },
  wirelessBonus: {
    enabled: true,
    description: `
      The system is compatible with wireless reaction enhancers, and activation
      or deactivation requires a minor action
    `,
  },
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Orthoskin',
  type: 'Bioware Augment',
  source: {book: 'CRB', page: 292},
  avail: {rarity: 7, license: true},
  cost: 15_000,
  attributes: {
    [AugmentAttr.grade]: AugmentGrade.delta,
    [AugmentAttr.rating]: 1,
    [AugmentAttr.essenceCost]: 0.125,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },
  effects: [
    {type: EffectType.defRatingBonus, bonus: 1},
  ],
})


addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Symbiotes',
  type: 'Bioware Augment',
  source: {book: 'CRB', page: 292},
  avail: {rarity: 4},
  cost: 17_500,
  attributes: {
    [AugmentAttr.grade]: AugmentGrade.delta,
    [AugmentAttr.rating]: 2,
    [AugmentAttr.essenceCost]: 0.2,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },
  description: `
    Add the rating of the symbiotes as a dice pool modifier on healing tests
    (physical and stun). The symbiotes have unusual dietary requirements to keep
    them alive. You need to pay rating x 200¥ per month for special food. If
    you have high lifestyle or better, it's covered. If they are not fed, they 
    die in a month.
  `,
})

addGear<VehicleData>({
  id: null,
  gearType: GearType.vehicle,
  name: 'Suzuki Mirage',
  type: 'Bike',
  cost: 12_000,
  avail: {rarity: 2},
  source: {book: 'CRB', page: 295},

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

addGear({
  id: null,
  source: {book: 'CRB', page: 267},
  gearType: GearType.other,
  name: 'Renraku Sensei',
  type: 'Commlink',
  avail: {rarity: 2},
  cost: 1_000,
  attributes: {
    [CommlinkAttr.deviceRating]: 3,
    [CommlinkAttr.attributes]: '2/0',
    [CommlinkAttr.programSlots]: 1,
  },
})

addGear({
  id: null,
  gearType: GearType.other,
  name: 'Glasses',
  type: 'Clothing',
  source: {book: 'CRB', page: 285},
  avail: {rarity: 2},
  cost: 300,

  attributes: {
    [OtherGearAttr.capacity]: 3,
  },
}, [
  addGear({
    id: null,
    gearType: GearType.other,
    name: 'Smartlink',
    type: 'Visual Enhancement',
    source: {book: 'CRB', page: 275},
    avail: {rarity: 2},
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
    source: {book: 'CRB', page: 275},
    avail: {rarity: 1},
    cost: 25,

    attributes: {
      [OtherGearAttr.capacityCost]: 1,
    },
  }),
])
