import { CharacterAttr, CharacterData } from '../Character/CharacterData'
import { AugmentGrade, AugmentType } from '../Gear/Augments/AugmentData'
import { ControlRigData, HeadwearTypes } from '../Gear/Augments/HeadwearData'
import { GearData, GearType } from '../Gear/GearData'
import { RccData } from '../Gear/Rigger/RccData'
import { AutosoftAttr, AutosoftData, AutosoftType } from '../Gear/Software/Autosoft/AutosoftData'
import { DroneData } from '../Gear/Vehicles/DroneData'
import { VehicleAttr, VehicleData } from '../Gear/Vehicles/VehicleData'
import { ModType, VehicleModData } from '../Gear/Vehicles/VehicleModData'
import { WeaponData } from '../Gear/Weapons/WeaponData'
import { ActiveSkillId, SkillType } from '../System/Skill/SkillData'

const Artemis: CharacterData = {
  name: 'Artemis',
  metaType: 'Elf',
  karma: 7,
  nuyen: 14_420,

  attributes: {
    [CharacterAttr.body]: { name: 'Body', value: 1 },
    [CharacterAttr.agility]: { name: 'Agility', value: 3 },
    [CharacterAttr.reaction]: { name: 'Reaction', value: 1 },
    [CharacterAttr.strength]: { name: 'Strength', value: 1 },
    [CharacterAttr.willpower]: { name: 'Willpower', value: 2 },
    [CharacterAttr.logic]: { name: 'Logic', value: 7 },
    [CharacterAttr.intuition]: { name: 'Intuition', value: 5 },
    [CharacterAttr.charisma]: { name: 'Charisma', value: 2 },
    [CharacterAttr.edge]: { name: 'Edge', value: 4 },
    [CharacterAttr.essence]: { name: 'Essence', value: 2.1 },
  },

  skills: [
    {
      type: SkillType.active,
      id: ActiveSkillId.firearms,
      name: 'Firearms',
      rank: 3,
      attr: 'agility',
      speciality: 'Automatics',
      expertise: null,
    },
    {
      type: SkillType.active,
      id: ActiveSkillId.electronics,
      name: 'Electronics',
      rank: 4,
      attr: 'logic',
      speciality: null,
      expertise: null,
    },
    {
      type: SkillType.active,
      id: ActiveSkillId.cracking,
      name: 'Cracking',
      rank: 3,
      attr: 'logic',
      altAttr: 'intuition',
      speciality: null,
      expertise: null,
    },
    {
      type: SkillType.active,
      id: ActiveSkillId.piloting,
      name: 'Piloting',
      rank: 6,
      attr: 'logic',
      speciality: 'Ground Craft',
      expertise: null,
    },
    {
      type: SkillType.active,
      id: ActiveSkillId.engineering,
      name: 'Engineering',
      rank: 5,
      attr: 'logic',
      altAttr: 'intuition',
      speciality: null,
      expertise: null,
    },
    {
      type: SkillType.language,
      id: 'english',
      name: 'English',
      rank: 'native',
    },
    {
      type: SkillType.language,
      id: 'elven',
      name: 'Elven',
      rank: 'speciality',
    },
    {
      type: SkillType.knowledge,
      id: 'droneModels',
      name: 'Drone Models',
    },
    {
      type: SkillType.knowledge,
      id: 'popCulture',
      name: '80/90s Pop Culture',
    },
    {
      type: SkillType.knowledge,
      id: 'trideoSeries',
      name: 'Trideo Series',
    },
    {
      type: SkillType.knowledge,
      id: 'securitySystems',
      name: 'Security Systems',
    },
    {
      type: SkillType.knowledge,
      id: 'virtualNightclubs',
      name: 'Virtual Nightclubs',
    },
    {
      type: SkillType.knowledge,
      id: 'techCompanies',
      name: 'Tech Companies',
    },
  ],

  gear: [],
}

let nextId = 0

function addGear<T extends GearData> (gear: T): T {
  gear.id = nextId++
  Artemis.gear.push(gear)
  return gear
}

addGear<ControlRigData>({
  id: null,
  gearType: GearType.augment,
  name: 'Control Rig',
  type: HeadwearTypes.controlRig,
  augmentType: AugmentType.headware,
  avail: { rarity: 3, license: true },
  cost: 60_000,

  attributes: {
    rating: { name: 'Rating', value: 2 },
    grade: { name: 'Grade', value: AugmentGrade.used },
  },
})

addGear<WeaponData>({
  id: null,
  gearType: GearType.weapon,
  specialtySkill: ActiveSkillId.firearms,
  specialtyName: 'pistols',
  name: 'Ares Crusader II',
  type: 'Machine Pistol',
  avail: { rarity: 5, license: true },
  cost: 520,
  attributes: {
    dv: { name: 'DV', value: '2P' },
    modes: { name: 'Modes', value: 'SA/BF' },
    attackRatings: { name: 'Atk. Ratings', value: '9/9/7/-/-' },
    ammo: { name: 'Ammo', value: '40(c)' },
  },
})

const rcc: RccData = addGear({
  id: null,
  gearType: GearType.rcc,
  name: 'Proteus Poseidon',
  type: 'RCC',
  avail: { rarity: 6, license: true },
  cost: 68_000,

  attributes: {
    deviceRating: { name: 'Device Rating', value: 5 },
    dataProcessing: { name: 'Data Processing', value: 5 },
    firewall: { name: 'Firewall', value: 5 },
  },

  slavedAutosofts: [],
})

const autosofts: AutosoftData[] = [
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'FN-HAR Targeting',
    type: AutosoftType.targeting,
    avail: { rarity: 8 },
    cost: 4_000,
    attachedTo: rcc.id,

    attributes: {
      [AutosoftAttr.rating]: { name: 'Rating', value: 8 },
      [AutosoftAttr.weapon]: { name: 'Weapon', value: 'FN-HAR' },
      [AutosoftAttr.attr]: { name: 'Attr', value: 'Sensor' },
    },
  }),
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'Clearsight',
    type: AutosoftType.clearsight,
    avail: { rarity: 7 },
    cost: 3_500,
    attachedTo: rcc.id,

    attributes: {
      [AutosoftAttr.rating]: { name: 'Rating', value: 7 },
      [AutosoftAttr.skill]: { name: 'Skill', value: 'Perception' },
      [AutosoftAttr.attr]: { name: 'Attr', value: 'Sensor' },
    },
  }),
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'Evasion',
    type: AutosoftType.evasion,
    avail: { rarity: 5 },
    cost: 2_500,
    attachedTo: rcc.id,

    attributes: {
      [AutosoftAttr.rating]: { name: 'Rating', value: 5 },
      [AutosoftAttr.skill]: { name: 'Skill', value: 'Evasion' },
      [AutosoftAttr.attr]: { name: 'Attr', value: 'Pilot' },
    },
  }),
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'Maneuvering',
    type: AutosoftType.maneuvering,
    avail: { rarity: 5 },
    cost: 2_500,
    attachedTo: rcc.id,

    attributes: {
      [AutosoftAttr.rating]: { name: 'Rating', value: 5 },
      [AutosoftAttr.skill]: { name: 'Skill', value: 'Piloting' },
      [AutosoftAttr.attr]: { name: 'Attr', value: 'Pilot' },
    },
  }),
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'Electronic Warfare',
    type: AutosoftType.electronicWarfare,
    avail: { rarity: 7 },
    cost: 3_500,
    attachedTo: rcc.id,

    attributes: {
      [AutosoftAttr.rating]: { name: 'Rating', value: 7 },
      [AutosoftAttr.skill]: { name: 'Skill', value: 'Cracking' },
      [AutosoftAttr.attr]: { name: 'Attr', value: 'Sensor' },
    },
  }),
]

rcc.slavedAutosofts = autosofts.map(soft => soft.id)

const fnHar: WeaponData = {
  id: null,
  gearType: GearType.weapon,
  name: 'FN-HAR',
  type: 'Rifle',
  avail: { rarity: 3, license: true },
  cost: 2_100,
  attributes: {
    dv: { name: 'DV', value: '5P' },
    modes: { name: 'Modes', value: 'SA/BF/FA' },
    attackRatings: { name: 'Atk. Ratings', value: '3/11/10/6/1' },
    ammo: { name: 'Ammo', value: '35(c)' },
  },

  specialtySkill: ActiveSkillId.firearms,
  specialtyName: 'Automatics',
}

addGear(fnHar)

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

const car: VehicleData = addGear({
  id: null,
  gearType: GearType.vehicle,
  name: 'Range Rover Model 2080',
  type: 'vehicle',
  cost: 5_000,
  avail: { rarity: 2 },

  attributes: {
    [VehicleAttr.handling]: { name: 'Handling', value: '4/5' },
    [VehicleAttr.accel]: { name: 'Accel', value: 12 },
    [VehicleAttr.speedInterval]: { name: 'Speed Interval', value: 20 },
    [VehicleAttr.topSpeed]: { name: 'Top Speed', value: 160 },
    [VehicleAttr.body]: { name: 'Body', value: 16 },
    [VehicleAttr.armor]: { name: 'Armor', value: 10 },
    [VehicleAttr.pilot]: { name: 'Pilot', value: 4 },
    [VehicleAttr.sensor]: { name: 'Sensor', value: 4 },
    [VehicleAttr.seat]: { name: 'Seat', value: 7 },
  },

  slavedTo: rcc.id,
  slavedAutosofts: autosofts.map(gear => gear.id),
})

addGear({
  ...riggerInterface,
  attachedTo: car.id,
})
rcc.attachedTo = car.id

new Array(2).fill(null).forEach((_, index) => {
  const combatDrone: DroneData = addGear({
    id: null,
    gearType: GearType.drone,
    size: 'medium',
    type: 'rotor',
    name: `MCT-Nissan Roto-drone ${index + 1}`,
    cost: 5_000,
    avail: { rarity: 2 },

    attributes: {
      [VehicleAttr.handling]: { name: 'Handling', value: 3 },
      [VehicleAttr.accel]: { name: 'Accel', value: 20 },
      [VehicleAttr.speedInterval]: { name: 'Speed Interval', value: 30 },
      [VehicleAttr.topSpeed]: { name: 'Top Speed', value: 160 },
      [VehicleAttr.body]: { name: 'Body', value: 5 },
      [VehicleAttr.armor]: { name: 'Armor', value: 6 },
      [VehicleAttr.pilot]: { name: 'Pilot', value: 3 },
      [VehicleAttr.sensor]: { name: 'Sensor', value: 2 },
      [VehicleAttr.seat]: { name: 'Seat', value: null },
    },

    slavedTo: rcc.id,
    slavedAutosofts: autosofts.map(gear => gear.id),
  })

  addGear({
    ...riggerInterface,
    attachedTo: combatDrone.id,
  })

  const droneWepMount: VehicleModData = addGear({
    ...stdWeaponMount,
    attachedTo: combatDrone.id,
  })

  addGear({
    ...fnHar,
    attachedTo: droneWepMount.id,
  })
})

new Array(4).fill(null).forEach((_, index) => {
  const combatDrone: DroneData = addGear({
    id: null,
    gearType: GearType.drone,
    size: 'small',
    type: 'anthro',
    name: `Aztech Crawler ${index + 1}`,
    cost: 4_500,
    avail: { rarity: 2 },

    attributes: {
      [VehicleAttr.handling]: { name: 'Handling', value: '3/4' },
      [VehicleAttr.accel]: { name: 'Accel', value: 8 },
      [VehicleAttr.speedInterval]: { name: 'Speed Interval', value: 10 },
      [VehicleAttr.topSpeed]: { name: 'Top Speed', value: 30 },
      [VehicleAttr.body]: { name: 'Body', value: 6 },
      [VehicleAttr.armor]: { name: 'Armor', value: 2 },
      [VehicleAttr.pilot]: { name: 'Pilot', value: 2 },
      [VehicleAttr.sensor]: { name: 'Sensor', value: 2 },
      [VehicleAttr.seat]: { name: 'Seat', value: null },
    },

    slavedTo: rcc.id,
    slavedAutosofts: autosofts.map(gear => gear.id),
  })

  addGear({
    ...riggerInterface,
    attachedTo: combatDrone.id,
  })

  const droneWepMount: VehicleModData = addGear({
    ...stdWeaponMount,
    attachedTo: combatDrone.id,
  })

  addGear({
    ...fnHar,
    attachedTo: droneWepMount.id,
  })
})

new Array(1).fill(null).forEach((_, index) => {
  const scoutDrone = addGear({
    id: null,
    gearType: GearType.drone,
    size: 'small',
    type: 'anthro',
    name: `Cyberspace Designs Quadrotor ${index + 1}`,
    cost: 5_000,
    avail: { rarity: 2 },

    attributes: {
      [VehicleAttr.handling]: { name: 'Handling', value: 2 },
      [VehicleAttr.accel]: { name: 'Accel', value: 15 },
      [VehicleAttr.speedInterval]: { name: 'Speed Interval', value: 20 },
      [VehicleAttr.topSpeed]: { name: 'Top Speed', value: 120 },
      [VehicleAttr.body]: { name: 'Body', value: 3 },
      [VehicleAttr.armor]: { name: 'Armor', value: 1 },
      [VehicleAttr.pilot]: { name: 'Pilot', value: 3 },
      [VehicleAttr.sensor]: { name: 'Sensor', value: 2 },
      [VehicleAttr.seat]: { name: 'Seat', value: null },
    },

    slavedTo: rcc.id,
    slavedAutosofts: autosofts.map(gear => gear.id),
  })

  addGear({
    ...riggerInterface,
    attachedTo: scoutDrone.id,
  })
})

export {
  Artemis,
}
