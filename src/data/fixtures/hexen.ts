<<<<<<<< HEAD:src/data/fixtures/hexen.ts
import { migrationIds } from "#/data/migrations.ts"
========
import { migrationIds } from "#/runner/migrations.ts"
>>>>>>>> shadowrun-4e:src/runner/fixtures/hexen.ts
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { SpellCategory, SpellDamage, SpellDrainType, SpellDuration, SpellRange, SpellType } from "#/system/magic/spellData.ts"
import { SpiritType } from "#/system/magic/traditionData.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const Hexen: RunnerData = {
  id: "b7e1c2d3-f4a5-6789-bcde-fa0123456789",
  _meta_: { version: 1, appliedMigrations: [...migrationIds] },

  biology: {
    metatype: MetatypeType.Human,
    awakening: AwakeningType.Magician,
  },

  profile: {
    alias: "Hexen",
    name: "Eliza Hoffmann",
    archetype: "Mage",
    streetCred: 0,
    notoriety: 0,
    description: "Hermetic mage specializing in combat and detection spells.",
  },

  karma: {
    total: 0,
    current: 0,
    log: [],
  },

  nuyen: {
    current: 5000,
    loans: [],
  },

  attributes: {
    body: 3,
    agility: 3,
    reaction: 3,
    strength: 2,
    charisma: 4,
    intuition: 4,
    logic: 5,
    willpower: 5,
    edge: 3,
    essence: 6,
    magic: 5,
    resonance: 0,
  },

  edge: {
    current: 3,
  },

  damage: {
    physical: 0,
    stun: 0,
    matrix: 0,
  },

  tradition: {
    name: "Hermetic",
    drainAttribute: AttributeKey.logic,
    spiritTypes: {
      combat: SpiritType.fire,
      detection: SpiritType.wind,
      health: SpiritType.man,
      illusion: SpiritType.water,
      manipulation: SpiritType.earth,
    },
  },

  spells: [
    {
      id: "hex-spell-001",
      name: "Manabolt",
      category: SpellCategory.Combat,
      type: SpellType.Mana,
      range: SpellRange.LoS,
      damage: SpellDamage.Stun,
      drain: { type: SpellDrainType.Force, value: -1 },
      dealsDamage: true,
      duration: SpellDuration.Instantaneous,
      voluntaryTargetsOnly: false,
      description:
        "A direct mana attack that strikes the target's life force directly. Only affects living or magical beings.",
    },
    {
      id: "hex-spell-002",
      name: "Powerbolt",
      category: SpellCategory.Combat,
      type: SpellType.Physical,
      range: SpellRange.LoS,
      damage: SpellDamage.Physical,
      drain: { type: SpellDrainType.Force, value: 0 },
      dealsDamage: true,
      duration: SpellDuration.Instantaneous,
      voluntaryTargetsOnly: false,
      description: "A bolt of raw magical energy that deals physical damage to the target.",
    },
    {
      id: "hex-spell-003",
      name: "Detect Enemies (Extended)",
      category: SpellCategory.Detection,
      type: SpellType.Mana,
      range: SpellRange.LoS,
      damage: SpellDamage.Stun,
      drain: { type: SpellDrainType.Force, value: 2 },
      dealsDamage: false,
      duration: SpellDuration.Sustained,
      voluntaryTargetsOnly: false,
      description: "Detects all entities within range that have hostile intent toward the caster.",
    },
    {
      id: "hex-spell-004",
      name: "Heal",
      category: SpellCategory.Health,
      type: SpellType.Mana,
      range: SpellRange.Touch,
      damage: SpellDamage.Stun,
      drain: { type: SpellDrainType.Force, value: -4 },
      dealsDamage: false,
      duration: SpellDuration.Permanent,
      voluntaryTargetsOnly: true,
      description:
        "Heals physical damage. Each net hit removes one box of physical damage. The Force sets the maximum damage that can be healed in one casting.",
    },
    {
      id: "hex-spell-005",
      name: "Invisibility",
      category: SpellCategory.Illusion,
      type: SpellType.Physical,
      range: SpellRange.LoS,
      damage: SpellDamage.Stun,
      drain: { type: SpellDrainType.Force, value: -1 },
      dealsDamage: false,
      duration: SpellDuration.Sustained,
      voluntaryTargetsOnly: true,
      description:
        "Renders the subject invisible to normal vision and cameras. The subject becomes visible again when they attack.",
    },
    {
      id: "hex-spell-006",
      name: "Chaos",
      category: SpellCategory.Manipulation,
      type: SpellType.Mana,
      range: SpellRange.LoS,
      damage: SpellDamage.Stun,
      drain: { type: SpellDrainType.Force, value: 0 },
      dealsDamage: false,
      duration: SpellDuration.Sustained,
      voluntaryTargetsOnly: false,
      description:
        "Scrambles the target's motor functions and decision-making, reducing all actions to random chaos.",
    },
  ],

  gear: {},

  skills: {
    activeSkills: [
      {
        name: SkillKey.spellcasting,
        rating: 6,
      },
      {
        name: SkillKey.counterspelling,
        rating: 4,
      },
      {
        name: SkillKey.summoning,
        rating: 4,
      },
      {
        name: SkillKey.perception,
        rating: 3,
      },
    ],
    skillGroups: [],
    knowledgeSkills: [
      {
        name: "Magical Theory",
        rating: 5,
      },
      {
        name: "Astral Space",
        rating: 4,
      },
    ],
    languageSkills: [
      {
        name: "English",
        rating: "native",
      },
      {
        name: "German",
        rating: 4,
      },
    ],
  },

  qualities: [],
  contacts: [],
  powers: [],
  complexForms: [],
  sprites: [],
  spirits: [],
}
