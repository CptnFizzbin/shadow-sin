import { CharacterData } from '../Character/CharacterData'
import { SkillType } from '../Character/Skill/SkillData'
import { DroneData } from '../Gear/Drones/DroneData'
import { GearData, GearType } from '../Gear/GearData'
import { RccData } from '../Gear/Rigger/RccData'
import { AutosoftData } from '../Gear/Software/Autosoft/AutosoftData'
import { VehicleModData } from '../Gear/Vehicles/VehicleModData'
import { WeaponData } from '../Gear/Weapons/WeaponData'

const Artemis: CharacterData = {
  name: 'Artemis',
  metaType: 'Elf',
  karma: 0,
  nuyen: 3420,

  attributes: {
    body: 1,
    agility: 3,
    reaction: 1,
    strength: 1,
    willpower: 2,
    logic: 7,
    intuition: 5,
    charisma: 2,
    edge: 4,
    essence: 2.1,
  },

  skills: [
    {
      type: SkillType.active,
      id: 'firearms',
      name: 'Firearms',
      rank: 3,
      attr: 'agility',
      speciality: 'Automatics',
      expertise: null,
    },
    {
      type: SkillType.active,
      id: 'electronics',
      name: 'Electronics',
      rank: 4,
      attr: 'logic',
      speciality: null,
      expertise: null,
    },
    {
      type: SkillType.active,
      id: 'cracking',
      name: 'Cracking',
      rank: 3,
      attr: 'logic',
      altAttr: 'intuition',
      speciality: null,
      expertise: null,
    },
    {
      type: SkillType.active,
      id: 'piloting',
      name: 'Piloting',
      rank: 6,
      attr: 'logic',
      speciality: 'Ground Craft',
      expertise: null,
    },
    {
      type: SkillType.active,
      id: 'engineering',
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

addGear<WeaponData>({
  id: null,
  gearType: GearType.weapon,
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
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'FN-HAR Targeting',
    type: 'targeting autosoft',
    avail: { rarity: 8 },
    cost: 4_000,
    rating: 8,
    weapon: 'FN-HAR',
    attr: 'Sensor',
    attachedTo: rcc.id,
  }),
  addGear<AutosoftData>({
    id: null,
    gearType: GearType.autosoft,
    name: 'Clearsight',
    type: 'autosoft',
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
    type: 'autosoft',
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
    type: 'autosoft',
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
    type: 'Autosoft',
    avail: { rarity: 7 },
    cost: 3_500,
    rating: 7,
    skill: 'Cracking',
    attr: 'Sensor',
    attachedTo: rcc.id,
  }),
]

const FnHar: WeaponData = {
  id: null,
  gearType: GearType.weapon,
  name: 'FN-HAR',
  type: 'Rifle',
  dv: { value: 5, type: 'P' },
  modes: ['SA', 'BF', 'FA'],
  attackRatings: [3, 11, 10, 6, 1],
  ammo: { size: 35, type: 'c' },
  avail: { rarity: 3, license: true },
  cost: 2_100,
}

const stdWeaponMount: VehicleModData = {
  id: null,
  gearType: GearType.vehicleMod,
  name: 'Standard Weapon Mount',
  type: 'weapon mount',
  avail: { rarity: 5, illegal: true },
  cost: 4_500,
}

new Array(2).fill(null).forEach((_, index) => {
  const combatDrone: DroneData = addGear<DroneData>({
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

  const droneWepMount: VehicleModData = addGear({
    ...stdWeaponMount,
    attachedTo: combatDrone.id,
  })

  addGear({
    ...FnHar,
    attachedTo: droneWepMount.id,
  })
})

new Array(4).fill(null).forEach((_, index) => {
  const combatDrone: DroneData = addGear<DroneData>({
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

  const droneWepMount: VehicleModData = addGear({
    ...stdWeaponMount,
    attachedTo: combatDrone.id,
  })

  addGear({
    ...FnHar,
    attachedTo: droneWepMount.id,
  })
})

new Array(1).fill(null).forEach((_, index) => {
  addGear<DroneData>({
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
})

export {
  Artemis,
}
