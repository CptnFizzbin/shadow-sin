import { CURRENT_RUNNER_VERSION } from "#/data/migrations.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantLocation } from "#/system/gear/implantData.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { SoftwareData } from "#/system/gear/softwareData.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { FirearmAccessoryData, FirearmData } from "#/system/gear/weaponData.ts"
import { FirearmAttachmentPoint, WeaponType } from "#/system/gear/weaponData.ts"
import { FirearmTypeKey } from "#/system/gear/weapons/firearms/firearmTypeKey.ts"
import type { ItemData } from "#/system/itemData.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { LifestyleType } from "#/system/lifestyleType.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

// Licenses are hoisted above the fixture object so their generated ids can be wired into a
// licensed item's `licenseId` below, while still being attached under their owning SIN.
const sarahFirearmsLicense = createItem<LicenseData>({
  name: "Firearms License",
  itemType: ItemType.license,
  rating: 4,
})
const sarahArmorLicense = createItem<LicenseData>({
  name: "Armor License",
  itemType: ItemType.license,
  rating: 5,
})
const driverLicenseSemiTruck = createItem<LicenseData>({
  name: "Driver License (Semi-Truck)",
  itemType: ItemType.license,
  fixed: true,
  rating: 5,
})
const janeMeleeLicense = createItem<LicenseData>({
  name: "Melee Weapon License",
  itemType: ItemType.license,
  rating: 3,
})

export const Artemis: RunnerData = {
  id: "5e5b9ece-f1f8-455f-b4fe-9b47758c49b0",
  _meta_: { version: CURRENT_RUNNER_VERSION },

  biology: {
    metatype: MetatypeType.Elf,
    awakening: AwakeningType.Mundane,
    gender: null,
    age: null,
    weight: null,
    height: null,
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
      "Legacy notes: Rigger focused on drones, engineering and piloting. Converted from legacy SR4A data; gear, weapons and augments migrated from legacy modules.",
    ].join("\n"),
    personality: null,
    lifestyle: {
      quality: LifestyleType.Low,
      monthsPaid: 3,
    },
  },

  initiative: {
    passesCompleted: [],
  },

  tradition: null,

  featureFlags: {},

  karma: {
    total: 12,
    current: 12,
    log: [],
  },

  nuyen: {
    current: -14535,
    loans: [
      {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        lender: "Slicus",
        amount: 40000,
        interestRate: 0,
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
  powers: [],
  spells: [],
  sprites: [],
  complexForms: [],
  spirits: [],

  gear: createItemMap(
    createItem<SinData>({
      name: "Sara McCabe",
      itemType: ItemType.sin,
      notes: "General use SIN.",
      rating: 6,
    }, [
      sarahFirearmsLicense,
      sarahArmorLicense,
    ]),
    createItem<SinData>({
      name: "Jadzia Dax",
      itemType: ItemType.sin,
      notes: "Runner SIN.",
      rating: 4,
    }, [
      driverLicenseSemiTruck,
    ]),
    createItem<SinData>({
      name: "Jane Smith",
      itemType: ItemType.sin,
      notes: "Burner SIN.",
      rating: 2,
    }, [
      janeMeleeLicense,
    ]),
    createItem<FirearmData>({
      name: "FN P93 Predator",
      itemType: ItemType.weapon,
      weaponType: WeaponType.firearm,
      firearmType: FirearmTypeKey.lightPistol,
      attribute: AttributeKey.agility,
      skill: SkillKey.pistols,
      dmg: "4P",
      equipped: true,
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
        itemType: ItemType.firearmAccessory,
        mountPoints: [FirearmAttachmentPoint.Top, FirearmAttachmentPoint.Under],
        parentSlot: FirearmAttachmentPoint.Top,
      }),
      createItem<FirearmAccessoryData>({
        name: "Flashlight",
        itemType: ItemType.firearmAccessory,
        mountPoints: [FirearmAttachmentPoint.Top, FirearmAttachmentPoint.Under],
        parentSlot: FirearmAttachmentPoint.Under,
      }),
      createItem<FirearmAccessoryData>({
        name: "Rigid Stock",
        itemType: ItemType.firearmAccessory,
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
        itemType: ItemType.firearmAccessory,
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
      itemType: ItemType.weapon,
      weaponType: WeaponType.firearm,
      firearmType: FirearmTypeKey.smg,
      skill: SkillKey.automatics,
      attribute: AttributeKey.agility,
    }, [
      createItem<FirearmAccessoryData>({
        name: "Smart Gun Int.",
        itemType: ItemType.firearmAccessory,
        fixed: true,
        notes: "Wireless bonus.",
        mountPoints: [FirearmAttachmentPoint.Internal],
        parentSlot: FirearmAttachmentPoint.Internal,
      }),
    ]),
    createItem<ArmorData>({
      name: "Armored Jacket",
      itemType: ItemType.armor,
      equipped: true,
      ballistic: 8,
      impact: 6,
    }),
    createItem<ArmorData>({
      name: "Form-Fitting Body Armor",
      itemType: ItemType.armor,
      equipped: true,
      ballistic: 2,
      impact: 1,
      notes: "Worn under tailored outfits.",
    }),
    createItem<ImplantData>({
      name: "Control Rig",
      itemType: ItemType.implant,
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
      itemType: ItemType.implant,
      implantType: "cyberware",
      location: ImplantLocation.head,
      cost: 2000,
      notes: "Capacity cost 3.",
    }),
    createItem<ImplantData>({
      essenceCost: 0,
      name: "Cybereyes",
      itemType: ItemType.implant,
      implantType: "cyberware",
      grade: ImplantGrade.alpha,
      cost: 12000,
      location: ImplantLocation.eyes,
      capacity: 12,
    }, [
      createItem<ImplantData>({
        itemType: ItemType.implant,
        name: "Smartlink",
        cost: 4800,
        capacityCost: 3,
        essenceCost: 0,
      }),
      createItem<ImplantData>({
        itemType: ItemType.implant,
        name: "Imagelink",
        cost: 960,
        capacityCost: 0,
        essenceCost: 0,
      }),
      createItem<ImplantData>({
        itemType: ItemType.implant,
        name: "Low-Light Vision",
        cost: 900,
        capacityCost: 0,
        essenceCost: 0,
      }),
      createItem<ImplantData>({
        itemType: ItemType.implant,
        name: "Vision Enhancement",
        cost: 4800,
        capacityCost: 0,
        essenceCost: 0,
      }),
      createItem<ImplantData>({
        itemType: ItemType.implant,
        name: "Vision Magnification",
        cost: 2400,
        capacityCost: 0,
        essenceCost: 0,
      }),
    ]),
    createItem<ImplantData>({
      name: "Cerebral Booster",
      itemType: ItemType.implant,
      implantType: "bioware",
      grade: ImplantGrade.standard,
      essenceCost: 0.66,
      rating: 3,
      cost: 47250,
      location: ImplantLocation.head,
      effects: [
        {
          type: GameEffectType.attrMod,
          target: AttributeKey.logic,
          value: +3,
        },
      ],
    }),
    createItem<ImplantData>({
      name: "Sleep Regulator",
      itemType: ItemType.implant,
      implantType: "bioware",
      cost: 6000,
      essenceCost: 0.11,
      location: ImplantLocation.head,
      notes: "Reduces sleep requirement.",
    }),
    createItem<ImplantData>({
      name: "Synaptic Booster",
      itemType: ItemType.implant,
      implantType: "bioware",
      grade: ImplantGrade.standard,
      essenceCost: 0.66,
      cost: 95000,
      rating: 2,
      location: ImplantLocation.head,
      effects: [
        {
          type: GameEffectType.attrMod,
          target: AttributeKey.reaction,
          value: +2,
        },
        {
          type: GameEffectType.initiativeBonus,
          value: +2,
        },
      ],
    }),
    createItem<DeviceData>({
      name: "Proteus Poseidon",
      itemType: ItemType.device,
      cost: 68000,
      notes: "RCC; deviceRating 5, dataProcessing 5, firewall 5.",
    }, [
      createItem<SoftwareData>({
        name: "FN-HAR Targeting Autosoft",
        itemType: ItemType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Clearsight Autosoft",
        itemType: ItemType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Evasion Autosoft",
        itemType: ItemType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Maneuvering Autosoft",
        itemType: ItemType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Electronic Warfare Autosoft",
        itemType: ItemType.software,
        cost: 4000,
        rating: 8,
      }),
      createItem<SoftwareData>({
        name: "Black Knight Targeting Autosoft",
        itemType: ItemType.software,
        cost: 4000,
        rating: 8,
      }),
    ]),
    createItem<DeviceData>({
      name: "Commlink (headware)",
      itemType: ItemType.device,
      cost: 1000,
    }, [
      createItem<DeviceData>({
        name: "Hermes Ikon",
        itemType: ItemType.device,
        cost: 5000,
        fixed: true,
        rating: 5,
        notes: "device attributes 3/0; 2 program slots.",
      }),
    ]),
    createItem<VehicleData>({
      name: "Yamaha Growler",
      itemType: ItemType.vehicle,
      vehicleCategory: VehicleCategory.vehicle,
      damage: { physical: 0 },
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
      itemType: ItemType.vehicle,
      vehicleCategory: VehicleCategory.vehicle,
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
      itemType: ItemType.other,
      cost: 5000,
    }),

    // Unrestricted gear — no availability restrictions, never appears in a License Check lane.
    createItem<ItemData>({
      name: "Survival Kit",
      itemType: ItemType.other,
      cost: 500,
    }),
    createItem<ItemData>({
      name: "Micro-Recorder",
      itemType: ItemType.other,
      cost: 100,
    }),
    createItem<ItemData>({
      name: "Grapple Gun",
      itemType: ItemType.other,
      cost: 400,
    }),
    createItem<ItemData>({
      name: "Medkit (Rating 6)",
      itemType: ItemType.other,
      cost: 1000,
      rating: 6,
    }),

    // Restricted gear licensed to a SIN — one lane check per SIN below.
    createItem<ItemData>({
      name: "Ares Alpha Combat Gun",
      itemType: ItemType.other,
      cost: 22000,
      availability: { rating: 11, restricted: true },
      licenseId: sarahFirearmsLicense[0].id,
      notes: "Full-auto assault rifle w/ underslung grenade launcher. Licensed to Sara McCabe.",
    }),
    createItem<ArmorData>({
      name: "Secure Tech Full-Body Armor",
      itemType: ItemType.armor,
      ballistic: 12,
      impact: 10,
      cost: 14000,
      availability: { rating: 14, restricted: true },
      licenseId: sarahArmorLicense[0].id,
      notes: "Licensed to Sara McCabe.",
    }),
    createItem<VehicleData>({
      name: "Freightliner Superhauler",
      itemType: ItemType.vehicle,
      vehicleCategory: VehicleCategory.vehicle,
      vehicleType: "truck",
      handling: 2,
      accel: "8/20",
      speed: 90,
      pilot: 1,
      body: 18,
      armor: 6,
      sensor: 2,
      cost: 90000,
      availability: { rating: 8, restricted: true },
      licenseId: driverLicenseSemiTruck[0].id,
      notes: "Licensed under Jadzia Dax's Semi-Truck driver license.",
    }),
    createItem<ItemData>({
      name: "Collapsible Stun Baton",
      itemType: ItemType.other,
      cost: 400,
      availability: { rating: 6, restricted: true },
      licenseId: janeMeleeLicense[0].id,
      notes: "Licensed to Jane Smith.",
    }),

    // Restricted gear with no license on file — routes to the Unlicensed Gear lane.
    createItem<ItemData>({
      name: "Sawed-Off Shotgun",
      itemType: ItemType.other,
      cost: 300,
      availability: { rating: 4, restricted: true },
    }),
    createItem<ItemData>({
      name: "Sound Suppressor",
      itemType: ItemType.other,
      cost: 500,
      availability: { rating: 6, restricted: true },
    }),
    createItem<ItemData>({
      name: "Black-Market Cyberdeck Firmware",
      itemType: ItemType.other,
      cost: 2000,
      availability: { rating: 10, restricted: true },
    }),

    // Forbidden gear — always routes to the Forbidden Gear lane, no license path exists.
    createItem<ItemData>({
      name: "Fragmentation Grenades (x3)",
      itemType: ItemType.other,
      quantity: 3,
      cost: 900,
      availability: { rating: 11, forbidden: true },
    }),
    createItem<ItemData>({
      name: "Full-Auto Assault Cannon",
      itemType: ItemType.other,
      cost: 32000,
      availability: { rating: 14, forbidden: true },
    }),
    createItem<ImplantData>({
      name: "Move-by-Wire System",
      itemType: ItemType.implant,
      implantType: "cyberware",
      grade: ImplantGrade.standard,
      essenceCost: 3,
      rating: 2,
      cost: 480000,
      availability: { rating: 20, forbidden: true },
      notes: "Military-grade; illegal for civilian use.",
    }),
    createItem<ItemData>({
      name: "Anthrax Culture Sample",
      itemType: ItemType.other,
      cost: 5000,
      availability: { rating: 24, forbidden: true },
      notes: "Bioweapon precursor.",
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

  initiateGrade: 0,
  submersionGrade: 0,
}
