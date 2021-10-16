import { nextRecordId } from '../Api/Model'
import { Character } from '../Character/Character'
import { CharacterAttr } from '../Character/CharacterAttr'
import { AugmentAttr } from '../Gear/Augments/AugmentAttr'
import { AugmentData, AugmentGrade, AugmentSlot, AugmentType } from '../Gear/Augments/AugmentData'
import { EffectType } from '../Gear/Effect'
import { GearData, GearType } from '../Gear/GearData'
import { LicenseData } from '../Gear/License/LicenseData'
import { SinAttr } from '../Gear/License/SinAttr'
import { SinData } from '../Gear/License/SinData'
import { OtherGearAttr, OtherGearData } from '../Gear/OtherGearData'
import { RccAttr } from '../Gear/Rcc/RccAttr'
import { RccData } from '../Gear/Rcc/RccData'
import { AutosoftAttr } from '../Gear/Software/Autosoft/AutosoftAttr'
import { AutosoftData } from '../Gear/Software/Autosoft/AutosoftData'
import { VehicleAttr } from '../Gear/Vehicles/VehicleAttr'
import { VehicleData } from '../Gear/Vehicles/VehicleData'
import { ModType, VehicleModData } from '../Gear/Vehicles/VehicleModData'
import { WeaponAttr } from '../Gear/Weapons/WeaponAttr'
import { WeaponData } from '../Gear/Weapons/WeaponData'
import { WeaponModData, WeaponModSlot } from '../Gear/Weapons/WeaponModData'
import { ActiveSkillId, FirearmSpecialties } from '../System/Skill/ActiveSkill/ActiveSkillId'
import { SkillType } from '../System/Skill/SkillData'

export const Artemis: Character = {
  name: 'Artemis',
  id: 'aebc2a1a-d12e-487e-aa5b-1f2daa18817a',
  userId: 'affbd8b8-8c41-4e82-86b6-85d184a71318',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  data: {
    dataVersion: 3,

    bio: {
      name: 'Jessica Nelson',
      alias: 'Artemis',
      role: 'rigger',
      gender: 'female',
      metatype: 'Elf',
    },

    karma: [
      {
        id: nextRecordId(),
        date: '2021-09-26T16:00',
        value: 4,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-09-19T22:00',
        value: -10,
        note: 'Body 1 => 2',
      },
      {
        id: nextRecordId(),
        date: '2021-09-19T16:00',
        value: 5,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-09-11',
        value: 2,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-08-28',
        value: 14,
        note: 'Balance import',
      },
    ],

    nuyen: [
      {
        id: nextRecordId(),
        date: '2021-09-26T16:00',
        value: 10_166,
        note: 'Session reward',
      },
      {
        id: nextRecordId(),
        date: '2021-09-26T15:02',
        value: 300,
        note: 'Buy forklift rental',
      },
      {
        id: nextRecordId(),
        date: '2021-09-26T15:01',
        value: 500,
        note: 'Buy Semi-truck rental',
      },
      {
        id: nextRecordId(),
        date: '2021-09-26T15:00',
        value: 1_000,
        note: 'Buy Semi-truck driver license',
      },
      {
        id: nextRecordId(),
        date: '2021-09-19T22:01',
        value: -16_000,
        note: 'Buy r4 sensor arrays for crawlers',
      },
      {
        id: nextRecordId(),
        date: '2021-09-19T22:00',
        value: -22_500,
        note: 'Buy Reaction Enhancers',
      },
      {
        id: nextRecordId(),
        date: '2021-09-19T16:00',
        value: 25_000,
        note: 'Session Reward',
      },
      {
        id: nextRecordId(),
        date: '2021-08-28T00:04',
        value: 18_070,
        note: 'Session Reward',
      },
      {
        id: nextRecordId(),
        date: '2021-08-28T00:03',
        value: -15_000,
        note: 'Lifestyle (3 months)',
      },
      {
        id: nextRecordId(),
        date: '2021-08-28T00:02',
        value: -431_665,
        note: 'Starting Gear',
      },
      {
        id: nextRecordId(),
        date: '2021-08-28T00:01',
        value: 450_000,
        note: 'Character Creation',
      },
    ],

    lifestyle: {
      grade: 'middle',
      upkeep: 5_000,
      prepaid: 3,
    },

    attributes: {
      [CharacterAttr.body]: 2,
      [CharacterAttr.agility]: 3,
      [CharacterAttr.reaction]: 3,
      [CharacterAttr.strength]: 1,
      [CharacterAttr.willpower]: 2,
      [CharacterAttr.logic]: 7,
      [CharacterAttr.intuition]: 5,
      [CharacterAttr.charisma]: 4,
      [CharacterAttr.edge]: 4,
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
        skillId: ActiveSkillId.electronics,
        rank: 3,
        attr: 'logic',
      },
      {
        type: SkillType.active,
        skillId: ActiveSkillId.firearms,
        rank: 3,
        attr: 'agility',
      },
      {
        type: SkillType.active,
        skillId: ActiveSkillId.piloting,
        rank: 6,
        attr: 'reaction',
        speciality: 'Ground Craft',
      },
      {
        type: SkillType.active,
        skillId: ActiveSkillId.engineering,
        rank: 7,
        attr: 'logic',
        altAttr: 'intuition',
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

    gear: [],

    qualities: [
      {
        name: 'Exceptional (Logic)',
        source: { book: 'CRB', page: 2 },
        cost: 12,
      },
      {
        name: 'Social Stress (Large Groups)',
        source: { book: 'CRB', page: 2 },
        bonus: 8,
      },
      {
        name: 'Juryrigger',
        source: { book: 'CRB', page: 2 },
        cost: 12,
      },
      {
        name: 'Photographic Memory',
        source: { book: 'CRB', page: 2 },
        cost: 12,
      },
      {
        name: 'Analytical Mind',
        source: { book: 'CRB', page: 2 },
        gameEffect: 'Bonus edge when making Logic tests',
        cost: 3,
      },
      {
        name: 'Ambidextrous',
        source: { book: 'CRB', page: 2 },
        cost: 4,
      },
    ],
  },
}

export function addGear<T extends GearData = OtherGearData> (gear: T, attachedGear: GearData[] = []): T {
  gear = { ...gear, dataVersion: 1, id: nextRecordId() };

  (Artemis.data.gear as GearData[]).push(gear)
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
  },
}

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Control Rig',
  type: 'Headwear Augment',
  avail: { rarity: 3, license: true },
  cost: 60_000,
  augmentSlot: AugmentSlot.headware,
  augmentType: AugmentType.controlRig,
  essenceCost: 2.2,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 2,
  },
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Cerebral Booster',
  type: 'Cultured Bioware Augment',
  avail: { rarity: 4 },
  cost: 47_250,
  augmentSlot: AugmentSlot.bioware,
  essenceCost: 0.66,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 3,
  },

  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.logic, bonus: 3 },
  ],
})

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Sleep Regulator',
  type: 'Cultured Bioware Augment',
  avail: { rarity: 4 },
  source: { book: 'CRB', page: 293 },
  cost: 6_000,
  augmentSlot: AugmentSlot.bioware,
  essenceCost: 0.11,

  description: (`
    You need less sleep per day, and the sleep you get is deep and restful (and harder
    to wake up from). The sleep regulator lets you get by with three hours of sleep
    each night, and you can stay awake for twice as long as normal without acquiring 
    the Fatigued status. Resting hours for healing purposes are not affected.
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
  },
})

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

    slot: WeaponModSlot.topOrUnder,
  }),
  addGear(smartGunIntMod),
])

addGear<WeaponData>({
  id: null,
  source: { book: 'CRB', page: 252 },
  gearType: GearType.weapon,
  name: 'Colt America L36',
  type: 'Light Pistol',
  avail: { rarity: 2, license: true },
  cost: 230,

  attributes: {
    [WeaponAttr.dv]: '2P',
    [WeaponAttr.modes]: 'SA',
    [WeaponAttr.attackRatings]: '8/8/6/-/-',
    [WeaponAttr.ammo]: '11(c)',
  },
  wirelessBonus: {
    enabled: true,
    description:
      'The user can alter ownership with a Minor Action',
  },

  skill: ActiveSkillId.firearms,
  specialtyName: FirearmSpecialties.lightPistols,
}, [
  addGear(smartGunIntMod),
])

const autosofts: AutosoftData[] = [
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'FN-HAR Targeting',
    type: 'Targeting Autosoft',
    avail: { rarity: 8 },
    cost: 4_000,

    attributes: {
      [AutosoftAttr.rating]: 8,
      [AutosoftAttr.weapon]: 'FN-HAR',
      [AutosoftAttr.attr]: 'Sensor',
    },
  }),
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'Clearsight',
    type: 'Autosoft',
    avail: { rarity: 8 },
    cost: 4_000,

    attributes: {
      [AutosoftAttr.rating]: 8,
      [AutosoftAttr.skill]: 'Perception',
      [AutosoftAttr.attr]: 'Sensor',
    },
  }),
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'Evasion',
    type: 'Autosoft',
    avail: { rarity: 8 },
    cost: 4_000,

    attributes: {
      [AutosoftAttr.rating]: 8,
      [AutosoftAttr.skill]: 'Evasion',
      [AutosoftAttr.attr]: 'Pilot',
    },
  }),
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'Maneuvering',
    type: 'Autosoft',
    avail: { rarity: 8 },
    cost: 4_000,

    attributes: {
      [AutosoftAttr.rating]: 8,
      [AutosoftAttr.skill]: 'Piloting',
      [AutosoftAttr.attr]: 'Pilot',
    },
  }),
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'Electronic Warfare',
    type: 'Autosoft',
    avail: { rarity: 8 },
    cost: 4_000,

    attributes: {
      [AutosoftAttr.rating]: 8,
      [AutosoftAttr.skill]: 'Cracking',
      [AutosoftAttr.attr]: 'Sensor',
    },
  }),
]

const rcc: RccData = addGear({
  id: null,
  gearType: GearType.rcc,
  name: 'Proteus Poseidon',
  type: 'RCC',
  avail: { rarity: 6, license: true },
  cost: 68_000,

  attributes: {
    [RccAttr.deviceRating]: 5,
    [RccAttr.dataProcessing]: 5,
    [RccAttr.firewall]: 5,
  },

  slavedAutosofts: [],
})

autosofts.forEach(soft => soft.attachedTo = rcc.id)
rcc.slavedAutosofts = autosofts.map(soft => soft.id)

const fnHar: WeaponData = {
  id: null,
  gearType: GearType.weapon,
  name: 'FN-HAR',
  type: 'Rifle',
  avail: { rarity: 3, license: true },
  cost: 2_100,
  attributes: {
    [WeaponAttr.dv]: '5P',
    [WeaponAttr.modes]: 'SA/BF/FA',
    [WeaponAttr.attackRatings]: '3/11/10/6/1',
    [WeaponAttr.ammo]: '35(c)',
  },

  skill: ActiveSkillId.firearms,
  specialtyName: FirearmSpecialties.rifles,
}

const stdWeaponMount: VehicleModData = {
  id: null,
  gearType: GearType.vehicleMod,
  modType: ModType.stdWeaponMount,
  name: 'Standard Weapon Mount',
  type: 'vehicle mod',
  avail: { rarity: 5, illegal: true },
  cost: 4_500,
}

const riggerInterface: VehicleModData = {
  id: null,
  gearType: GearType.vehicleMod,
  modType: ModType.riggerInterface,
  name: 'Rigger Interface',
  type: 'vehicle mod',
  avail: { rarity: 2, license: true },
  cost: 1_000,
}

const sensorArray: VehicleModData = {
  id: null,
  gearType: GearType.vehicleMod,
  name: 'Sensor Array',
  type: 'vehicle mod',
  avail: { rarity: 3 },
  cost: 4_000,

  attributes: {
    [OtherGearAttr.rating]: 4,
  },

  effects: [
    { type: EffectType.attrOverride, attr: VehicleAttr.sensor, value: 4 },
  ],
}

addGear<VehicleData>({
  id: null,
  gearType: GearType.vehicle,
  name: 'Range Rover Model 2080',
  type: 'Van',
  cost: 73_000,
  avail: { rarity: 2 },

  attributes: {
    [VehicleAttr.handling]: '4/5',
    [VehicleAttr.accel]: 12,
    [VehicleAttr.speedInterval]: 20,
    [VehicleAttr.topSpeed]: 160,
    [VehicleAttr.body]: 16,
    [VehicleAttr.armor]: 10,
    [VehicleAttr.pilot]: 4,
    [VehicleAttr.sensor]: 4,
    [VehicleAttr.seat]: 4,
  },

  slavedTo: rcc.id,
  pilotingSpeciality: 'Ground Craft',
}, [
  addGear(riggerInterface),
  rcc,
])

new Array(2).fill(null).forEach((_, index) => {
  addGear<VehicleData>({
    id: null,
    gearType: GearType.vehicle,
    type: 'Medium Rotor Drone',
    name: `MCT-Nissan Roto-drone ${index + 1}`,
    cost: 5_000,
    avail: { rarity: 2 },

    attributes: {
      [VehicleAttr.handling]: 3,
      [VehicleAttr.accel]: 20,
      [VehicleAttr.speedInterval]: 30,
      [VehicleAttr.topSpeed]: 160,
      [VehicleAttr.body]: 5,
      [VehicleAttr.armor]: 6,
      [VehicleAttr.pilot]: 3,
      [VehicleAttr.sensor]: 2,
      [VehicleAttr.seat]: null,
    },

    slavedTo: rcc.id,
    pilotingSpeciality: 'Aircraft',
  }, [
    addGear(stdWeaponMount, [
      addGear(fnHar),
    ]),
    addGear(riggerInterface),
    // addGear(sensorArray),
  ])
})

new Array(4).fill(null).forEach((_, index) => {
  addGear<VehicleData>({
    id: null,
    gearType: GearType.vehicle,
    name: `Aztech Crawler ${index + 1}`,
    type: 'Small Anthro Drone',
    cost: 4_500,
    avail: { rarity: 2 },

    attributes: {
      [VehicleAttr.handling]: '3/4',
      [VehicleAttr.accel]: 8,
      [VehicleAttr.speedInterval]: 10,
      [VehicleAttr.topSpeed]: 30,
      [VehicleAttr.body]: 6,
      [VehicleAttr.armor]: 2,
      [VehicleAttr.pilot]: 2,
      [VehicleAttr.sensor]: 2,
      [VehicleAttr.seat]: null,
    },

    slavedTo: rcc.id,
    pilotingSpeciality: 'Ground Craft',
  }, [
    addGear(stdWeaponMount, [
      addGear(fnHar),
    ]),
    addGear(riggerInterface),
    addGear(sensorArray),
  ])
})

new Array(1).fill(null).forEach((_, index) => {
  addGear<VehicleData>({
    id: null,
    gearType: GearType.vehicle,
    type: 'Small Rotor Drone',
    name: `Cyberspace Designs Quadrotor ${index + 1}`,
    cost: 5_000,
    avail: { rarity: 2 },

    attributes: {
      [VehicleAttr.handling]: 2,
      [VehicleAttr.accel]: 15,
      [VehicleAttr.speedInterval]: 20,
      [VehicleAttr.topSpeed]: 120,
      [VehicleAttr.body]: 3,
      [VehicleAttr.armor]: 1,
      [VehicleAttr.pilot]: 3,
      [VehicleAttr.sensor]: 2,
      [VehicleAttr.seat]: null,
    },

    slavedTo: rcc.id,
    pilotingSpeciality: 'Aircraft',
  }, [
    addGear(riggerInterface),
  ])
})

addGear<VehicleData>({
  id: null,
  gearType: GearType.vehicle,
  type: 'Micro Rotor Drone',
  name: 'MCT Gnat',
  cost: 800,
  quantity: 10,
  avail: { rarity: 2 },

  attributes: {
    [VehicleAttr.handling]: 3,
    [VehicleAttr.accel]: 4,
    [VehicleAttr.speedInterval]: 10,
    [VehicleAttr.topSpeed]: 30,
    [VehicleAttr.body]: 0,
    [VehicleAttr.armor]: 0,
    [VehicleAttr.pilot]: 2,
    [VehicleAttr.sensor]: 1,
    [VehicleAttr.seat]: null,
  },

  slavedTo: rcc.id,
  pilotingSpeciality: 'Aircraft',
}, [
  addGear(riggerInterface),
])

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Cybereyes',
  type: 'Augment',
  source: { book: 'CRB', page: 285 },
  avail: { rarity: 4 },
  cost: 12_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.alpha,
    [AugmentAttr.rating]: 3,
    [AugmentAttr.capacity]: 12,
  },

  essenceCost: 0.32,
  augmentSlot: AugmentSlot.eyeware,
}, [
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Smartlink',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 4, license: true },
    cost: 4_800,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.capacityCost]: 3,
    },

    essenceCost: 0.16,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Imagelink',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 3 },
    cost: 960,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.capacityCost]: 0,
    },

    essenceCost: 0.08,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Low-Light Vision',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 3 },
    cost: 900,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.capacityCost]: 2,
    },

    essenceCost: 0.08,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Vision Enhancement',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 4 },
    cost: 4_800,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.capacityCost]: 2,
    },

    essenceCost: 0.08,
    augmentSlot: AugmentSlot.eyeware,
  }),
  addGear<AugmentData>({
    id: null,
    gearType: GearType.augment,
    name: 'Vision Magnification',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 4 },
    cost: 2_400,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.capacityCost]: 2,
    },

    essenceCost: 0.08,
    augmentSlot: AugmentSlot.eyeware,
  }),
])

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Commlink',
  type: 'Headware Augment',
  source: { book: 'CRB', page: 283 },
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
    name: 'Hermes Ikon',
    type: 'Commlink',
    source: { book: 'CRB', page: 267 },
    avail: { rarity: 3 },
    cost: 5_000,

    attributes: {
      'commlink.deviceRating': 5,
      'commlink.attributes': '3/0',
      'commlink.programSlots': 2,
    },
  }),
])

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Reaction Enhancers',
  type: 'Bodyware Augment',
  source: { book: 'CRB', page: 287 },
  avail: { rarity: 3, license: true },
  cost: 22_500,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 3,
  },

  essenceCost: 0.99,
  augmentSlot: AugmentSlot.bodyware,

  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.reaction, bonus: 3 },
  ],
})

addGear<SinData>({
  id: null,
  gearType: GearType.sin,
  name: 'Davina Hasselhoff',
  type: 'Fake SIN',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 4, illegal: true },
  cost: 15_000,

  description: 'General use SIN',

  attributes: {
    [SinAttr.rating]: 6,
  },
})

addGear<SinData>({
  id: null,
  gearType: GearType.sin,
  name: 'Sara McCabe',
  type: 'Fake SIN',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 4, illegal: true },
  cost: 10_000,

  description: 'Runner SIN',

  attributes: {
    [SinAttr.rating]: 4,
  },
}, [
  addGear<LicenseData>({
    id: null,
    gearType: GearType.license,
    name: 'Driver License (Semi-Truck)',
    type: 'Fake License',
    source: { book: 'CRB', page: 273 },
    avail: { rarity: 5, illegal: true },
    cost: 1_000,

    attributes: {
      [SinAttr.rating]: 5,
    },
  }),
])

addGear<SinData>({
  id: null,
  gearType: GearType.sin,
  name: 'Jane Smith',
  type: 'Fake SIN',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 4, illegal: true },
  cost: 5_000,

  description: 'Burner SIN',

  attributes: {
    [SinAttr.rating]: 2,
  },
})

addGear({
  id: null,
  gearType: GearType.other,
  name: 'Engineering Shop',
  type: 'Shop',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 4 },
  cost: 5_000,
})
