import { AwakenedType } from "../../../Character/AwakenedType"
import { CharacterAttr } from "../../../Character/CharacterAttr"
import { CharacterData } from "../../../Character/CharacterData"
import { CharacterPoolTypes } from "../../../Character/CharacterPoolTypes"
import { ArmorAttr } from "../../../Gear/Armor/ArmorAttr"
import { ArmorData } from "../../../Gear/Armor/ArmorData"
import { AugmentAttr } from "../../../Gear/Augments/AugmentAttr"
import {
  AugmentData,
  AugmentGrade,
  AugmentSlot,
} from "../../../Gear/Augments/AugmentData"
import { CommlinkAttr } from "../../../Gear/Commlink/CommlinkAttr"
import { GearData, GearType } from "../../../Gear/GearData"
import { KitAttr } from "../../../Gear/Kit/KitAttr"
import { KitType } from "../../../Gear/Kit/KitType"
import { LicenseAttr } from "../../../Gear/License/LicenseAttr"
import { SinAttr } from "../../../Gear/License/SinAttr"
import { SinData } from "../../../Gear/License/SinData"
import { OtherGearAttr } from "../../../Gear/OtherGearData"
import { VehicleAttr } from "../../../Gear/Vehicles/VehicleAttr"
import { VehicleData } from "../../../Gear/Vehicles/VehicleData"
import { ModType } from "../../../Gear/Vehicles/VehicleModData"
import { WeaponPoolKeys } from "../../../Gear/Weapons/DicePools"
import { WeaponAttr } from "../../../Gear/Weapons/WeaponAttr"
import { WeaponData } from "../../../Gear/Weapons/WeaponData"
import {
  WeaponModData,
  WeaponModSlot,
} from "../../../Gear/Weapons/WeaponModData"
import { toCharQuality } from "../../../Qualities/CharacterQuality"
import { Qualities, QualityIds } from "../../../Qualities/Quality"
import { ActiveSkillIds, SkillType, Specializations } from "../../../Skills"
import { EffectType } from "../../../System/Effect"
import { addGear } from "../index"
import { karma } from "./karma"
import { nuyen } from "./nuyen"

export const Silicus: CharacterData = {
  dataVersion: 3,

  bio: {
    name: "Silicus",
    metatype: "Elf",
    awakened: AwakenedType.Mundane,
    gender: "male",
    role: "Street Samurai",
  },

  karma,
  nuyen,

  lifestyle: {
    grade: "middle",
    upkeep: 5_000,
    prepaid: 3,
  },

  attributes: {
    [CharacterAttr.body]: 4,
    [CharacterAttr.agility]: 8,
    [CharacterAttr.reaction]: 2,
    [CharacterAttr.strength]: 1,
    [CharacterAttr.willpower]: 1,
    [CharacterAttr.logic]: 5,
    [CharacterAttr.intuition]: 4,
    [CharacterAttr.charisma]: 3,
    [CharacterAttr.edge]: 4,
    [CharacterAttr.magic]: 0,
    [CharacterAttr.resonance]: 0,
    [CharacterAttr.essence]: 6,
  },

  contacts: [
    {
      name: "Hunter Morgan",
      connection: 3,
      loyalty: 3,
      description: "Researcher at Kamino Biotech",
    },
    {
      name: "Johennes",
      connection: 3,
      loyalty: 3,
      description: "Fence",
    },
    {
      name: "Dr. Weber",
      connection: 3,
      loyalty: 3,
      description: "Ripperdoc",
    },
  ],

  skills: [
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.biotech,
      rank: 5,
      expertise: Specializations.CRB.Biotech.FirstAid,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.firearms,
      rank: 6,
      specialization: Specializations.CRB.Firearms.SubmachineGuns,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.perception,
      rank: 3,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.closeCombat,
      rank: 5,
    },
    {
      type: SkillType.active,
      id: ActiveSkillIds.CRB.athletics,
      rank: 1,
    },
    {
      type: SkillType.language,
      name: "English",
      rank: "native",
    },
    {
      type: SkillType.knowledge,
      name: "Law Enforcement Corps",
    },
    {
      type: SkillType.knowledge,
      name: "Security Systems",
    },
    {
      type: SkillType.knowledge,
      name: "Tech Companies",
    },
    {
      type: SkillType.knowledge,
      name: "Weapon Manufacturers",
    },
    {
      type: SkillType.knowledge,
      name: "Local Gangs",
    },
  ],

  gear: [],

  qualities: [
    toCharQuality(Qualities[QualityIds.CRB.analyticalMind]),
    toCharQuality(Qualities[QualityIds.CRB.exceptional], {
      type: CharacterAttr.agility,
    }),
  ],
}

const smartGunIntMod: WeaponModData = {
  id: null,
  source: { book: "CRB", page: 260 },
  gearType: GearType.weaponMod,
  name: "Smart Gun Int.",
  type: "Weapon Mod",
  cost: 500,

  slot: null,
  removable: false,
  wirelessBonus: {
    enabled: true,
    description:
      "You gain a +1 dice pool bonus. Gain a bonus Minor Action on a turn when " +
      "you use the Reload Smartgun or Change Device Mode actions to eject a " +
      "clip or change fire mode.",
  },
  effects: [
    {
      wireless: true,
      name: "Smart Gun",
      type: EffectType.dicePoolAdj,
      poolType: WeaponPoolKeys.basicAttack,
      value: 1,
    },
  ],
}

addGear<WeaponData>(
  Silicus,
  {
    id: "c77afa27-e7f2-4fa5-ab8f-53830ce79f1d",
    source: { book: "FSQ", page: 22 },
    gearType: GearType.weapon,
    name: "Ranger Arms AA-16",
    type: "Shotgun",
    avail: { rarity: 6, illegal: true },
    cost: 2_050,

    attributes: {
      [WeaponAttr.dv]: "5P",
      [WeaponAttr.modes]: "SA/BF/FA",
      [WeaponAttr.attackRatings]: "5/11/7/-/-",
      [WeaponAttr.ammo]: "12(c)",
    },

    skill: ActiveSkillIds.CRB.firearms,
    specialtyName: Specializations.CRB.Firearms.Shotguns,
  },
  [
    addGear(Silicus, {
      ...smartGunIntMod,
      id: "7be1a881-fa5a-4a24-83db-0d8f3af8e738",
      removable: false,
    }),
    addGear(Silicus, {
      id: "ac4025a9-3e0c-4702-971f-a52cc56100a0",
      source: { book: "FSQ", page: 22 },
      gearType: GearType.weaponMod,
      name: "Foregrip",
      type: "Weapon Mod",

      slot: null,
      removable: false,
    }),
    addGear(Silicus, {
      id: "c2c50d7e-ec56-469f-903c-a5d84a109779",
      source: { book: "FSQ", page: 71 },
      cost: 75,
      gearType: GearType.weaponMod,
      name: "Detachable Drum Magazine",
      type: "Weapon Mod",

      slot: WeaponModSlot.under,
    }),
    addGear(Silicus, {
      id: "c5abefe0-575b-4a5f-8e5f-a39723faffc8",
      source: { book: "CRB", page: 259 },
      gearType: GearType.weaponMod,
      name: "Gas Vent",
      type: "Weapon Mod",
      avail: { rarity: 3 },
      cost: 500,

      description:
        "Removes the attack rating penalty for Semi-Automatic fire, and reduces it to 2 for Burst Fire",

      slot: WeaponModSlot.barrel,
      removable: false,
    }),
  ],
)

addGear<WeaponData>(
  Silicus,
  {
    id: "d7aac7b6-6113-41e0-8087-53515753e9a3",
    source: { book: "CRB", page: 254 },
    gearType: GearType.weapon,
    name: "FN P93 Predator",
    type: "Submachine Gun",
    avail: { rarity: 4, license: true },
    cost: 925,

    attributes: {
      [WeaponAttr.dv]: "4P",
      [WeaponAttr.modes]: "SA/BF/FA",
      [WeaponAttr.attackRatings]: "9/12/7/-/-",
      [WeaponAttr.ammo]: "50(c)",
    },

    skill: ActiveSkillIds.CRB.firearms,
    specialtyName: Specializations.CRB.Firearms.SubmachineGuns,
  },
  [
    addGear(Silicus, {
      id: "81ef8a86-6cdf-49fc-a01e-b059c9757fed",
      source: { book: "CRB", page: 254 },
      gearType: GearType.weaponMod,
      name: "Rigid Stock",
      type: "Weapon Mod",

      slot: null,
      removable: false,
    }),
    addGear(Silicus, {
      id: "77fe6e86-2189-47a9-972d-61077b90c242",
      source: { book: "CRB", page: 254 },
      gearType: GearType.weaponMod,
      name: "Laser sight",
      type: "Weapon Mod",

      slot: WeaponModSlot.topOrUnder,
    }),
    addGear(Silicus, {
      id: "86c75812-6258-40d7-8d9a-539e297cbb2a",
      source: { book: "CRB", page: 254 },
      gearType: GearType.weaponMod,
      name: "Flashlight",
      type: "Weapon Mod",

      slot: null,
      removable: false,
    }),
    addGear(Silicus, {
      ...smartGunIntMod,
      id: "291a7eae-7369-4add-843f-73b68d3e1fe2",
    }),
    addGear(Silicus, {
      id: "ec2415cc-832b-4fda-bbd1-b19516cc389f",
      source: { book: "CRB", page: 259 },
      gearType: GearType.weaponMod,
      name: "Gas Vent",
      type: "Weapon Mod",
      avail: { rarity: 3 },
      cost: 500,

      description:
        "Removes the attack rating penalty for Semi-Automatic fire, and reduces it to 2 for Burst Fire",

      slot: WeaponModSlot.barrel,
      removable: false,
    }),
  ],
)

addGear<WeaponData>(
  Silicus,
  {
    id: "7a055ec1-6048-4b36-a555-445f28fdfdbf",
    source: { book: "CRB", page: 255 },
    gearType: GearType.weapon,
    name: "Ares Viper Silvergun",
    type: "Heavy Pistol",
    avail: { rarity: 4, license: true },
    cost: 610,

    attributes: {
      [WeaponAttr.dv]: "4P(f)",
      [WeaponAttr.modes]: "SA/BF",
      [WeaponAttr.attackRatings]: "12/8/6/-/-",
      [WeaponAttr.ammo]: "30(c)",
    },

    skill: ActiveSkillIds.CRB.firearms,
    specialtyName: Specializations.CRB.Firearms.HeavyPistols,
  },
  [
    addGear(Silicus, {
      ...smartGunIntMod,
      id: "322b3cb5-c37f-4600-a47e-c9c48d68cd87",
    }),
    addGear(Silicus, {
      id: "b987971b-814f-489d-b0f4-ffc5f8602069",
      source: { book: "CRB", page: 260 },
      gearType: GearType.weaponMod,
      name: "Quick Draw Holster",
      type: "Weapon Mod",
      avail: { rarity: 2 },
      cost: 175,

      description:
        "Use of a Quick-Draw holster provides a bonus Minor action when the Quick-Draw Action is taken",
      slot: null,
    }),
  ],
)

addGear<WeaponData>(
  Silicus,
  {
    id: "6d431911-4038-4c64-b543-13af0b9cab5f",
    source: { book: "CRB", page: 255 },
    gearType: GearType.weapon,
    name: "Defiance SuperShocker",
    type: "Taser",
    avail: { rarity: 1 },
    cost: 340,

    attributes: {
      [WeaponAttr.dv]: "6S(e)",
      [WeaponAttr.modes]: "SS",
      [WeaponAttr.attackRatings]: "10/6/-/-/-",
      [WeaponAttr.ammo]: "4(m)",
      [WeaponAttr.maxRange]: "20m",
    },

    skill: ActiveSkillIds.CRB.firearms,
    specialtyName: Specializations.CRB.Firearms.Tasers,
  },
  [
    addGear(Silicus, {
      ...smartGunIntMod,
      id: "08cd19d1-94c2-4e51-9a8b-89bc34c34212",
    }),
  ],
)

addGear<WeaponData>(Silicus, {
  id: "c99f8aba-d4d6-4880-8d4d-866dace1eb75",
  source: { book: "CRB", page: 254 },
  gearType: GearType.weapon,
  name: "Survival Knife",
  type: "Blade",
  avail: { rarity: 2 },
  cost: 250,

  attributes: {
    [WeaponAttr.dv]: "3P",
    [WeaponAttr.modes]: "SA/BF/FA",
    [WeaponAttr.attackRatings]: "8/2/-/-/-",
    [WeaponAttr.maxRange]: "20m",
  },

  skill: ActiveSkillIds.CRB.closeCombat,
  specialtyName: "Blades",
})

addGear<WeaponData>(Silicus, {
  id: "604ab904-d3e7-4f4e-9da0-182495de68a1",
  source: { book: "CRB", page: 254 },
  gearType: GearType.weapon,
  name: "Shock Gloves",
  type: "Other Melee",
  avail: { rarity: 4 },
  cost: 790,

  attributes: {
    [WeaponAttr.type]: "Unarmed",
    [WeaponAttr.dv]: "4S(e)",
    [WeaponAttr.attackRatings]: "5/-/-/-/-",
  },

  skill: ActiveSkillIds.CRB.closeCombat,
  specialtyName: "Blades",
})

addGear<AugmentData>(Silicus, {
  id: "b8d896da-e201-4e6b-96e6-adefd3c8d1a3",
  name: "Synaptic Booster",
  type: "Cultured Bioware Augment",
  gearType: GearType.augment,
  source: { book: "CRB", page: 293 },
  avail: { rarity: 4, license: true },
  cost: 142_500,

  description: `
    The nerve cells making up the spinal cord are both broadened and replicated 
    with this bioware, allowing for neural bandwidth. The result is a much faster 
    reaction time. The booster confers a bonus of +1 Reaction (and the accompanying 
    adjustment to Initiative Score), 1 additional Initiative Die, and 1 additional
    Minor Action per point of Rating. The synaptic booster cannot be combined with 
    any other form of Reaction or Initiative enhancement. Unlike other enhancements,
    this cannot be turned off, leaving the user in a perpetual state of being in
    surrounded by slow motion.  
  `,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 1.65,
    [AugmentAttr.slot]: AugmentSlot.bioware,
    [AugmentAttr.rating]: 3,
  },

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.reaction, value: 3 },
    { type: EffectType.initAdj, value: 3 },
  ],
})

addGear<AugmentData>(Silicus, {
  id: "62c28948-dc2b-42cc-95ee-22732203fe04",
  gearType: GearType.augment,
  name: "Platelet Factories",
  type: "Bioware Augment",
  source: { book: "CRB", page: 292 },
  avail: { rarity: 3 },
  cost: 8_500,

  description: `
    Any time you would take 2 or more boxes of damage to your Physical Condition 
    Monitor, reduce the damage by 1 box.
  `,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 0.22,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },
})

addGear<AugmentData>(Silicus, {
  id: "89a8b4ed-8e1b-4ab0-84c5-e0fb4bfdd437",
  gearType: GearType.augment,
  name: "Muscle Toner",
  type: "Bioware Augment",
  source: { book: "CRB", page: 292 },
  avail: { rarity: 3, license: true },
  cost: 64_000,

  description: `
    Muscle Toner adds it's rating to your Agility attribute. This bioware is incompatible
    with augmentations that increase Agility, including the muscle replacement cyberware
    and enhanced articulations bioware
  `,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 4,
    [AugmentAttr.essenceCost]: 0.88,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.agility, value: 4 },
  ],
})

addGear<AugmentData>(Silicus, {
  id: "3addb3cb-d1f2-42c0-b1ea-59aa267c34e2",
  gearType: GearType.augment,
  name: "Bone Density",
  type: "Bioware Augment",
  source: { book: "CRB", page: 291 },
  avail: { rarity: 3, license: true },
  cost: 24_000,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.alpha,
    [AugmentAttr.rating]: 4,
    [AugmentAttr.essenceCost]: 0.48,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  description: `
      Increases Body during damage resistance test by rating. 
      Melee damage: 3P, Atk. Rating: +2
  `,

  effects: [
    {
      type: EffectType.dicePoolAdj,
      name: "Bone Density",
      poolType: CharacterPoolTypes.dmgResist,
      value: 4,
    },
    // Melee damage: 3P
    // Melee Atk. Rating: +2
  ],
})

addGear<AugmentData>(Silicus, {
  id: "8bbf6a1b-ccf2-4fc8-828a-ec2170e67c84",
  name: "Pain Editor",
  type: "Cultured Bioware Augment",
  gearType: GearType.augment,
  source: { book: "CRB", page: 293 },
  avail: { rarity: 5, illegal: true },
  cost: 72_000,

  description: `
    This cluster of specialized nervous tissue is designed to filter sensory stimuli.
    If the pain editor is active, this allows you to ignore all injury modifiers, 
    and you can even stay conscious when your stun condition monitor is completely 
    full. You feel no pain—you're blissfully, dangerously, recklessly unaware of
    the extent of the damage you've taken without either performing a self-examination
    (Observe in Detail action) or being informed by a biomonitor. While active, the
    pain editor increases your willpower by 1 and decreases your intuition by 1;
    additionally, all tactile Perception tests you make have their threshold increased
    by 1. 
  `,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.beta,
    [AugmentAttr.essenceCost]: 0.21,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.willpower, value: 1 },
    { type: EffectType.attrBonus, attr: CharacterAttr.intuition, value: -1 },
  ],
})

addGear<AugmentData>(Silicus, {
  id: "6b343cba-32e4-4177-899c-eab7deabdb6d",
  name: "Orthoskin",
  type: "Bioware Augment",
  gearType: GearType.augment,
  source: { book: "CRB", page: 292 },
  avail: { rarity: 7, license: true },
  cost: 60_000,

  description: `
    A web of biofibers in the skin provides the
    equivalent of personal armor while being virtually
    indistinguishable from natural skin. Orthoskin
    provides a bonus equal to its rating to your Defense
    Rating. Orthoskin cannot be combined with
    skin augmentations, including dermal plating. 
  `,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.delta,
    [AugmentAttr.essenceCost]: 0.5,
    [AugmentAttr.slot]: AugmentSlot.bioware,
    [AugmentAttr.rating]: 4,
  },

  effects: [{ type: EffectType.defRatingAdj, value: 4 }],
})

addGear<AugmentData>(Silicus, {
  id: "eb40f7f5-0037-43e1-bb3e-422513555003",
  gearType: GearType.augment,
  name: "Reflex Recorder (Firearms)",
  type: "Cultured Bioware Augment",
  source: { book: "CRB", page: 293 },
  avail: { rarity: 4 },
  cost: 7_000,

  description: `
    This system uses extra nervous tissue linked to
    specific areas of the body to improve muscle memory.
    The reflex recorder adds 1 to the rating of a
    skill linked to a Physical attribute. Multiple recorders
    may be taken for multiple skills, but you can’t
    implant two reflex recorders for the same skill.
  `,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.essenceCost]: 0.11,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  enabled: true,
  effects: [
    { type: EffectType.skillAdj, skill: ActiveSkillIds.CRB.firearms, value: 1 },
  ],
})

addGear<AugmentData>(Silicus, {
  id: "951f4aa6-76f4-4626-bd0c-ca33da7569d9",
  gearType: GearType.augment,
  name: "Cerebral Booster",
  type: "Cultured Bioware Augment",
  source: { book: "CRB", page: 293 },
  avail: { rarity: 5 },
  cost: 47_250,

  description: `
    The convolutions and gyri of your cerebrum
    are augmented and amplified with additional
    nervous tissue, improving overall brain function.
    Your cerebral booster increases your Logic attribute
    by its rating.
  `,

  attributes: {
    [AugmentAttr.grade]: AugmentGrade.used,
    [AugmentAttr.rating]: 3,
    [AugmentAttr.essenceCost]: 0.66,
    [AugmentAttr.slot]: AugmentSlot.bioware,
  },

  enabled: true,
  effects: [
    { type: EffectType.attrBonus, attr: CharacterAttr.logic, value: 3 },
  ],
})

addGear(Silicus, {
  id: "1962503b-a324-4fe2-8dde-06bf534da060",
  gearType: GearType.other,
  name: "Sony Emperor",
  type: "Commlink",
  source: { book: "CRB", page: 267 },
  avail: { rarity: 2 },
  cost: 700,

  attributes: {
    [CommlinkAttr.deviceRating]: 2,
    [CommlinkAttr.attributes]: "1/1",
    [CommlinkAttr.programSlots]: 1,
  },
})

addGear(Silicus, {
  id: "6b7d26a5-47de-48b7-a6b6-c8b5c1b483e9",
  gearType: GearType.other,
  name: "Biomonitor",
  type: "Biotech",
  source: { book: "CRB", page: 281 },
  avail: { rarity: 2 },
  cost: 300,
})

addGear(
  Silicus,
  {
    id: "b9f302ee-7018-44d3-bf31-93438259ca3b",
    gearType: GearType.other,
    name: "Glasses",
    type: "Clothing",
    source: { book: "CRB", page: 285 },
    avail: { rarity: 2 },
    cost: 400,

    attributes: {
      [OtherGearAttr.capacity]: 4,
    },
  },
  [
    addGear(Silicus, {
      id: "cc67fef4-05a5-4be3-a671-20df801d04a6",
      gearType: GearType.other,
      name: "Smartlink",
      type: "Visual Enhancement",
      source: { book: "CRB", page: 275 },
      avail: { rarity: 2 },
      cost: 2_000,

      attributes: {
        [OtherGearAttr.capacityCost]: 2,
      },
    }),
    addGear(Silicus, {
      id: "0f074916-55c1-4889-8fae-61228b5c71c2",
      gearType: GearType.other,
      name: "Imagelink",
      type: "Visual Enhancement",
      source: { book: "CRB", page: 275 },
      avail: { rarity: 1 },
      cost: 25,

      attributes: {
        [OtherGearAttr.capacityCost]: 1,
      },
    }),
    addGear(Silicus, {
      id: "e11702ae-1c89-451e-8d6e-04597abc157a",
      gearType: GearType.other,
      name: "Thermographic Vision",
      type: "Visual Enhancement",
      source: { book: "CRB", page: 275 },
      avail: { rarity: 2 },
      cost: 500,

      attributes: {
        [OtherGearAttr.capacityCost]: 1,
      },
    }),
  ],
)

addGear<ArmorData>(Silicus, {
  id: "9e95c3e8-216f-4576-95ee-0fc33ef2c3df",
  gearType: GearType.armor,
  name: "Armored Jacket",
  type: "Armor",
  source: { book: "CRB", page: 265 },
  avail: { rarity: 2 },
  cost: 1_000,

  effects: [{ type: EffectType.defRatingAdj, value: 4 }],

  attributes: {
    [ArmorAttr.defenseBonus]: 4,
    [ArmorAttr.capacity]: 8,
  },
})

addGear(
  Silicus,
  {
    id: "843f901e-49df-41ad-8f5d-494038a96b98",
    gearType: GearType.armor,
    name: "Auctioneer Business Clothes",
    type: "Armor",
    source: { book: "CRB", page: 265 },
    avail: { rarity: 2 },
    cost: 1_500,

    attributes: {
      "armor.defenseBonus": 2,
      "armor.capacity": 6,
    },
  },
  [
    addGear(Silicus, {
      id: "cc7ed3c8-3b21-4406-a954-0cabf5232be2",
      gearType: GearType.armorMod,
      name: "Concealed Hostler",
      type: "Armor Mod",
      source: { book: "CRB", page: 259 },

      wirelessBonus: {
        enabled: true,
        description: "Increases cancellability threshold by 1",
      },
    }),
  ],
)

addGear(
  Silicus,
  {
    id: "cb0f423e-44ab-48f5-bebd-41164def3b50",
    gearType: GearType.other,
    name: "Medkit",
    type: "Biotech",
    source: { book: "CRB", page: 281 },
    avail: { rarity: 3 },
    cost: 1_500,

    attributes: {
      [KitAttr.medkitRating]: 6,
    },

    wirelessBonus: {
      enabled: true,
      description: `
      The medkit provides a +1 dice pool modifier to healing tests
    `,
    },

    kit: KitType.medKit,
  },
  [
    addGear(Silicus, {
      id: "8b766655-5394-4a88-b37e-b8ecfe481e06",
      gearType: GearType.other,
      name: "Medkit Supplies",
      type: "Supplies",
      source: { book: "CRB", page: 273 },
      avail: { rarity: 1 },
      cost: 100,
      quantity: 100,
    }),
  ],
)

addGear(Silicus, {
  id: "4160259c-a62e-402b-b94d-c7c92b0c2370",
  gearType: GearType.other,
  name: "First Aid Kit",
  type: "Kit",
  source: { book: "CRB", page: 273 },
  avail: { rarity: 1 },
  cost: 500,

  kit: KitType.firstAid,
})

addGear(Silicus, {
  id: "8f7bd7b0-7521-4f30-abe5-a6c09826a610",
  gearType: GearType.other,
  name: "Trauma Patch",
  type: "Slap Patch",
  source: { book: "CRB", page: 282 },
  avail: { rarity: 3 },
  cost: 500,
  quantity: 10,
  description: `
    If placed on a patient with Overflow Damage, the patient is automatically stabilized.
    These patches are always wireless, and connect to the matrix the moment they are applied.
  `,
})

addGear<VehicleData>(Silicus, {
  id: "eac7b24b-fa6d-4ab8-8f09-b1083e6054ae",
  gearType: GearType.vehicle,
  name: "Suzuki Mirage",
  type: "Bike",
  cost: 12_000,
  avail: { rarity: 2 },
  source: { book: "CRB", page: 295 },

  attributes: {
    [VehicleAttr.handling]: "2/6",
    [VehicleAttr.accel]: 29,
    [VehicleAttr.speedInterval]: 30,
    [VehicleAttr.topSpeed]: 260,
    [VehicleAttr.body]: 4,
    [VehicleAttr.armor]: 2,
    [VehicleAttr.pilot]: 1,
    [VehicleAttr.sensor]: 1,
    [VehicleAttr.seat]: 1,
  },

  pilotingSpeciality: "Ground Craft",
})

addGear<VehicleData>(
  Silicus,
  {
    id: "c55a0573-670d-4f31-993b-60f151f30e86",
    gearType: GearType.vehicle,
    name: "Hyundai Shin-Hyung",
    type: "Car",
    cost: 20_000,
    avail: { rarity: 2 },
    source: { book: "CRB", page: 295 },

    attributes: {
      [VehicleAttr.handling]: "3/5",
      [VehicleAttr.accel]: 12,
      [VehicleAttr.speedInterval]: 25,
      [VehicleAttr.topSpeed]: 200,
      [VehicleAttr.body]: 7,
      [VehicleAttr.armor]: 1,
      [VehicleAttr.pilot]: 1,
      [VehicleAttr.sensor]: 1,
      [VehicleAttr.seat]: 3,
    },

    pilotingSpeciality: "Ground Craft",
  },
  [
    addGear(Silicus, {
      id: "d8e171f9-c1b1-4b22-bf28-bebcee03e859",
      gearType: GearType.vehicleMod,
      modType: ModType.riggerInterface,
      name: "Rigger Interface",
      type: "vehicle mod",
      avail: { rarity: 2, license: true },
      cost: 1_000,
    }),
  ],
)

addGear<SinData>(
  Silicus,
  {
    id: "97ec7a5b-358e-4cfd-b2ab-040934ec1f88",
    gearType: GearType.sin,
    name: "Jake Ozbourne",
    type: "Fake SIN",
    source: { book: "CRB", page: 273 },
    avail: { rarity: 4, illegal: true },
    cost: 15_000,

    description: "General use SIN",

    attributes: {
      [SinAttr.rating]: 6,
    },
  },
  [
    addGear(Silicus, {
      id: "5b529806-1ab6-4363-9218-00846f1c86d2",
      gearType: GearType.license,
      name: "License: Concealed Carry",
      type: "Fake License",
      source: { book: "CRB", page: 273 },
      avail: { rarity: 4, illegal: true },
      cost: 1_000,

      attributes: {
        [LicenseAttr.rating]: 5,
      },
    }),
    addGear(Silicus, {
      id: "33cd2f9a-2c84-412e-9081-16c916f53eff",
      gearType: GearType.license,
      name: "License: Firearm Carry",
      type: "Fake License",
      source: { book: "CRB", page: 273 },
      avail: { rarity: 4, illegal: true },
      cost: 1_000,

      attributes: {
        [LicenseAttr.rating]: 5,
      },
    }),
    addGear(Silicus, {
      id: "989639ae-1592-46b9-b7b8-cdd7dad6b958",
      gearType: GearType.license,
      name: "License: Ares Viper Silvergun",
      type: "Fake License",
      source: { book: "CRB", page: 273 },
      avail: { rarity: 4, illegal: true },
      cost: 1_000,

      attributes: {
        [LicenseAttr.rating]: 5,
      },
    }),
  ],
)

addGear<SinData>(Silicus, {
  id: "7cd3e825-ca8f-40b6-ad50-ae2af68fa91c",
  gearType: GearType.sin,
  name: "Julian Bashir",
  type: "Fake SIN",
  source: { book: "CRB", page: 273 },
  avail: { rarity: 4, illegal: true },
  cost: 10_000,

  description: "Runner use SIN",

  attributes: {
    [SinAttr.rating]: 4,
  },
})

addGear<GearData>(
  Silicus,
  {
    id: "21d5e12f-e8c9-47da-bf69-3a315258ca3e",
    gearType: GearType.other,
    name: "Carromeleg",
    type: "Martial Art",
    attributes: {
      Catagories: "Mobility, Striking, Weapon",
    },
  },
  [
    addGear<GearData>(Silicus, {
      id: "ec3fae32-d74b-47b5-863c-840dffd149e4",
      gearType: GearType.other,
      name: "Bending of the Reed",
      type: "Martial Art Technique",
      attributes: {
        Category: "Mobility",
      },
      description:
        "Gain a bonus Edge when using the Dodge Minor Action against melee and " +
        "ranged attacks.",
    }),
  ],
)
