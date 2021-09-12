import { nextRecordId } from '../Api/Model'
import { CharacterAttr, CharacterData } from '../Character/CharacterData'
import { AugmentAttr, AugmentData, AugmentGrade, AugmentSlot, AugmentType } from '../Gear/Augments/AugmentData'
import { EffectType } from '../Gear/Effect'
import { GearData, GearType } from '../Gear/GearData'
import { RccAttr, RccData } from '../Gear/Rcc/RccData'
import { AutosoftAttr, AutosoftData } from '../Gear/Software/Autosoft/AutosoftData'
import { VehicleAttr, VehicleData } from '../Gear/Vehicles/VehicleData'
import { ModType, VehicleModData } from '../Gear/Vehicles/VehicleModData'
import { WeaponAttr, WeaponData } from '../Gear/Weapons/WeaponData'
import { WeaponModData, WeaponModSlot } from '../Gear/Weapons/WeaponModData'
import { ActiveSkillId, SkillType } from '../System/Skill/SkillData'

export const Artemis: CharacterData = {
  id: 'aebc2a1a-d12e-487e-aa5b-1f2daa18817a',
  dataVersion: 1,
  name: 'Artemis',
  metaType: 'Elf',
  karma: 7,
  nuyen: 14_420,

  attributes: {
    [CharacterAttr.body]: 1,
    [CharacterAttr.agility]: 3,
    [CharacterAttr.reaction]: 1,
    [CharacterAttr.strength]: 1,
    [CharacterAttr.willpower]: 2,
    [CharacterAttr.logic]: 7,
    [CharacterAttr.intuition]: 5,
    [CharacterAttr.charisma]: 2,
    [CharacterAttr.edge]: 4,
  },

  contacts: [],
  skills: [
    {
      type: SkillType.active,
      skillId: ActiveSkillId.firearms,
      name: 'Firearms',
      rank: 3,
      attr: 'agility',
      speciality: 'Automatics',
    },
    {
      type: SkillType.active,
      skillId: ActiveSkillId.electronics,
      name: 'Electronics',
      rank: 4,
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
      skillId: ActiveSkillId.piloting,
      name: 'Piloting',
      rank: 6,
      attr: 'logic',
      speciality: 'Ground Craft',
    },
    {
      type: SkillType.active,
      skillId: ActiveSkillId.engineering,
      name: 'Engineering',
      rank: 5,
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
      source: { book: 'COR', page: 2 },
      description: '',
      gameEffect: '',
      cost: 12,
    },
    {
      name: 'Social Stress (Large Groups)',
      source: { book: 'COR', page: 2 },
      bonus: 8,
    },
    {
      name: 'Juryrigger',
      source: { book: 'COR', page: 2 },
      cost: 12,
    },
    {
      name: 'Photographic Memory',
      source: { book: 'COR', page: 2 },
      cost: 12,
    },
    {
      name: 'Analytical Mind',
      source: { book: 'COR', page: 2 },
      gameEffect: 'Bonus edge when making Logic tests',
      cost: 3,
    },
    {
      name: 'Ambidextrous',
      source: { book: 'COR', page: 2 },
      cost: 4,
    },
  ],
}

export function addGear<T extends GearData> (gear: T, attachedGear: GearData[] = []): T {
  gear = { ...gear, dataVersion: 1, id: nextRecordId() }

  Artemis.gear.push(gear)
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

    slot: WeaponModSlot.topOrUnder,
  }),
  addGear(smartGunIntMod),
])

addGear<WeaponData>({
  id: null,
  source: { book: 'COR', page: 252 },
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

  specialtySkill: ActiveSkillId.firearms,
  specialtyName: 'pistols',
}, [
  addGear(smartGunIntMod),
])

addGear<WeaponData>({
  id: null,
  source: { book: 'COR', page: 253 },
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

  specialtySkill: ActiveSkillId.firearms,
  specialtyName: 'pistols',
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
    avail: { rarity: 7 },
    cost: 3_500,

    attributes: {
      [AutosoftAttr.rating]: 7,
      [AutosoftAttr.skill]: 'Perception',
      [AutosoftAttr.attr]: 'Sensor',
    },
  }),
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'Evasion',
    type: 'Autosoft',
    avail: { rarity: 5 },
    cost: 2_500,

    attributes: {
      [AutosoftAttr.rating]: 5,
      [AutosoftAttr.skill]: 'Evasion',
      [AutosoftAttr.attr]: 'Pilot',
    },
  }),
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'Maneuvering',
    type: 'Autosoft',
    avail: { rarity: 5 },
    cost: 2_500,

    attributes: {
      [AutosoftAttr.rating]: 5,
      [AutosoftAttr.skill]: 'Piloting',
      [AutosoftAttr.attr]: 'Pilot',
    },
  }),
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'Electronic Warfare',
    type: 'Autosoft',
    avail: { rarity: 7 },
    cost: 3_500,

    attributes: {
      [AutosoftAttr.rating]: 7,
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

  specialtySkill: ActiveSkillId.firearms,
  specialtyName: 'Automatics',
}

const stdWeaponMount: VehicleModData = {
  id: null,
  gearType: GearType.vehicleMod,
  modType: ModType.stdWeaponMount,
  name: 'Standard Weapon Mount',
  type: 'weapon mount',
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

addGear<VehicleData>({
  id: null,
  gearType: GearType.vehicle,
  name: 'Range Rover Model 2080',
  type: 'Van',
  cost: 5_000,
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
    [VehicleAttr.seat]: 7,
  },

  slavedTo: rcc.id,
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
  }, [
    addGear(riggerInterface),
    addGear(stdWeaponMount, [
      addGear(fnHar),
    ]),
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
  }, [
    addGear(riggerInterface),
    addGear(stdWeaponMount, [
      addGear(fnHar),
    ]),
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
  }, [
    addGear(riggerInterface),
  ])
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
])

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

addGear<AugmentData>({
  id: null,
  gearType: GearType.augment,
  name: 'Reaction Enahancers',
  type: 'Bodyware Augment',
  source: { book: 'COR', page: 283 },
  avail: { rarity: 3, license: true },
  cost: 22_500,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 3,
  },

  essenceCost: 0.99,
  augmentSlot: AugmentSlot.headware,

  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.reaction, bonus: 3 },
  ],
})
