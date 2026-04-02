import type { ItemData } from "#/lib/system/ItemData.ts"
import { createItem, createItemMap } from "#/lib/system/ItemData.ts"
import { LifestyleType } from "#/lib/system/LifestyleType"
import { MetatypeType } from "#/lib/system/MetatypeData.ts"
import { SkillGroupKey } from "#/lib/system/SkillGroupKey.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import { GameEffectType } from "#/lib/system/gameEffectData.ts"
import type { SinData } from "#/lib/system/gear/SinData.ts"
import type { ArmorData } from "#/lib/system/gear/armorData.ts"
import type { DeviceData } from "#/lib/system/gear/deviceData.ts"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import { ImplantGrade, ImplantLocation } from "#/lib/system/gear/implantData.ts"
import type { LicenseData } from "#/lib/system/gear/licenseData.ts"
import type { SoftwareData } from "#/lib/system/gear/softwareData.ts"
import type { VehicleData } from "#/lib/system/gear/vehicleData.ts"
import type { FirearmAccessoryData, FirearmData } from "#/lib/system/gear/weaponData.ts"
import { FirearmAttachmentPoint, WeaponType } from "#/lib/system/gear/weaponData.ts"
import { FirearmTypeKey } from "#/lib/system/gear/weapons/firearms/firearm-type-key.ts"
import { GearType } from "#/lib/system/gearType.ts"

export const Artemis: CharacterSheet = {
  id: "5e5b9ece-f1f8-455f-b4fe-9b47758c49b0",
  version: "0.2.0",

  biology: {
    metatype: MetatypeType.Elf,
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
    physical: 0,
    stun: 0,
    matrix: 0,
  },

  qualities: [],
  adeptPowers: [],
  spells: [],
  sprites: [],
  complexForms: [],

  gear: createItemMap(
    createItem<SinData>({
      name: "Sara McCabe",
      itemType: GearType.sin,
      notes: "General use SIN.",
      rating: 6,
    }),
    createItem<SinData>({
      name: "Jadzia Dax",
      itemType: GearType.sin,
      notes: "Runner SIN.",
      rating: 4,
    }, [
      createItem<LicenseData>({
        name: "Driver License (Semi-Truck)",
        itemType: GearType.license,
        fixed: true,
        rating: 5,
      }),
    ]),
    createItem<SinData>({
      name: "Jane Smith",
      itemType: GearType.sin,
      notes: "Burner SIN.",
      rating: 2,
    }),
    createItem<FirearmData>({
      name: "FN P93 Predator",
      itemType: GearType.weapon,
      weaponType: WeaponType.firearm,
      firearmType: FirearmTypeKey.lightPistol,
      attribute: AttributeKey.agility,
      skill: "Firearms",
      dmg: "4P",
      recoil: 0,
      firemodes: ["SA", "BF", "FA"],
      ammo: {
        size: 50,
        remaining: 50,
        type: "clip",
      },
    }, [
      createItem<FirearmAccessoryData>({
        name: "Laser sight",
        itemType: GearType.firearmAccessory,
        mountPoints: [FirearmAttachmentPoint.Top, FirearmAttachmentPoint.Under],
        parentSlot: FirearmAttachmentPoint.Top,
      }),
      createItem<FirearmAccessoryData>({
        name: "Flashlight",
        itemType: GearType.firearmAccessory,
        mountPoints: [FirearmAttachmentPoint.Top, FirearmAttachmentPoint.Under],
        parentSlot: FirearmAttachmentPoint.Under,
      }),
      createItem<FirearmAccessoryData>({
        name: "Rigid Stock",
        itemType: GearType.firearmAccessory,
        fixed: true,
        enabled: true,
        mountPoints: [FirearmAttachmentPoint.Internal],
        parentSlot: FirearmAttachmentPoint.Internal,
        effects: [
          {
            type: GameEffectType.recoilReduction,
            value: 1,
          },
        ],
      }),
      createItem<FirearmAccessoryData>({
        name: "Smart Gun Int.",
        itemType: GearType.firearmAccessory,
        fixed: true,
        notes: "Wireless bonus.",
        mountPoints: [FirearmAttachmentPoint.Internal],
        parentSlot: FirearmAttachmentPoint.Internal,
      }),
    ]),
    createItem<FirearmData>({
      ammo: { remaining: 11, size: 11, type: "clip" },
      dmg: "2P",
      firemodes: ["SA"],
      recoil: 0,
      name: "Colt America L36",
      itemType: GearType.weapon,
      weaponType: WeaponType.firearm,
      firearmType: FirearmTypeKey.smg,
      skill: "Firearms",
      attribute: AttributeKey.agility,
    }, [
      createItem<FirearmAccessoryData>({
        name: "Smart Gun Int.",
        itemType: GearType.firearmAccessory,
        fixed: true,
        notes: "Wireless bonus.",
        mountPoints: [FirearmAttachmentPoint.Internal],
        parentSlot: FirearmAttachmentPoint.Internal,
      }),
    ]),
    createItem<ArmorData>({
      name: "Armored Jacket",
      itemType: GearType.armor,
      equipped: true,
      ballistic: 8,
      impact: 6,
    }),
    createItem<ArmorData>({
      name: "Form-Fitting Body Armor",
      itemType: GearType.armor,
      equipped: true,
      ballistic: 2,
      impact: 1,
      notes: "Worn under tailored outfits.",
    }),
    createItem<ImplantData>({
      name: "Control Rig",
      itemType: GearType.implant,
      implantType: "cyberware",
      location: ImplantLocation.head,
      cost: 72000,
      rating: 2,
      essenceCost: 1.6,
      notes: "Used for slaving drones/RCC.",
    }),
    createItem<ImplantData>({
      essenceCost: 0,
      name: "RCC Headwear",
      itemType: GearType.implant,
      implantType: "cyberware",
      location: ImplantLocation.head,
      cost: 2000,
      notes: "Capacity cost 3.",
    }),
    createItem<ImplantData>({
      essenceCost: 0,
      name: "Cybereyes",
      itemType: GearType.implant,
      implantType: "cyberware",
      grade: ImplantGrade.alpha,
      cost: 12000,
      location: ImplantLocation.eyes,
      capacity: 12,
    }, [
      createItem<ImplantData>({
        itemType: GearType.implant,
        name: "Smartlink",
        cost: 4800,
        capacityCost: 3,
        essenceCost: 0,
      }),
      createItem<ImplantData>({
        itemType: GearType.implant,
        name: "Imagelink",
        cost: 960,
        capacityCost: 0,
        essenceCost: 0,
      }),
      createItem<ImplantData>({
        itemType: GearType.implant,
        name: "Low-Light Vision",
        cost: 900,
        capacityCost: 0,
        essenceCost: 0,
      }),
      createItem<ImplantData>({
        itemType: GearType.implant,
        name: "Vision Enhancement",
        cost: 4800,
        capacityCost: 0,
        essenceCost: 0,
      }),
      createItem<ImplantData>({
        itemType: GearType.implant,
        name: "Vision Magnification",
        cost: 2400,
        capacityCost: 0,
        essenceCost: 0,
      }),
    ]),
    createItem<ImplantData>({
      name: "Cerebral Booster",
      itemType: GearType.implant,
      implantType: "bioware",
      grade: ImplantGrade.standard,
      essenceCost: 0.66,
      rating: 3,
      cost: 47250,
      location: ImplantLocation.head,
      effects: [
        {
          type: GameEffectType.attrBonus,
          target: AttributeKey.logic,
          value: 3,
        },
      ],
    }),
    createItem<ImplantData>({
      name: "Sleep Regulator",
      itemType: GearType.implant,
      implantType: "bioware",
      cost: 6000,
      essenceCost: 0.11,
      location: ImplantLocation.head,
      notes: "Reduces sleep requirement.",
    }),
    createItem<ImplantData>({
      name: "Synaptic Booster",
      itemType: GearType.implant,
      implantType: "bioware",
      grade: ImplantGrade.standard,
      essenceCost: 0.66,
      cost: 95000,
      rating: 2,
      location: ImplantLocation.head,
      effects: [
        {
          type: GameEffectType.attrBonus,
          target: AttributeKey.reaction,
          value: 2,
        },
        {
          type: GameEffectType.initiativeBonus,
          value: 2,
        },
      ],
    }),
    createItem<DeviceData>({
      name: "Proteus Poseidon",
      itemType: GearType.device,
      cost: 68000,
      notes: "RCC; deviceRating 5, dataProcessing 5, firewall 5.",
    }, [
      createItem<SoftwareData>({
        name: "FN-HAR Targeting Autosoft",
        itemType: GearType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Clearsight Autosoft",
        itemType: GearType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Evasion Autosoft",
        itemType: GearType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Maneuvering Autosoft",
        itemType: GearType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Electronic Warfare Autosoft",
        itemType: GearType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Black Knight Targeting Autosoft",
        itemType: GearType.software,
        cost: 4000,
        rating: 8,
      }),
    ]),
    createItem<DeviceData>({
      name: "Commlink (headware)",
      itemType: GearType.device,
      cost: 1000,
    }, [
      createItem<DeviceData>({
        name: "Hermes Ikon",
        itemType: GearType.device,
        cost: 5000,
        fixed: true,
        rating: 5,
        notes: "device attributes 3/0; 2 program slots.",
      }),
    ]),
    createItem<VehicleData>({
      name: "Yamaha Growler",
      itemType: GearType.vehicle,
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
    createItem<VehicleData>({
      name: "Russian Osprey 9",
      itemType: GearType.vehicle,
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
    createItem<ItemData>({
      name: "Engineering Shop",
      itemType: GearType.other,
      cost: 5000,
    }),
  ),

  skills: {
    activeSkills: [
      {
        name: SkillKey.automatics,
        rating: 5,
        specialization: "Submachine Guns",
      },
      {
        name: SkillKey.pilotAircraft,
        rating: 5,
      },
      {
        name: SkillKey.autoMechanic,
        rating: 7,
      },
      {
        name: SkillKey.perception,
        rating: 1,
      },
    ],
    skillGroups: [
      {
        name: SkillGroupKey.Athletics,
        rating: 1,
      },
    ],
    knowledgeSkills: [
      {
        name: "Drone Models",
        rating: 1,
      },
      {
        name: "80/90s Pop Culture",
        rating: 1,
      },
      {
        name: "Trideo Series",
        rating: 1,
      },
      {
        name: "Security Systems",
        rating: 1,
      },
      {
        name: "Virtual Nightclubs",
        rating: 1,
      },
      {
        name: "Tech Companies",
        rating: 1,
      },
    ],
    languageSkills: [
      {
        name: "English",
        rating: "native",
      },
      {
        name: "Elven",
        rating: 3,
      },
    ],
  },

  contacts: [],
}
