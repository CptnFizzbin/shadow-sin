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
}

export const SpiritRegistry: Record<SpiritType, SpiritTypeInfo> = {
  [SpiritType.wind]: {
    type: SpiritType.wind,
    movement: "15/75 (flight)",
    skills: [
      { name: "Assensing", attribute: AttributeKey.intuition },
      { name: "Astral Combat", attribute: AttributeKey.willpower },
      { name: "Dodge", attribute: AttributeKey.reaction },
      { name: "Exotic Ranged Weapon", attribute: AttributeKey.agility },
      { name: "Flight", attribute: AttributeKey.agility },
      { name: "Perception", attribute: AttributeKey.intuition },
      { name: "Unarmed Combat", attribute: AttributeKey.agility },
    ],
    basePowers: ["Accident", "Astral Form", "Concealment", "Confusion", "Engulf", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Elemental Attack", "Energy Aura", "Fear", "Guard", "Noxious Breath", "Psychokinesis"],
  },
  [SpiritType.beast]: {
    type: SpiritType.beast,
    movement: "",
    skills: [],
    basePowers: ["Animal Control", "Astral Form", "Confusion", "Enhanced Senses", "Fear", "Guard", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Natural Weapon", "Noxious Breath", "Psychokinesis", "Venom"],
  },
  [SpiritType.earth]: {
    type: SpiritType.earth,
    movement: "",
    skills: [],
    basePowers: ["Astral Form", "Binding", "Guard", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Confusion", "Elemental Attack (Earth)", "Engulf", "Fear", "Natural Weapon", "Quake"],
  },
  [SpiritType.fire]: {
    type: SpiritType.fire,
    movement: "",
    skills: [],
    basePowers: ["Astral Form", "Confusion", "Elemental Attack (Fire)", "Energy Aura", "Fear", "Guard", "Materialization", "Sapience", "Search"],
    optionalPowers: ["Accident", "Concealment", "Engulf", "Movement", "Noxious Breath", "Psychokinesis"],
  },
  [SpiritType.guidance]: {
    type: SpiritType.guidance,
    movement: "",
    skills: [],
    basePowers: ["Astral Form", "Confusion", "Divining", "Guard", "Materialization", "Sapience", "Search"],
    optionalPowers: ["Accident", "Concealment", "Elemental Attack", "Fear", "Magical Guard", "Movement", "Psychokinesis"],
  },
  [SpiritType.guardian]: {
    type: SpiritType.guardian,
    movement: "",
    skills: [],
    basePowers: ["Astral Form", "Confusion", "Fear", "Guard", "Magical Guard", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Animal Control", "Concealment", "Elemental Attack", "Natural Weapon", "Psychokinesis", "Skill"],
  },
  [SpiritType.man]: {
    type: SpiritType.man,
    movement: "",
    skills: [],
    basePowers: ["Accident", "Astral Form", "Confusion", "Guard", "Influence", "Materialization", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Fear", "Movement", "Psychokinesis", "Spell (one per optional power)"],
  },
  [SpiritType.plant]: {
    type: SpiritType.plant,
    movement: "",
    skills: [],
    basePowers: ["Astral Form", "Concealment", "Confusion", "Fear", "Guard", "Materialization", "Sapience", "Search"],
    optionalPowers: ["Accident", "Binding", "Engulf", "Movement", "Noxious Breath", "Natural Weapon"],
  },
  [SpiritType.task]: {
    type: SpiritType.task,
    movement: "",
    skills: [],
    basePowers: ["Accident", "Astral Form", "Binding", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Confusion", "Enhanced Senses", "Influence", "Psychokinesis", "Skill"],
  },
  [SpiritType.water]: {
    type: SpiritType.water,
    movement: "",
    skills: [],
    basePowers: ["Astral Form", "Confusion", "Concealment", "Engulf", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Accident", "Elemental Attack (Water)", "Energy Aura", "Fear", "Guard", "Weather Control"],
  },
}
