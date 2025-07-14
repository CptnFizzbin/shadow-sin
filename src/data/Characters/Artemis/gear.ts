import { CharacterAttr } from "../../../Character/CharacterAttr"
import { CharacterData } from "../../../Character/CharacterData"
import { ArmorAttr } from "../../../Gear/Armor/ArmorAttr"
import { ArmorData } from "../../../Gear/Armor/ArmorData"
import { AugmentAttr } from "../../../Gear/Augments/AugmentAttr"
import {
  AugmentData,
  AugmentGrade,
  AugmentSlot,
  AugmentType,
} from "../../../Gear/Augments/AugmentData"
import { GearType } from "../../../Gear/GearData"
import { LicenseAttr } from "../../../Gear/License/LicenseAttr"
import { LicenseData } from "../../../Gear/License/LicenseData"
import { SinAttr } from "../../../Gear/License/SinAttr"
import { SinData } from "../../../Gear/License/SinData"
import { RccAttr } from "../../../Gear/Rcc/RccAttr"
import { RccData } from "../../../Gear/Rcc/RccData"
import { AutosoftAttr } from "../../../Gear/Software/Autosoft/AutosoftAttr"
import { AutosoftData } from "../../../Gear/Software/Autosoft/AutosoftData"
import { WeaponPoolKeys } from "../../../Gear/Weapons/DicePools"
import { WeaponAttr } from "../../../Gear/Weapons/WeaponAttr"
import { WeaponData } from "../../../Gear/Weapons/WeaponData"
import {
  WeaponModData,
  WeaponModSlot,
} from "../../../Gear/Weapons/WeaponModData"
import { ActiveSkillIds, Specializations } from "../../../Skills"
import { EffectType } from "../../../System/Effect"
import { addGear } from "../index"
import { addDrones } from "./drones"
import { addVehicles } from "./vechicles"

export const addAllGear = (character: CharacterData): void => {
  addGear<ArmorData>(character, {
    id: "84596cc0-754e-457e-b862-c6935f028f62",
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

  addGear<AugmentData>(character, {
    id: "37f9da35-c67f-46fd-9e79-3929db823816",
    gearType: GearType.augment,
    name: "Control Rig",
    type: "Headwear Augment",
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

  addGear<AugmentData>(character, {
    id: "d89aafe6-111f-4e60-9fe2-fe5c1c3f94b8",
    gearType: GearType.augment,
    name: "Cerebral Booster",
    type: "Cultured Bioware Augment",
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

  addGear<AugmentData>(character, {
    id: "de13c340-89b3-4bc9-b6f4-29288cff00bc",
    gearType: GearType.augment,
    name: "Sleep Regulator",
    type: "Cultured Bioware Augment",
    avail: { rarity: 4 },
    source: { book: "CRB", page: 293 },
    cost: 6_000,

    description: `
    You need less sleep per day, and the sleep you get is deep and restful (and harder
    to wake up from). The sleep regulator lets you get by with three hours of sleep
    each night, and you can stay awake for twice as long as normal without acquiring 
    the Fatigued status. Resting hours for healing purposes are not affected.
  `,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.used,
      [AugmentAttr.essenceCost]: 0.11,
      [AugmentAttr.slot]: AugmentSlot.bioware,
    },
  })

  addGear<WeaponData>(
    character,
    {
      id: "e7f70f35-8d96-43be-8b19-fc9d8718ed95",
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
      addGear(character, {
        id: "f8d19b04-8767-4693-9774-195ff92ed8df",
        source: { book: "CRB", page: 254 },
        gearType: GearType.weaponMod,
        name: "Rigid Stock",
        type: "Weapon Mod",

        slot: null,
        removable: false,
      }),
      addGear(character, {
        id: "02fbb521-e039-4c06-9aaf-cead333e3885",
        source: { book: "CRB", page: 254 },
        gearType: GearType.weaponMod,
        name: "Laser sight",
        type: "Weapon Mod",

        slot: WeaponModSlot.topOrUnder,
      }),
      addGear(character, {
        id: "21d66c66-4615-49d6-b330-e4c25eea631a",
        source: { book: "CRB", page: 254 },
        gearType: GearType.weaponMod,
        name: "Flashlight",
        type: "Weapon Mod",

        slot: WeaponModSlot.topOrUnder,
      }),
      addGear(character, {
        ...smartGunIntMod,
        id: "429f440e-ffc3-459d-b08f-b013af1648dc",
      }),
    ],
  )

  addGear<WeaponData>(
    character,
    {
      id: "ae2baf27-bd6f-43e2-8198-a19e37231b7d",
      source: { book: "CRB", page: 252 },
      gearType: GearType.weapon,
      name: "Colt America L36",
      type: "Light Pistol",
      avail: { rarity: 2, license: true },
      cost: 230,

      attributes: {
        [WeaponAttr.dv]: "2P",
        [WeaponAttr.modes]: "SA",
        [WeaponAttr.attackRatings]: "8/8/6/-/-",
        [WeaponAttr.ammo]: "11(c)",
      },
      wirelessBonus: {
        enabled: true,
        description: "The user can alter ownership with a Minor Action",
      },

      skill: ActiveSkillIds.CRB.firearms,
      specialtyName: Specializations.CRB.Firearms.LightPistols,
    },
    [
      addGear(character, {
        ...smartGunIntMod,
        id: "7c94f42b-e770-472f-85d8-992cde7e2606",
      }),
    ],
  )

  const autosofts: AutosoftData[] = [
    addGear<AutosoftData>(character, {
      id: "de5e973c-134d-427e-9a3a-205422341b7b",
      gearType: GearType.autosoft,
      name: "FN-HAR Targeting",
      type: "Targeting Autosoft",
      avail: { rarity: 8 },
      cost: 4_000,

      attributes: {
        [AutosoftAttr.rating]: 8,
        [AutosoftAttr.weapon]: "FN-HAR",
        [AutosoftAttr.attr]: "Sensor",
      },
    }),
    addGear<AutosoftData>(character, {
      id: "a0af5540-37c7-44ca-af2a-03cb21efd83a",
      gearType: GearType.autosoft,
      name: "Clearsight",
      type: "Autosoft",
      avail: { rarity: 8 },
      cost: 4_000,

      attributes: {
        [AutosoftAttr.rating]: 8,
        [AutosoftAttr.skill]: "Perception",
        [AutosoftAttr.attr]: "Sensor",
      },
    }),
    addGear<AutosoftData>(character, {
      id: "3a459c98-5354-4fa1-a230-dfe77b199ffa",
      gearType: GearType.autosoft,
      name: "Evasion",
      type: "Autosoft",
      avail: { rarity: 8 },
      cost: 4_000,

      attributes: {
        [AutosoftAttr.rating]: 8,
        [AutosoftAttr.skill]: "Evasion",
        [AutosoftAttr.attr]: "Pilot",
      },
    }),
    addGear<AutosoftData>(character, {
      id: "78a5f82e-636f-468a-85e3-5af73304b7c0",
      gearType: GearType.autosoft,
      name: "Maneuvering",
      type: "Autosoft",
      avail: { rarity: 8 },
      cost: 4_000,

      attributes: {
        [AutosoftAttr.rating]: 8,
        [AutosoftAttr.skill]: "Piloting",
        [AutosoftAttr.attr]: "Pilot",
      },
    }),
    addGear<AutosoftData>(character, {
      id: "a5b8c866-38cb-40a2-a136-d3feb39ea68d",
      gearType: GearType.autosoft,
      name: "Electronic Warfare",
      type: "Autosoft",
      avail: { rarity: 8 },
      cost: 4_000,

      attributes: {
        [AutosoftAttr.rating]: 8,
        [AutosoftAttr.skill]: "Cracking",
        [AutosoftAttr.attr]: "Sensor",
      },
    }),
    addGear<AutosoftData>(character, {
      id: "0b3dae26-a9d1-4752-a298-db024d13476b",
      gearType: GearType.autosoft,
      name: "Black Knight Targeting",
      type: "Targeting Autosoft",
      avail: { rarity: 8 },
      cost: 4_000,

      attributes: {
        [AutosoftAttr.rating]: 8,
        [AutosoftAttr.weapon]: "Ingram Black Knight",
        [AutosoftAttr.attr]: "Sensor",
      },
    }),
  ]

  const rccHeadwear = addGear<AugmentData>(character, {
    id: "1f8b016d-a36f-45b6-8099-7527e2986093",
    gearType: GearType.augment,
    name: "RCC Headwear",
    type: "Headwear Augment",
    avail: { rarity: 2, license: true },
    source: { book: "DC", page: 145 },
    cost: 2_000,

    attributes: {
      [AugmentAttr.grade]: AugmentGrade.used,
      [AugmentAttr.essenceCost]: 0.33,
      [AugmentAttr.slot]: AugmentSlot.headware,
      [AugmentAttr.capacityCost]: 3,
    },
  })

  const rcc = addGear<RccData>(character, {
    id: "bb6e3208-418d-41b8-85c3-447e6328aa5bs",
    gearType: GearType.rcc,
    name: "Proteus Poseidon",
    type: "RCC",
    avail: { rarity: 6, license: true },
    cost: 68_000,

    attributes: {
      [RccAttr.deviceRating]: 5,
      [RccAttr.dataProcessing]: 5,
      [RccAttr.firewall]: 5,
    },

    slavedAutosofts: [
      "de5e973c-134d-427e-9a3a-205422341b7b",
      "a0af5540-37c7-44ca-af2a-03cb21efd83a",
      "3a459c98-5354-4fa1-a230-dfe77b199ffa",
      "78a5f82e-636f-468a-85e3-5af73304b7c0",
      "a5b8c866-38cb-40a2-a136-d3feb39ea68d",
    ],

    attachedTo: rccHeadwear.id,
  })

  autosofts.forEach((soft) => (soft.attachedTo = rcc.id))
  addDrones(character, rcc)
  addVehicles(character, rcc)

  addGear<AugmentData>(
    character,
    {
      id: "62c928a2-2a1e-4195-83ee-c760b6f93e1b",
      gearType: GearType.augment,
      name: "Cybereyes",
      type: "Augment",
      source: { book: "CRB", page: 285 },
      avail: { rarity: 4 },
      cost: 12_000,

      attributes: {
        [AugmentAttr.grade]: AugmentGrade.alpha,
        [AugmentAttr.rating]: 4,
        [AugmentAttr.capacity]: 12,
        [AugmentAttr.essenceCost]: 0.32,
        [AugmentAttr.slot]: AugmentSlot.eyeware,
      },
    },
    [
      addGear<AugmentData>(character, {
        id: "a19ea646-4212-49a2-908c-1da5f3ab498f",
        gearType: GearType.augment,
        name: "Smartlink",
        type: "Cybereye Augment",
        source: { book: "CRB", page: 275 },
        avail: { rarity: 4, license: true },
        cost: 4_800,

        attributes: {
          [AugmentAttr.grade]: AugmentGrade.alpha,
          [AugmentAttr.essenceCost]: 0.16,
          [AugmentAttr.slot]: AugmentSlot.eyeware,
          [AugmentAttr.capacityCost]: 3,
        },
      }),
      addGear<AugmentData>(character, {
        id: "31e7ddd1-dca5-4f99-a67d-2fecadcf2853",
        gearType: GearType.augment,
        name: "Imagelink",
        type: "Cybereye Augment",
        source: { book: "CRB", page: 275 },
        avail: { rarity: 3 },
        cost: 960,

        attributes: {
          [AugmentAttr.grade]: AugmentGrade.alpha,
          [AugmentAttr.slot]: AugmentSlot.eyeware,
          [AugmentAttr.capacityCost]: 0,
        },
      }),
      addGear<AugmentData>(character, {
        id: "1660efc9-98d5-4ed1-b2da-651e7ea578c5",
        gearType: GearType.augment,
        name: "Low-Light Vision",
        type: "Cybereye Augment",
        source: { book: "CRB", page: 275 },
        avail: { rarity: 3 },
        cost: 900,

        attributes: {
          [AugmentAttr.grade]: AugmentGrade.alpha,
          [AugmentAttr.capacityCost]: 2,
          [AugmentAttr.slot]: AugmentSlot.eyeware,
        },
      }),
      addGear<AugmentData>(character, {
        id: "31189433-ba37-4186-a453-6e236d915caa",
        gearType: GearType.augment,
        name: "Vision Enhancement",
        type: "Cybereye Augment",
        source: { book: "CRB", page: 275 },
        avail: { rarity: 4 },
        cost: 4_800,

        attributes: {
          [AugmentAttr.grade]: AugmentGrade.alpha,
          [AugmentAttr.capacityCost]: 2,
          [AugmentAttr.slot]: AugmentSlot.eyeware,
        },
      }),
      addGear<AugmentData>(character, {
        id: "1b6cdf25-9374-4a09-b2a1-76ed1a9be01b",
        gearType: GearType.augment,
        name: "Vision Magnification",
        type: "Cybereye Augment",
        source: { book: "CRB", page: 275 },
        avail: { rarity: 4 },
        cost: 2_400,

        attributes: {
          [AugmentAttr.grade]: AugmentGrade.alpha,
          [AugmentAttr.capacityCost]: 2,
          [AugmentAttr.slot]: AugmentSlot.eyeware,
        },
      }),
    ],
  )

  addGear<AugmentData>(
    character,
    {
      id: "89192a52-adf6-41d1-8978-0f0787185b5a",
      gearType: GearType.augment,
      name: "Commlink",
      type: "Headware Augment",
      source: { book: "CRB", page: 283 },
      avail: { rarity: 1 },
      cost: 1_000,

      attributes: {
        [AugmentAttr.grade]: AugmentGrade.used,
        [AugmentAttr.essenceCost]: 0.11,
        [AugmentAttr.slot]: AugmentSlot.headware,
      },
    },
    [
      addGear(character, {
        id: "8c2e404d-5678-4dad-8cdd-dcda26e9d866",
        gearType: GearType.other,
        name: "Hermes Ikon",
        type: "Commlink",
        source: { book: "CRB", page: 267 },
        avail: { rarity: 3 },
        cost: 5_000,

        attributes: {
          "commlink.deviceRating": 5,
          "commlink.attributes": "3/0",
          "commlink.programSlots": 2,
        },
      }),
    ],
  )

  addGear<AugmentData>(character, {
    id: "3803d92f-1869-41b0-975a-dbdd929af4d7",
    name: "Synaptic Booster",
    type: "Cultured Bioware Augment",
    gearType: GearType.augment,
    source: { book: "CRB", page: 293 },
    avail: { rarity: 4, license: true },
    cost: 95_000,

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
      [AugmentAttr.essenceCost]: 1.1,
      [AugmentAttr.slot]: AugmentSlot.bioware,
      [AugmentAttr.rating]: 2,
    },

    enabled: true,
    effects: [
      { type: EffectType.attrBonus, attr: CharacterAttr.reaction, value: 2 },
      { type: EffectType.initAdj, value: 2 },
    ],
  })

  addGear<SinData>(character, {
    id: "110a3b00-ac94-4698-a60c-7cf34d829bcb",
    gearType: GearType.sin,
    name: "Sara McCabe",
    type: "Fake SIN",
    source: { book: "CRB", page: 273 },
    avail: { rarity: 4, illegal: true },
    cost: 15_000,

    description: "General use SIN",

    attributes: {
      [SinAttr.rating]: 6,
    },
  })

  addGear<SinData>(
    character,
    {
      id: "25a3030a-4850-4f68-914f-95276c893352",
      gearType: GearType.sin,
      name: "Jadzia Dax",
      type: "Fake SIN",
      source: { book: "CRB", page: 273 },
      avail: { rarity: 4, illegal: true },
      cost: 10_000,

      description: "Runner SIN",

      attributes: {
        [SinAttr.rating]: 4,
      },
    },
    [
      addGear<LicenseData>(character, {
        id: "eae7b822-7dee-4734-8e7b-1c1ebd7aa46d",
        gearType: GearType.license,
        name: "Driver License (Semi-Truck)",
        type: "Fake License",
        source: { book: "CRB", page: 273 },
        avail: { rarity: 5, illegal: true },
        cost: 1_000,

        attributes: {
          [LicenseAttr.rating]: 5,
        },
      }),
    ],
  )

  addGear<SinData>(character, {
    id: "50f91ebf-e206-4843-be29-ac1bcb3a45ba",
    gearType: GearType.sin,
    name: "Jane Smith",
    type: "Fake SIN",
    source: { book: "CRB", page: 273 },
    avail: { rarity: 4, illegal: true },
    cost: 5_000,

    description: "Burner SIN",

    attributes: {
      [SinAttr.rating]: 2,
    },
  })

  addGear(character, {
    id: "f2b9526c-5db1-4076-81c0-c0bf52280e8a",
    gearType: GearType.other,
    name: "Engineering Shop",
    type: "Shop",
    source: { book: "CRB", page: 273 },
    avail: { rarity: 4 },
    cost: 5_000,
  })
}
