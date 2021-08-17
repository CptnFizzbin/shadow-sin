import { CharacterAttribute } from '../Character/CharacterAttribute'
import { CharacterData } from '../Character/CharacterData'
import { GearData, GearType } from '../Gear/GearData'
import { RccData } from '../Gear/Rigger/RccData'
import { AutosoftData, AutosoftType } from '../Gear/Software/Autosoft/AutosoftData'
import { DroneData } from '../Gear/Vehicles/DroneData'
import { VehicleData } from '../Gear/Vehicles/VehicleData'
import { VehicleModData } from '../Gear/Vehicles/VehicleModData'
import { WeaponData } from '../Gear/Weapons/WeaponData'
import { ActiveSkillId, SkillType } from '../System/Skill/SkillData'

const Artemis: CharacterData = {
  name: 'Artemis',
  metaType: 'Elf',
  karma: 7,
  nuyen: 14_420,

  attributes: [
    { name: CharacterAttribute.body, value: 1 },
    { name: CharacterAttribute.agility, value: 3 },
    { name: CharacterAttribute.reaction, value: 1 },
    { name: CharacterAttribute.strength, value: 1 },
    { name: CharacterAttribute.willpower, value: 2 },
    { name: CharacterAttribute.logic, value: 7 },
    { name: CharacterAttribute.intuition, value: 5 },
    { name: CharacterAttribute.charisma, value: 2 },
    { name: CharacterAttribute.edge, value: 4 },
    { name: CharacterAttribute.essence, value: 2.1 },
  ],

  skills: [
    {
      type: SkillType.active,
      id: ActiveSkillId.firearms,
      name: 'Firearms',
      rank: 3,
      attr: CharacterAttribute.agility,
      speciality: 'Automatics',
      expertise: null,
    },
    {
      type: SkillType.active,
      id: ActiveSkillId.electronics,
      name: 'Electronics',
      rank: 4,
      attr: CharacterAttribute.logic,
      speciality: null,
      expertise: null,
    },
    {
      type: SkillType.active,
      id: ActiveSkillId.cracking,
      name: 'Cracking',
      rank: 3,
      attr: CharacterAttribute.logic,
      altAttr: CharacterAttribute.intuition,
      speciality: null,
      expertise: null,
    },
    {
      type: SkillType.active,
      id: ActiveSkillId.piloting,
      name: 'Piloting',
      rank: 6,
      attr: CharacterAttribute.logic,
      speciality: 'Ground Craft',
      expertise: null,
    },
    {
      type: SkillType.active,
      id: ActiveSkillId.engineering,
      name: 'Engineering',
      rank: 5,
      attr: CharacterAttribute.logic,
      altAttr: CharacterAttribute.intuition,
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

addGear<WeaponData>({
  id: null,
  gearType: GearType.weapon,
  specialtySkill: ActiveSkillId.firearms,
  specialtyName: 'pistols',
  name: 'Ares Crusader II',
  type: 'Machine Pistol',
  dv: { value: 2, type: 'P' },
  modes: ['SA', 'BF'],
  attackRatings: [9, 9, 7, '-', '-'],
  ammo: { size: 40, type: 'c' },
  avail: { rarity: 5, license: true },
  cost: 520,
})

const rcc: RccData = addGear({
  id: null,
  gearType: GearType.rcc,
  name: 'Proteus Poseidon',
  type: 'RCC',
  avail: { rarity: 6, license: true },
  cost: 68_000,
  deviceRating: 5,
  dataProcessing: 5,
  firewall: 5,
})

const autosofts: AutosoftData[] = [
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'FN-HAR Targeting',
    type: AutosoftType.targeting,
    avail: { rarity: 8 },
    cost: 4_000,
    rating: 8,
    weapon: 'FN-HAR',
    attr: 'Sensor',
    attachedTo: rcc.id,
  }),
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'Clearsight',
    type: AutosoftType.clearsight,
    avail: { rarity: 7 },
    cost: 3_500,
    rating: 7,
    skill: 'Perception',
    attr: 'Sensor',
    attachedTo: rcc.id,
  }),
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'Evasion',
    type: AutosoftType.evasion,
    avail: { rarity: 5 },
    cost: 2_500,
    rating: 5,
    skill: 'Evasion',
    attr: 'Pilot',
    attachedTo: rcc.id,
  }),
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'Maneuvering',
    type: AutosoftType.maneuvering,
    avail: { rarity: 5 },
    cost: 2_500,
    rating: 5,
    skill: 'Piloting',
    attr: 'Pilot',
    attachedTo: rcc.id,
  }),
  addGear({
    id: null,
    gearType: GearType.autosoft,
    name: 'Electronic Warfare',
    type: AutosoftType.electronicWarfare,
    avail: { rarity: 7 },
    cost: 3_500,
    rating: 7,
    skill: 'Cracking',
    attr: 'Sensor',
    attachedTo: rcc.id,
  }),
]

const fnHar: WeaponData = {
  id: null,
  gearType: GearType.weapon,
  name: 'FN-HAR',
  type: 'Rifle',
  specialtySkill: ActiveSkillId.firearms,
  specialtyName: 'Automatics',
  dv: { value: 5, type: 'P' },
  modes: ['SA', 'BF', 'FA'],
  attackRatings: [3, 11, 10, 6, 1],
  ammo: { size: 35, type: 'c' },
  avail: { rarity: 3, license: true },
  cost: 2_100,
}

addGear(fnHar)

const stdWeaponMount: VehicleModData = {
  id: null,
  gearType: GearType.vehicleMod,
  name: 'Standard Weapon Mount',
  type: 'weapon mount',
  avail: { rarity: 5, illegal: true },
  cost: 4_500,
}

const riggerInterface: VehicleModData = {
  id: null,
  gearType: GearType.vehicleMod,
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
  handling: [4, 5],
  accel: 12,
  speedInterval: 20,
  topSpeed: 160,
  body: 16,
  armor: 10,
  pilot: 4,
  sensor: 4,
  seat: 7,
  slavedTo: rcc.id,
  slavedAutosofts: autosofts.map(gear => gear.id),
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
    handling: 3,
    accel: 20,
    speedInterval: 30,
    topSpeed: 160,
    body: 5,
    armor: 6,
    pilot: 3,
    sensor: 2,
    seat: null,
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
    handling: [3, 4],
    accel: 8,
    speedInterval: 10,
    topSpeed: 30,
    body: 6,
    armor: 2,
    pilot: 2,
    sensor: 2,
    seat: null,
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
    handling: 2,
    accel: 15,
    speedInterval: 20,
    topSpeed: 120,
    body: 3,
    armor: 1,
    pilot: 3,
    sensor: 2,
    seat: null,
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
