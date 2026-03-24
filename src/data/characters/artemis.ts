import { LifestyleType } from "#/lib/system/types/LifestyleType.ts"
import { MetatypeKey } from "#/lib/system/types/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import type { SinData } from "#/lib/system/types/gear/SinData.ts"
import type { ArmorData } from "#/lib/system/types/gear/armorData.ts"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"
import {
  createFirearm,
  createGear,
  GearType,
} from "#/lib/system/types/gear/gearData.ts"
import type { ImplantData } from "#/lib/system/types/gear/implantData.ts"
import type { LicenseData } from "#/lib/system/types/gear/licenseData.ts"
import { VerificationKind } from "#/lib/system/types/gear/licenseData.ts"
import type { VehicleData } from "#/lib/system/types/gear/vehicleData.ts"
import type {
  FirearmAccessoryData,
  FirearmData,
} from "#/lib/system/types/gear/weaponData.ts"
import { FirearmType, WeaponType } from "#/lib/system/types/gear/weaponData.ts"
import { GearEffectType } from "#/lib/system/types/gearEffectData.ts"
import type { CharacterSheet } from "#/lib/system/types/playerCharacterData.ts"

export const artemis: CharacterSheet = {
  id: "artemis",
  version: "1.0.0",

  biology: {
    metatype: MetatypeKey.Elf,
    awakening: AwakeningType.Mundane,
  },

  profile: {
    alias: "Artemis",
    name: "Jessica Nelson",
    archetype: "Rigger",
    streetCred: 0,
    notoriety: 0,
    description: [
      "Legacy qualities: Exceptional (logic), Aptitude (engineering), Photographic Memory, Analytical Mind, Ambidextrous, Social Stress: Large Groups.",
      "Legacy contacts: James Serif (Drone Parts Dealer, C2/L2), Frank (Matrix Developer, C2/L2), George Crabtree (Lone Star officer, C2/L2).",
      "Legacy notes: Rigger focused on drones, engineering and piloting. Converted from legacy SR4 data; gear, weapons and augments migrated from legacy modules.",
    ].join("\n"),
    lifestyle: {
      quality: LifestyleType.Low,
      cost: 5000,
      monthsPaid: 3,
    },
  },

  karma: {
    total: 12,
    current: 12,
  },

  nuyen: {
    current: -14535,
    loans: [
      {
        lender: "Slicus",
        amount: 40000,
        notes: "Migrated from nuyen log entry: Loan from Slicus.",
      },
    ],
  },

  attributes: {
    body: 2,
    agility: 6,
    reaction: 5,
    strength: 3,
    charisma: 2,
    intuition: 5,
    logic: 7,
    willpower: 1,
    edge: 4,
    essence: 6,
    magic: 0,
    resonance: 0,
  },

  edge: {
    current: 4,
  },

  damage: {
    physical: { current: 0, max: 9 },
    stun: { current: 0, max: 9 },
    matrix: { current: 0, max: 0 },
  },

  gear: Object.fromEntries(
    (
      [
        createGear<SinData>({
          name: "Sara McCabe",
          type: GearType.sin,
          notes: "General use SIN.",
          verification: { kind: VerificationKind.Fake, rating: 6 },
        }),
        createGear<SinData>({
          name: "Jadzia Dax",
          type: GearType.sin,
          notes: "Runner SIN.",
          verification: { kind: VerificationKind.Fake, rating: 4 },
          licenses: [
            createGear<LicenseData>({
              name: "Driver License (Semi-Truck)",
              type: GearType.license,
              fixed: true,
              verification: { kind: VerificationKind.Fake, rating: 5 },
            }),
          ],
        }),
        createGear<SinData>({
          name: "Jane Smith",
          type: GearType.sin,
          notes: "Burner SIN.",
          verification: { kind: VerificationKind.Fake, rating: 2 },
        }),
        createFirearm({
          name: "FN P93 Predator",
          firearmType: FirearmType.lightPistol,
          attribute: AttributeKey.agility,
          skill: "Firearms",
          dmg: "4P",
          ranges: {
            extreme: 0,
            long: 0,
            medium: 0,
            short: 0,
          },
          recoil: 0,
          firemodes: ["SA", "BF", "FA"],
          ammo: {
            size: 50,
            remaining: 50,
            type: "clip",
          },
          attachments: {
            mounts: {
              top: createGear<FirearmAccessoryData>({
                name: "Laser sight",
                type: GearType.firearmAccessory,
                mountPoints: ["top", "under"],
              }),
              under: createGear<FirearmAccessoryData>({
                name: "Flashlight",
                type: GearType.firearmAccessory,
                mountPoints: ["top", "under"],
              }),
            },
            internal: [
              createGear<FirearmAccessoryData>({
                name: "Rigid Stock",
                type: GearType.firearmAccessory,
                fixed: true,
                enabled: true,
                mountPoints: ["internal"],
                effects: [
                  {
                    type: GearEffectType.recoilReduction,
                    value: 1,
                  },
                ],
              }),
              createGear<FirearmAccessoryData>({
                name: "Smart Gun Int.",
                type: GearType.firearmAccessory,
                fixed: true,
                notes: "Wireless bonus.",
                mountPoints: ["internal"],
              }),
            ],
          },
        }),
        createGear<FirearmData>({
          ammo: { remaining: 11, size: 11, type: "clip" },
          dmg: "2P",
          firemodes: ["SA"],
          ranges: { extreme: 0, long: 0, medium: 0, short: 0 },
          recoil: 0,
          name: "Colt America L36",
          type: GearType.weapon,
          weaponType: WeaponType.firearm,
          firearmType: FirearmType.smg,
          skill: "Firearms",
          attribute: AttributeKey.agility,
          attachments: {
            internal: [
              createGear<FirearmAccessoryData>({
                name: "Smart Gun Int.",
                type: GearType.firearmAccessory,
                fixed: true,
                notes: "Wireless bonus.",
                mountPoints: ["internal"],
              }),
            ],
          },
        }),
        createGear<ArmorData>({
          name: "Armored Jacket",
          type: GearType.armor,
          equipped: true,
          ballistic: 8,
          impact: 6,
        }),
        createGear<ArmorData>({
          name: "Form-Fitting Body Armor",
          type: GearType.armor,
          equipped: true,
          ballistic: 2,
          impact: 1,
          notes: "Worn under tailored outfits.",
        }),
        createGear<ImplantData>({
          name: "Control Rig",
          type: GearType.implant,
          implantType: "cyberware",
          location: "head",
          cost: 72000,
          rating: 2,
          essenceCost: 1.6,
          notes: "Used for slaving drones/RCC.",
        }),
        createGear<ImplantData>({
          essenceCost: 0,
          name: "RCC Headwear",
          type: GearType.implant,
          implantType: "cyberware",
          location: "head",
          cost: 2000,
          notes: "Capacity cost 3.",
        }),
        createGear<ImplantData>({
          essenceCost: 0,
          name: "Cybereyes",
          type: GearType.implant,
          implantType: "cyberware",
          grade: "alpha",
          cost: 12000,
          location: "eyes",
          capacity: 12,
          attachments: [
            createGear({
              name: "Smartlink",
              type: "cyberware",
              cost: 4800,
              notes: "Capacity cost 3.",
            }),
            createGear({ name: "Imagelink", type: "cyberware", cost: 960 }),
            createGear({
              name: "Low-Light Vision",
              type: "cyberware",
              cost: 900,
            }),
            createGear({
              name: "Vision Enhancement",
              type: "cyberware",
              cost: 4800,
            }),
            createGear({
              name: "Vision Magnification",
              type: "cyberware",
              cost: 2400,
            }),
          ],
        }),
        createGear<ImplantData>({
          name: "Cerebral Booster",
          type: GearType.implant,
          implantType: "bioware",
          grade: "standard",
          essenceCost: 0.66,
          rating: 3,
          cost: 47250,
          location: "head",
          effects: [
            {
              type: GearEffectType.attrBonus,
              target: AttributeKey.logic,
              value: 3,
            },
          ],
        }),
        createGear<ImplantData>({
          name: "Sleep Regulator",
          type: GearType.implant,
          implantType: "bioware",
          cost: 6000,
          essenceCost: 0.11,
          location: "head",
          notes: "Reduces sleep requirement.",
        }),
        createGear<ImplantData>({
          name: "Synaptic Booster",
          type: GearType.implant,
          implantType: "bioware",
          grade: "standard",
          essenceCost: 0.66,
          cost: 95000,
          rating: 2,
          location: "head",
          effects: [
            {
              type: GearEffectType.attrBonus,
              target: AttributeKey.reaction,
              value: 2,
            },
            {
              type: GearEffectType.initiativeBonus,
              value: 2,
            },
          ],
        }),
        createGear({
          name: "Proteus Poseidon",
          type: GearType.device,
          cost: 68000,
          notes:
            "RCC; deviceRating 5, dataProcessing 5, firewall 5. Autosofts: FN-HAR Targeting r8, Clearsight r8, Evasion r8, Maneuvering r8, Electronic Warfare r8, Black Knight Targeting r8.",
        }),
        createGear({
          name: "Commlink (headware)",
          type: GearType.device,
          cost: 1000,
          notes: "Hermes Ikon (fixed); device attributes 3/0; 2 program slots.",
        }),
        createGear<VehicleData>({
          name: "Yamaha Growler",
          type: GearType.vehicle,
          damage: { physical: { current: 0, max: 0 } },
          model: "",
          seats: 0,
          vehicleType: "bike",
          handling: 2,
          accel: "15/40",
          speed: 150,
          pilot: 1,
          body: 6,
          armor: 6,
          sensor: 1,
          cost: 5500,
        }),
        createGear<VehicleData>({
          name: "Russian Osprey 9",
          type: GearType.vehicle,
          vehicleType: "vtol",
          handling: 3,
          accel: "10/30",
          speed: 120,
          pilot: 2,
          body: 16,
          armor: 8,
          sensor: 1,
          availability: { rating: 16, restricted: true },
        }),
        createGear({
          name: "Engineering Shop",
          type: GearType.other,
          cost: 5000,
        }),
      ] satisfies GearData[]
    ).map((item) => [item.id, item]),
  ),

  skills: {
    Firearms: {
      name: "Firearms",
      category: "active",
      rating: 5,
      linkedAttribute: AttributeKey.agility,
      specialization: "Submachine Guns",
    },
    Piloting: {
      name: "Piloting",
      category: "active",
      rating: 5,
      linkedAttribute: AttributeKey.agility,
      specialization: "Aircraft",
    },
    Engineering: {
      name: "Engineering",
      category: "active",
      rating: 7,
      linkedAttribute: AttributeKey.logic,
      specialization: "Automotive Mechanic",
    },
    Perception: {
      name: "Perception",
      category: "active",
      rating: 1,
      linkedAttribute: AttributeKey.intuition,
    },
    Athletics: {
      name: "Athletics",
      category: "active",
      rating: 1,
      linkedAttribute: AttributeKey.agility,
    },
    English: {
      name: "English",
      category: "language",
      rating: 6,
      linkedAttribute: AttributeKey.intuition,
    },
    Elven: {
      name: "Elven",
      category: "language",
      rating: 1,
      linkedAttribute: AttributeKey.intuition,
    },
    "Drone Models": {
      name: "Drone Models",
      category: "knowledge",
      rating: 1,
      linkedAttribute: AttributeKey.logic,
    },
    "80/90s Pop Culture": {
      name: "80/90s Pop Culture",
      category: "knowledge",
      rating: 1,
      linkedAttribute: AttributeKey.logic,
    },
    "Trideo Series": {
      name: "Trideo Series",
      category: "knowledge",
      rating: 1,
      linkedAttribute: AttributeKey.logic,
    },
    "Security Systems": {
      name: "Security Systems",
      category: "knowledge",
      rating: 1,
      linkedAttribute: AttributeKey.logic,
    },
    "Virtual Nightclubs": {
      name: "Virtual Nightclubs",
      category: "knowledge",
      rating: 1,
      linkedAttribute: AttributeKey.logic,
    },
    "Tech Companies": {
      name: "Tech Companies",
      category: "knowledge",
      rating: 1,
      linkedAttribute: AttributeKey.logic,
    },
  },

  qualities: [],
  contacts: [],
}
