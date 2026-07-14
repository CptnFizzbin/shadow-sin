import { AttributeKey } from "#/system/attributeKey.ts"

import { SpiritType } from "./spiritData.ts"

export interface SpiritSkill {
  name: string
  attribute: AttributeKey
}

export interface SpiritTypeInfo {
  type: SpiritType
  /** Walk/Run rates as printed in the stat block, e.g. "15/75 (flight)". Empty string = not yet entered. */
  movement: string
  skills: SpiritSkill[]
  basePowers: string[]
  optionalPowers: string[]
  weaknesses: string[]
}

/** Skills as printed in spirit stat blocks — most spirits share several of these verbatim. */
const Skill = {
  arcana: { name: "Arcana", attribute: AttributeKey.logic },
  artisan: { name: "Artisan", attribute: AttributeKey.intuition },
  assensing: { name: "Assensing", attribute: AttributeKey.intuition },
  astralCombat: { name: "Astral Combat", attribute: AttributeKey.willpower },
  blades: { name: "Blades", attribute: AttributeKey.agility },
  clubs: { name: "Clubs", attribute: AttributeKey.agility },
  counterspelling: { name: "Counterspelling", attribute: AttributeKey.magic },
  dodge: { name: "Dodge", attribute: AttributeKey.reaction },
  exoticRangedWeapon: { name: "Exotic Ranged Weapon", attribute: AttributeKey.agility },
  flight: { name: "Flight", attribute: AttributeKey.agility },
  perception: { name: "Perception", attribute: AttributeKey.intuition },
  spellcasting: { name: "Spellcasting", attribute: AttributeKey.magic },
  unarmedCombat: { name: "Unarmed Combat", attribute: AttributeKey.agility },
} as const satisfies Record<string, SpiritSkill>

export const SpiritRegistry: Record<SpiritType, SpiritTypeInfo> = {
  [SpiritType.wind]: {
    type: SpiritType.wind,
    movement: "15/75 (flight)",
    skills: [
      Skill.assensing,
      Skill.astralCombat,
      Skill.dodge,
      Skill.exoticRangedWeapon,
      Skill.flight,
      Skill.perception,
      Skill.unarmedCombat,
    ],
    basePowers: ["Accident", "Astral Form", "Concealment", "Confusion", "Engulf", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Elemental Attack", "Energy Aura", "Fear", "Guard", "Noxious Breath", "Psychokinesis"],
    weaknesses: [],
  },
  [SpiritType.beast]: {
    type: SpiritType.beast,
    movement: "10/45",
    skills: [Skill.assensing, Skill.astralCombat, Skill.dodge, Skill.perception, Skill.unarmedCombat],
    basePowers: ["Animal Control", "Astral Form", "Enhanced Senses (Hearing, Low-Light Vision, Smell)", "Fear", "Materialization", "Movement", "Sapience"],
    optionalPowers: ["Concealment", "Confusion", "Guard", "Natural Weapon", "Noxious Breath", "Search", "Venom"],
    weaknesses: [],
  },
  [SpiritType.earth]: {
    type: SpiritType.earth,
    movement: "10/25",
    skills: [
      Skill.assensing,
      Skill.astralCombat,
      Skill.dodge,
      Skill.exoticRangedWeapon,
      Skill.perception,
      Skill.unarmedCombat,
    ],
    basePowers: ["Astral Form", "Binding", "Guard", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Confusion", "Elemental Attack", "Engulf", "Fear"],
    weaknesses: [],
  },
  [SpiritType.fire]: {
    type: SpiritType.fire,
    movement: "15/40 (flight)",
    skills: [
      Skill.assensing,
      Skill.astralCombat,
      Skill.dodge,
      Skill.exoticRangedWeapon,
      Skill.flight,
      Skill.perception,
      Skill.unarmedCombat,
    ],
    basePowers: ["Accident", "Astral Form", "Confusion", "Elemental Attack", "Energy Aura", "Engulf", "Materialization", "Sapience"],
    optionalPowers: ["Fear", "Guard", "Noxious Breath", "Search"],
    weaknesses: ["Allergy (Water, Severe)"],
  },
  [SpiritType.guidance]: {
    type: SpiritType.guidance,
    movement: "10/25",
    skills: [
      Skill.arcana,
      Skill.assensing,
      Skill.astralCombat,
      Skill.counterspelling,
      Skill.dodge,
      Skill.perception,
      Skill.unarmedCombat,
    ],
    basePowers: ["Astral Form", "Confusion", "Divining", "Guard", "Magical Guard", "Materialization", "Sapience", "Search", "Shadow Cloak"],
    optionalPowers: ["Engulf", "Enhanced Senses (Hearing, Low-Light Vision, Thermographic Vision, or Smell)", "Fear", "Influence"],
    weaknesses: [],
  },
  [SpiritType.guardian]: {
    type: SpiritType.guardian,
    movement: "15/40",
    skills: [
      Skill.assensing,
      Skill.astralCombat,
      Skill.blades,
      Skill.clubs,
      Skill.counterspelling,
      Skill.dodge,
      Skill.exoticRangedWeapon,
      Skill.perception,
      Skill.unarmedCombat,
    ],
    basePowers: ["Astral Form", "Fear", "Guard", "Magical Guard", "Materialization", "Movement", "Sapience"],
    optionalPowers: ["Animal Control", "Concealment", "Elemental Attack", "Natural Weapon", "Psychokinesis", "Skill"],
    weaknesses: [],
  },
  [SpiritType.man]: {
    type: SpiritType.man,
    movement: "10/25",
    skills: [
      Skill.assensing,
      Skill.astralCombat,
      Skill.dodge,
      Skill.perception,
      Skill.spellcasting,
      Skill.unarmedCombat,
    ],
    basePowers: ["Accident", "Astral Form", "Concealment", "Confusion", "Enhanced Senses (Low-Light, Thermographic Vision)", "Guard", "Influence", "Materialization", "Sapience", "Search"],
    optionalPowers: ["Fear", "Innate Spell", "Movement", "Psychokinesis"],
    weaknesses: [],
  },
  [SpiritType.plant]: {
    type: SpiritType.plant,
    movement: "5/15",
    skills: [
      Skill.assensing,
      Skill.astralCombat,
      Skill.counterspelling,
      Skill.dodge,
      Skill.perception,
      Skill.unarmedCombat,
    ],
    basePowers: ["Astral Form", "Concealment", "Engulf", "Fear", "Guard", "Magical Guard", "Materialization", "Sapience", "Silence"],
    optionalPowers: ["Accident", "Confusion", "Movement", "Noxious Breath", "Search"],
    weaknesses: [],
  },
  [SpiritType.task]: {
    type: SpiritType.task,
    movement: "10/25",
    skills: [
      Skill.artisan,
      Skill.assensing,
      Skill.astralCombat,
      Skill.dodge,
      Skill.perception,
      Skill.unarmedCombat,
    ],
    basePowers: ["Accident", "Astral Form", "Binding", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Enhanced Senses (Hearing, Low-Light Vision, Thermographic Vision, or Smell)", "Influence", "Psychokinesis", "Skill"],
    weaknesses: [],
  },
  [SpiritType.watcher]: {
    type: SpiritType.watcher,
    movement: "",
    skills: [Skill.assensing, Skill.astralCombat, Skill.dodge],
    basePowers: ["Astral Form", "Search"],
    optionalPowers: [],
    weaknesses: [],
  },
  [SpiritType.water]: {
    type: SpiritType.water,
    movement: "10/25 (30/75 swimming)",
    skills: [
      Skill.assensing,
      Skill.astralCombat,
      Skill.dodge,
      Skill.exoticRangedWeapon,
      Skill.perception,
      Skill.unarmedCombat,
    ],
    basePowers: ["Astral Form", "Concealment", "Confusion", "Engulf", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Accident", "Binding", "Elemental Attack", "Energy Aura", "Guard", "Weather Control"],
    weaknesses: ["Allergy (Fire, Severe)"],
  },
}
