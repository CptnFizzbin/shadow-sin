import { Character } from '../Character/Character'
import { DroneData } from '../Gear/Drones/DroneData'
import { GearData, GearType } from '../Gear/GearData'
import { AutosoftData } from '../Gear/Software/Autosoft/AutosoftData'
import { VehicleModData } from '../Gear/Vehicles/VehicleModData'
import { WeaponData } from '../Gear/Weapons/WeaponData'

const Artemis: Character = {
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
      type: 'stat',
      id: 'firearms',
      name: 'Firearms',
      rank: 3,
      attr: 'agility',
      speciality: 'Automatics',
      expertise: null,
    },
    {
      type: 'stat',
      id: 'electronics',
      name: 'Electronics',
      rank: 4,
      attr: 'logic',
      speciality: null,
      expertise: null,
    },
    {
      type: 'stat',
      id: 'cracking',
      name: 'Cracking',
      rank: 3,
      attr: 'logic',
      altAttr: 'intuition',
      speciality: null,
      expertise: null,
    },
    {
      type: 'stat',
      id: 'piloting',
      name: 'Piloting',
      rank: 6,
      attr: 'logic',
      speciality: 'Ground Craft',
      expertise: null,
    },
    {
      type: 'stat',
      id: 'engineering',
      name: 'Engineering',
      rank: 5,
      attr: 'logic',
      altAttr: 'intuition',
      speciality: null,
      expertise: null,
    },
    {
      type: 'language',
      id: 'english',
      name: 'english',
      rank: 'native',
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

const rcc: GearData = addGear({
  id: null,
  gearType: GearType.other,
  name: 'Proteus Poseidon',
  type: 'RCC',
  avail: { rarity: 6, license: true },
  cost: 68_000,
  stats: {
    deviceRating: 5,
    dataProcessing: 5,
    firewall: 5,
  },
})

addGear<AutosoftData>({
  id: null,
  gearType: GearType.autosoft,
  name: 'RPK HMG Targeting',
  type: 'targeting autosoft',
  avail: { rarity: 8 },
  cost: 4_000,
  rating: 8,
  weapon: 'RPK HMG',
  attr: 'Sensor',
  attachedTo: rcc.id,
})

const autosofts: AutosoftData[] = [
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

const combatDrone: DroneData = addGear<DroneData>({
  id: null,
  gearType: GearType.drone,
  quantity: 2,
  size: 'medium',
  name: 'MCT-Nissan Roto-drone',
  type: 'medium rotor drone',
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
  id: null,
  gearType: GearType.vehicleMod,
  name: 'Heavy Weapon Mount',
  type: 'weapon mount',
  avail: { rarity: 5, illegal: true },
  cost: 5_000,
  attachedTo: combatDrone.id,
})

addGear({
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
  attachedTo: droneWepMount.id,
})

export {
  Artemis,
}
