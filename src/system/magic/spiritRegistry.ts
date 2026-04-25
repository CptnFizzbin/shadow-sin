import { SpiritType } from "#/system/magic/spiritData.ts"

export interface SpiritTypeInfo {
  type: SpiritType
  basePowers: string[]
  optionalPowers: string[]
}

export const SpiritRegistry: Record<SpiritType, SpiritTypeInfo> = {
  [SpiritType.wind]: {
    type: SpiritType.wind,
    basePowers: ["Accident", "Astral Form", "Confusion", "Elemental Attack (Air)", "Fear", "Guard", "Materialization", "Movement", "Psychokinesis", "Sapience", "Search"],
    optionalPowers: ["Divining", "Energy Aura", "Engulf", "Fear", "Noxious Breath", "Weather Control"],
  },
  [SpiritType.beast]: {
    type: SpiritType.beast,
    basePowers: ["Animal Control", "Astral Form", "Confusion", "Enhanced Senses", "Fear", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Guard", "Natural Weapon", "Noxious Breath", "Psychokinesis", "Venom"],
  },
  [SpiritType.earth]: {
    type: SpiritType.earth,
    basePowers: ["Astral Form", "Binding", "Guard", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Confusion", "Elemental Attack (Earth)", "Engulf", "Fear", "Natural Weapon", "Quake"],
  },
  [SpiritType.fire]: {
    type: SpiritType.fire,
    basePowers: ["Astral Form", "Confusion", "Elemental Attack (Fire)", "Energy Aura", "Fear", "Guard", "Materialization", "Sapience", "Search"],
    optionalPowers: ["Accident", "Concealment", "Engulf", "Movement", "Noxious Breath", "Psychokinesis"],
  },
  [SpiritType.guidance]: {
    type: SpiritType.guidance,
    basePowers: ["Astral Form", "Confusion", "Divining", "Guard", "Materialization", "Sapience", "Search"],
    optionalPowers: ["Accident", "Concealment", "Elemental Attack", "Fear", "Magical Guard", "Movement", "Psychokinesis"],
  },
  [SpiritType.guardian]: {
    type: SpiritType.guardian,
    basePowers: ["Astral Form", "Confusion", "Fear", "Guard", "Magical Guard", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Animal Control", "Concealment", "Elemental Attack", "Natural Weapon", "Psychokinesis", "Skill"],
  },
  [SpiritType.man]: {
    type: SpiritType.man,
    basePowers: ["Accident", "Astral Form", "Confusion", "Guard", "Influence", "Materialization", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Fear", "Movement", "Psychokinesis", "Spell (one per optional power)"],
  },
  [SpiritType.plant]: {
    type: SpiritType.plant,
    basePowers: ["Astral Form", "Concealment", "Confusion", "Fear", "Guard", "Materialization", "Sapience", "Search"],
    optionalPowers: ["Accident", "Binding", "Engulf", "Movement", "Noxious Breath", "Natural Weapon"],
  },
  [SpiritType.task]: {
    type: SpiritType.task,
    basePowers: ["Accident", "Astral Form", "Binding", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Concealment", "Confusion", "Enhanced Senses", "Influence", "Psychokinesis", "Skill"],
  },
  [SpiritType.water]: {
    type: SpiritType.water,
    basePowers: ["Astral Form", "Confusion", "Concealment", "Engulf", "Materialization", "Movement", "Sapience", "Search"],
    optionalPowers: ["Accident", "Elemental Attack (Water)", "Energy Aura", "Fear", "Guard", "Weather Control"],
  },
}
