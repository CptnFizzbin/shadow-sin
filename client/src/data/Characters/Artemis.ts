import { AwakenedType } from '../../Character/AwakenedType'
import { CharacterAttr } from '../../Character/CharacterAttr'
import { CharacterData } from '../../Character/CharacterData'
import { ArmorAttr } from '../../Gear/Armor/ArmorAttr'
import { ArmorData } from '../../Gear/Armor/ArmorData'
import { AugmentAttr } from '../../Gear/Augments/AugmentAttr'
import { AugmentData, AugmentGrade, AugmentSlot, AugmentType } from '../../Gear/Augments/AugmentData'
import { GearType } from '../../Gear/GearData'
import { LicenseAttr } from '../../Gear/License/LicenseAttr'
import { LicenseData } from '../../Gear/License/LicenseData'
import { SinAttr } from '../../Gear/License/SinAttr'
import { SinData } from '../../Gear/License/SinData'
import { OtherGearAttr } from '../../Gear/OtherGearData'
import { RccAttr } from '../../Gear/Rcc/RccAttr'
import { RccData } from '../../Gear/Rcc/RccData'
import { AutosoftAttr } from '../../Gear/Software/Autosoft/AutosoftAttr'
import { AutosoftData } from '../../Gear/Software/Autosoft/AutosoftData'
import { VehicleAttr } from '../../Gear/Vehicles/VehicleAttr'
import { VehicleData } from '../../Gear/Vehicles/VehicleData'
import { ModType, VehicleModData } from '../../Gear/Vehicles/VehicleModData'
import { WeaponPoolKeys } from '../../Gear/Weapons/DicePools'
import { WeaponAttr } from '../../Gear/Weapons/WeaponAttr'
import { WeaponData } from '../../Gear/Weapons/WeaponData'
import { WeaponModData, WeaponModSlot } from '../../Gear/Weapons/WeaponModData'
import { toCharQuality } from '../../Qualities/CharacterQuality'
import { Qualities, QualityIds } from '../../Qualities/Quality'
import { ActiveSkillIds, SkillType, Specializations } from '../../Skills'
import { EffectType } from '../../System/Effect'

import { addGear } from './index'

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

  karma: [
    {
      date: '2021-12-19T16:01',
      value: 5,
      note: 'Mission reward',
    },
    {
      date: '2021-12-19T16:00',
      value: 3,
      note: 'Session reward',
    },
    {
      date: '2021-12-05T16:00',
      value: 5,
      note: 'Session reward',
    },
    {
      date: '2021-11-27T16:00',
      value: 4,
      note: 'Session reward',
    },
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
      date: '2021-10-17T16:00',
      value: 5,
      note: 'Session reward',
    },
    {
      date: '2021-10-03T16:00',
      value: 3,
      note: 'Session reward',
    },
    {
      date: '2021-09-26T16:00',
      value: 4,
      note: 'Session reward',
    },
    {
      date: '2021-09-19T22:00',
      value: -10,
      note: 'Body 1 => 2',
    },
    {
      date: '2021-09-19T16:00',
      value: 5,
      note: 'Session reward',
    },
    {
      date: '2021-09-11',
      value: 2,
      note: 'Session reward',
    },
    {
      date: '2021-08-28',
      value: 14,
      note: 'Balance import',
    },
  ],

  nuyen: [
    {
      date: '2021-12-19T16:00',
      value: 40_000,
      note: 'Mission Reward',
    },
    {
      date: '2021-10-24T16:03',
      value: -9_200 * 2,
      note: 'Ingram Black Knight x2',
    },
    {
      date: '2021-10-24T16:02',
      value: 500,
      note: 'Loan from Slicus',
    },
    {
      date: '2021-10-24T16:01',
      value: -4_000,
      note: 'Ingram Black Knight Targeting Autosoft',
    },
    {
      date: '2021-10-24T16:00',
      value: -5_000 * 2,
      note: 'Heavy Weapon Mount x2',
    },
    {
      date: '2021-10-17T16:00',
      value: 11_400,
      note: 'Session reward',
    },
    {
      date: '2021-09-26T16:00',
      value: 10_166,
      note: 'Session reward',
    },
    {
      date: '2021-09-26T15:02',
      value: 300,
      note: 'Buy forklift rental',
    },
    {
      date: '2021-09-26T15:01',
      value: 500,
      note: 'Buy Semi-truck rental',
    },
    {
      date: '2021-09-26T15:00',
      value: 1_000,
      note: 'Buy Semi-truck driver license',
    },
    {
      date: '2021-09-19T22:01',
      value: -16_000,
      note: 'Buy r4 sensor arrays for crawlers',
    },
    {
      date: '2021-09-19T22:00',
      value: -22_500,
      note: 'Buy Reaction Enhancers',
    },
    {
      date: '2021-09-19T16:00',
      value: 25_000,
      note: 'Session Reward',
    },
    {
      date: '2021-08-28T00:04',
      value: 18_070,
      note: 'Session Reward',
    },
    {
      date: '2021-08-28T00:02',
      value: -445_665,
      note: 'Starting Gear',
    },
    {
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
    [CharacterAttr.agility]: 6,
    [CharacterAttr.reaction]: 5,
    [CharacterAttr.strength]: 1,
    [CharacterAttr.willpower]: 1,
    [CharacterAttr.logic]: 7,
    [CharacterAttr.intuition]: 5,
    [CharacterAttr.charisma]: 2,
    [CharacterAttr.edge]: 2,
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
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.piloting,
      rank: 5,
      specialization: 'Ground Craft',
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

  gear: [],

  qualities: [
    toCharQuality(Qualities[QualityIds.CRB.exceptional], { type: CharacterAttr.logic }),
    toCharQuality(Qualities[QualityIds.CRB.socialStress], { type: 'Large Groups' }),
    toCharQuality(Qualities[QualityIds.CRB.juryrigger]),
    toCharQuality(Qualities[QualityIds.CRB.photographicMemory]),
    toCharQuality(Qualities[QualityIds.CRB.analyticalMind]),
    toCharQuality(Qualities[QualityIds.CRB.ambidextrous]),
  ],
}

addGear<ArmorData>(Artemis, {
  id: '84596cc0-754e-457e-b862-c6935f028f62',
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
})

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
      type: EffectType.dicePoolAdj,
      poolType: WeaponPoolKeys.basicAttack,
      value: 1,
    },
  ],
}

addGear<AugmentData>(Artemis, {
  id: '37f9da35-c67f-46fd-9e79-3929db823816',
  gearType: GearType.augment,
  name: 'Control Rig',
  type: 'Headwear Augment',
  avail: { rarity: 3, license: true },
  cost: 72_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 1.6,
    [AugmentAttr.slot]: AugmentSlot.headware,
    [AugmentAttr.rating]: 2,
  },

  augmentType: AugmentType.controlRig,
})

addGear<AugmentData>(Artemis, {
  id: 'd89aafe6-111f-4e60-9fe2-fe5c1c3f94b8',
  gearType: GearType.augment,
  name: 'Cerebral Booster',
  type: 'Cultured Bioware Augment',
  avail: { rarity: 4 },
  cost: 47_250,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 0.66,
    [AugmentAttr.slot]: AugmentSlot.bioware,
    [AugmentAttr.rating]: 3,
  },

  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.logic, value: 3 },
  ],
})

addGear<AugmentData>(Artemis, {
  id: 'de13c340-89b3-4bc9-b6f4-29288cff00bc',
  gearType: GearType.augment,
  name: 'Sleep Regulator',
  type: 'Cultured Bioware Augment',
  avail: { rarity: 4 },
  source: { book: 'CRB', page: 293 },
  cost: 6_000,

  description: (`
    You need less sleep per day, and the sleep you get is deep and restful (and harder
    to wake up from). The sleep regulator lets you get by with three hours of sleep
    each night, and you can stay awake for twice as long as normal without acquiring 
    the Fatigued status. Resting hours for healing purposes are not affected.
  `),

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 0.11,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },
})

addGear<WeaponData>(Artemis, {
  id: 'e7f70f35-8d96-43be-8b19-fc9d8718ed95',
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

  skill: ActiveSkillIds.CRB.firearms,
  specialtyName: Specializations.CRB.Firearms.SubmachineGuns,
}, [
  addGear(Artemis, {
    id: 'f8d19b04-8767-4693-9774-195ff92ed8df',
    source: { book: 'CRB', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Rigid Stock',
    type: 'Weapon Mod',

    slot: null,
    removable: false,
  }),
  addGear(Artemis, {
    id: '02fbb521-e039-4c06-9aaf-cead333e3885',
    source: { book: 'CRB', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Laser sight',
    type: 'Weapon Mod',

    slot: WeaponModSlot.topOrUnder,
  }),
  addGear(Artemis, {
    id: '21d66c66-4615-49d6-b330-e4c25eea631a',
    source: { book: 'CRB', page: 254 },
    gearType: GearType.weaponMod,
    name: 'Flashlight',
    type: 'Weapon Mod',

    slot: WeaponModSlot.topOrUnder,
  }),
  addGear(Artemis, { ...smartGunIntMod, id: '429f440e-ffc3-459d-b08f-b013af1648dc' }),
])

addGear<WeaponData>(Artemis, {
  id: 'ae2baf27-bd6f-43e2-8198-a19e37231b7d',
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

  skill: ActiveSkillIds.CRB.firearms,
  specialtyName: Specializations.CRB.Firearms.LightPistols,
}, [
  addGear(Artemis, { ...smartGunIntMod, id: '7c94f42b-e770-472f-85d8-992cde7e2606' }),
])

const autosofts: AutosoftData[] = [
  addGear<AutosoftData>(Artemis, {
    id: 'de5e973c-134d-427e-9a3a-205422341b7b',
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
  addGear<AutosoftData>(Artemis, {
    id: 'a0af5540-37c7-44ca-af2a-03cb21efd83a',
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
  addGear<AutosoftData>(Artemis, {
    id: '3a459c98-5354-4fa1-a230-dfe77b199ffa',
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
  addGear<AutosoftData>(Artemis, {
    id: '78a5f82e-636f-468a-85e3-5af73304b7c0',
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
  addGear<AutosoftData>(Artemis, {
    id: 'a5b8c866-38cb-40a2-a136-d3feb39ea68d',
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
  addGear<AutosoftData>(Artemis, {
    id: '0b3dae26-a9d1-4752-a298-db024d13476b',
    gearType: GearType.autosoft,
    name: 'Black Knight Targeting',
    type: 'Targeting Autosoft',
    avail: { rarity: 8 },
    cost: 4_000,

    attributes: {
      [AutosoftAttr.rating]: 8,
      [AutosoftAttr.weapon]: 'Ingram Black Knight',
      [AutosoftAttr.attr]: 'Sensor',
    },
  }),
]

const rccHeadwear = addGear<AugmentData>(Artemis, {
  id: '1f8b016d-a36f-45b6-8099-7527e2986093',
  gearType: GearType.augment,
  name: 'RCC Headwear',
  type: 'Headwear Augment',
  avail: { rarity: 2, license: true },
  source: { book: 'DC', page: 145 },
  cost: 2_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 0.33,
    [AugmentAttr.slot]: AugmentSlot.headware,
    [AugmentAttr.capacityCost]: 3,
  },
})

const rcc = addGear<RccData>(Artemis, {
  id: 'bb6e3208-418d-41b8-85c3-447e6328aa5bs',
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

  slavedAutosofts: [
    'de5e973c-134d-427e-9a3a-205422341b7b',
    'a0af5540-37c7-44ca-af2a-03cb21efd83a',
    '3a459c98-5354-4fa1-a230-dfe77b199ffa',
    '78a5f82e-636f-468a-85e3-5af73304b7c0',
    '0b3dae26-a9d1-4752-a298-db024d13476b',
  ],

  attachedTo: rccHeadwear.id,
})

autosofts.forEach(soft => soft.attachedTo = rcc.id)

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

  skill: ActiveSkillIds.CRB.firearms,
  specialtyName: Specializations.CRB.Firearms.Rifles,
}

const stdWeaponMount: VehicleModData = {
  id: null,
  gearType: GearType.vehicleMod,
  modType: ModType.stdWeaponMount,
  name: 'Standard Weapon Mount',
  type: 'vehicle mod',
  avail: { rarity: 4, illegal: true },
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

addGear<VehicleData>(Artemis, {
  id: '4a5eb8d5-004b-4cdd-bce5-e0db64a33639',
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
  addGear(Artemis, { ...riggerInterface, id: 'cebc1ac9-e097-44f6-9394-bc342a7f71a3' }),
])

const rotoDrone: VehicleData = {
  id: '55887cc1-89b1-4b6d-8fc5-88560d32d31d',
  gearType: GearType.vehicle,
  type: 'Medium Rotor Drone',
  name: 'MCT-Nissan Roto-drone',
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
}

const oniDrone: VehicleData = {
  id: null,
  gearType: GearType.vehicle,
  name: 'Nissan Oni',
  type: 'Medium Antro Drone',
  cost: 6_700,
  avail: { rarity: 2 },

  attributes: {
    [VehicleAttr.handling]: 4,
    [VehicleAttr.accel]: 10,
    [VehicleAttr.speedInterval]: 8,
    [VehicleAttr.topSpeed]: 30,
    [VehicleAttr.body]: 9,
    [VehicleAttr.armor]: 10,
    [VehicleAttr.pilot]: 3,
    [VehicleAttr.sensor]: 2,
    [VehicleAttr.seat]: null,
  },

  pilotingSpeciality: 'Ground Craft',
}

addGear<VehicleData>(Artemis, {
  ...rotoDrone,
  id: '55887cc1-89b1-4b6d-8fc5-88560d32d31d',
  name: 'MCT-Nissan Roto-drone 1',
}, [
  addGear(Artemis, { ...stdWeaponMount, id: 'f2b1186d-6832-4532-95e9-c627037fcf9d' }, [
    addGear(Artemis, { ...fnHar, id: '853a03bb-18fd-42c3-9247-df59e1438904' }),
  ]),
  addGear(Artemis, { ...riggerInterface, id: 'ae26eaa6-0e99-41db-b548-383e989865a3' }),
  // addGear(sensorArray),
])

addGear<VehicleData>(Artemis, {
  ...rotoDrone,
  id: '17fe3632-c927-4def-91eb-7376ea1cdd3f',
  name: 'MCT-Nissan Roto-drone 2',
}, [
  addGear(Artemis, { ...stdWeaponMount, id: '7a1c1485-0f2f-4434-b216-3379c0b47e83' }, [
    addGear(Artemis, { ...fnHar, id: 'c068d8c7-de94-41d6-91c1-45c55fa58a93' }),
  ]),
  addGear(Artemis, { ...riggerInterface, id: '0dfe8000-84db-430b-8cd6-7684b18ac5da' }),
  // addGear(sensorArray),
])

const crawlerDrone: VehicleData = {
  id: null,
  gearType: GearType.vehicle,
  name: 'Aztech Crawler',
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
}

addGear<VehicleData>(Artemis, {
  ...crawlerDrone,
  id: 'b02313b9-c024-4c5b-a661-9e23fbc6e816',
  name: 'Aztech Crawler 1',

}, [
  addGear(Artemis, { ...stdWeaponMount, id: '91afef0a-9401-46eb-9c3a-66ac3a55a2fb' }, [
    addGear(Artemis, { ...fnHar, id: 'd70a4b40-c220-497b-b6ef-460e48477071' }),
  ]),
  addGear(Artemis, { ...riggerInterface, id: '2801f808-849f-4226-bbb6-6db12fe6ddb9' }),
  addGear(Artemis, { ...sensorArray, id: '11805cad-896c-4cba-ba18-e81eeff71dae' }),
])

addGear<VehicleData>(Artemis, {
  id: '9159eaaa-f444-4f54-ac01-db6b65464764',
  gearType: GearType.vehicle,
  type: 'Small Rotor Drone',
  name: 'Cyberspace Designs Quadrotor',
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
  addGear(Artemis, { ...riggerInterface, id: 'f1118f16-1105-428f-ba17-67d90e00377a' }),
])

addGear<VehicleData>(Artemis, {
  id: 'fbbbd8b6-7e5a-46c4-ad0c-5b8c7cadb1f3',
  gearType: GearType.vehicle,
  type: 'Micro Rotor Drone',
  name: 'MCT Gnat',
  cost: 800,
  quantity: 8,
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
  addGear(Artemis, { ...riggerInterface, id: 'b4ba0a55-150b-47b4-b391-cc1da213d48a' }),
])

addGear<VehicleData>(Artemis, {
  ...crawlerDrone,
  id: 'f086ff48-0a38-40d9-9d62-0cd0a9d2e148',
  name: 'Aztech Crawler',
  quantity: 5,
  slavedTo: null,
})

addGear<VehicleData>(Artemis, {
  ...rotoDrone,
  id: '2be9530b-621f-4f50-9188-722d3843f1c4',
  name: 'MCT-Nissan Roto-drone',
  quantity: 1,
  slavedTo: null,
})

addGear<VehicleData>(Artemis, {
  ...oniDrone,
  id: '449a5812-9a81-409a-ba25-4e400e2281b1',
  name: 'Nissan Oni',
  quantity: 4,
  slavedTo: null,
})

addGear<AugmentData>(Artemis, {
  id: '62c928a2-2a1e-4195-83ee-c760b6f93e1b',
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
    [AugmentAttr.essenceCost]: 0.32,
    [AugmentAttr.slot]: AugmentSlot.eyeware,
  },
}, [
  addGear<AugmentData>(Artemis, {
    id: 'a19ea646-4212-49a2-908c-1da5f3ab498f',
    gearType: GearType.augment,
    name: 'Smartlink',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 4, license: true },
    cost: 4_800,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.essenceCost]: 0.16,
      [AugmentAttr.slot]: AugmentSlot.eyeware,
      [AugmentAttr.capacityCost]: 3,
    },
  }),
  addGear<AugmentData>(Artemis, {
    id: '31e7ddd1-dca5-4f99-a67d-2fecadcf2853',
    gearType: GearType.augment,
    name: 'Imagelink',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 3 },
    cost: 960,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.essenceCost]: 0.08,
      [AugmentAttr.slot]: AugmentSlot.eyeware,
      [AugmentAttr.capacityCost]: 0,
    },
  }),
  addGear<AugmentData>(Artemis, {
    id: '1660efc9-98d5-4ed1-b2da-651e7ea578c5',
    gearType: GearType.augment,
    name: 'Low-Light Vision',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 3 },
    cost: 900,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.capacityCost]: 2,
      [AugmentAttr.essenceCost]: 0.08,
      [AugmentAttr.slot]: AugmentSlot.eyeware,
    },
  }),
  addGear<AugmentData>(Artemis, {
    id: '31189433-ba37-4186-a453-6e236d915caa',
    gearType: GearType.augment,
    name: 'Vision Enhancement',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 4 },
    cost: 4_800,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.capacityCost]: 2,
      [AugmentAttr.essenceCost]: 0.08,
      [AugmentAttr.slot]: AugmentSlot.eyeware,
    },
  }),
  addGear<AugmentData>(Artemis, {
    id: '1b6cdf25-9374-4a09-b2a1-76ed1a9be01b',
    gearType: GearType.augment,
    name: 'Vision Magnification',
    type: 'Cybereye Augment',
    source: { book: 'CRB', page: 275 },
    avail: { rarity: 4 },
    cost: 2_400,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.alpha,
      [AugmentAttr.capacityCost]: 2,
      [AugmentAttr.essenceCost]: 0.08,
      [AugmentAttr.slot]: AugmentSlot.eyeware,
    },
  }),
])

addGear<AugmentData>(Artemis, {
  id: '89192a52-adf6-41d1-8978-0f0787185b5a',
  gearType: GearType.augment,
  name: 'Commlink',
  type: 'Headware Augment',
  source: { book: 'CRB', page: 283 },
  avail: { rarity: 1 },
  cost: 1_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 0.11,
    [AugmentAttr.slot]: AugmentSlot.headware,
  },
}, [
  addGear(Artemis, {
    id: '8c2e404d-5678-4dad-8cdd-dcda26e9d866',
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

addGear<AugmentData>(Artemis, {
  id: '3803d92f-1869-41b0-975a-dbdd929af4d7',
  gearType: GearType.augment,
  name: 'Reaction Enhancers',
  type: 'Bodyware Augment',
  source: { book: 'CRB', page: 287 },
  avail: { rarity: 3, license: true },
  cost: 22_500,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 3,
    [AugmentAttr.essenceCost]: 0.99,
    [AugmentAttr.slot]: AugmentSlot.bodyware,
  },

  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.reaction, value: 3 },
  ],
})

addGear<SinData>(Artemis, {
  id: '110a3b00-ac94-4698-a60c-7cf34d829bcb',
  gearType: GearType.sin,
  name: 'Sara McCabe',
  type: 'Fake SIN',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 4, illegal: true },
  cost: 15_000,

  description: 'General use SIN',

  attributes: {
    [SinAttr.rating]: 6,
  },
})

addGear<SinData>(Artemis, {
  id: '25a3030a-4850-4f68-914f-95276c893352',
  gearType: GearType.sin,
  name: 'Jadzia Dax',
  type: 'Fake SIN',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 4, illegal: true },
  cost: 10_000,

  description: 'Runner SIN',

  attributes: {
    [SinAttr.rating]: 4,
  },
}, [
  addGear<LicenseData>(Artemis, {
    id: 'eae7b822-7dee-4734-8e7b-1c1ebd7aa46d',
    gearType: GearType.license,
    name: 'Driver License (Semi-Truck)',
    type: 'Fake License',
    source: { book: 'CRB', page: 273 },
    avail: { rarity: 5, illegal: true },
    cost: 1_000,

    attributes: {
      [LicenseAttr.rating]: 5,
    },
  }),
])

addGear<SinData>(Artemis, {
  id: '50f91ebf-e206-4843-be29-ac1bcb3a45ba',
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

addGear(Artemis, {
  id: 'f2b9526c-5db1-4076-81c0-c0bf52280e8a',
  gearType: GearType.other,
  name: 'Engineering Shop',
  type: 'Shop',
  source: { book: 'CRB', page: 273 },
  avail: { rarity: 4 },
  cost: 5_000,
})
