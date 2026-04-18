/**
 * Versioned character-sheet fixtures for migration tests.
 *
 * Each export represents the raw JSON structure of a character at a specific
 * migration boundary — i.e. the state BEFORE the next migration has run.
 * They intentionally omit fields that hadn't been introduced yet, so they
 * are typed as `Record<string, unknown>` rather than `CharacterSheet`.
 *
 * Migration timeline:
 *   characterPreAllMigrations  – before any migration (oldest shape)
 *   characterPost20250801      – after 20250801_addSpellThreshold
 *   characterPost20251001      – after 20251001_addLoanIdAndInterestRate
 *   characterPost20260416      – after 20260416_addVehicleCategory
 *   characterPost20260417      – after 20260417_setDefaultEquippedWeapons
 *   characterV1                – fully migrated (includes _meta_: { version: 1 })
 */

// Stable UUIDs shared across all version fixtures so tests can reference them.
export const TEST_CHARACTER_ID = "ccccdddd-0000-0000-0000-000000000001" as const
export const TEST_WEAPON_ID = "ccccdddd-0000-0000-0000-000000000002" as const
export const TEST_VEHICLE_ID = "ccccdddd-0000-0000-0000-000000000003" as const
export const TEST_LOAN_ID = "ccccdddd-0000-0000-0000-000000000004" as const

// ---------------------------------------------------------------------------
// Oldest shape — before any migration has been applied.
// • spells:  no `theshold` field
// • loans:   no `id`, no `interestRate`
// • vehicle: no `vehicleCategory`
// • weapon:  no `equipped`
// • sheet:   no `_meta_`
// ---------------------------------------------------------------------------
export const characterPreAllMigrations: Record<string, unknown> = {
  id: TEST_CHARACTER_ID,
  version: "0.1.0",

  profile: {
    alias: "TestRunner",
    name: "Test Character",
    streetCred: 0,
    notoriety: 0,
  },

  biology: {
    metatype: "Human",
    awakening: "Mundane",
  },

  karma: { total: 0, current: 0 },

  nuyen: {
    current: 1000,
    // Pre-20251001 loan shape — no `id` or `interestRate`
    loans: [{ lender: "TestLender", amount: 500, notes: "test loan" }],
  },

  attributes: {
    body: 3,
    agility: 3,
    reaction: 3,
    strength: 3,
    charisma: 3,
    intuition: 3,
    logic: 3,
    willpower: 3,
    edge: 3,
    essence: 6,
    magic: 0,
    resonance: 0,
  },

  edge: { current: 3 },

  damage: { physical: 0, stun: 0, matrix: 0 },

  gear: {
    [TEST_WEAPON_ID]: {
      id: TEST_WEAPON_ID,
      itemType: "weapon",
      weaponType: "melee",
      name: "Combat Knife",
      // Pre-20260417: no `equipped` field
    },
    [TEST_VEHICLE_ID]: {
      id: TEST_VEHICLE_ID,
      itemType: "vehicle",
      vehicleType: "Car",
      name: "Runabout",
      handling: 4,
      accel: "10/20",
      pilot: 1,
      speed: 90,
      body: 8,
      armor: 4,
      // Pre-20260416: no `vehicleCategory` field
    },
  },

  skills: {
    activeSkills: [],
    skillGroups: [],
    knowledgeSkills: [],
    languageSkills: [],
  },

  qualities: [],
  contacts: [],

  // Pre-20250801 spell shape — no `theshold` field
  spells: [
    {
      name: "Fireball",
      category: "Combat",
      type: "Physical",
      range: "LoS",
      damage: "Physical",
      duration: "Instantaneous",
    },
  ],

  complexForms: [],
  sprites: [],
  adeptPowers: [],
}

// ---------------------------------------------------------------------------
// After 20250801_addSpellThreshold
// • spells:  `theshold: ""` added
// • loans:   still no `id` or `interestRate`
// • vehicle: still no `vehicleCategory`
// • weapon:  still no `equipped`
// • sheet:   still no `_meta_`
// ---------------------------------------------------------------------------
export const characterPost20250801: Record<string, unknown> = {
  ...characterPreAllMigrations,
  version: "0.2.0",
  spells: [
    {
      name: "Fireball",
      category: "Combat",
      type: "Physical",
      range: "LoS",
      damage: "Physical",
      duration: "Instantaneous",
      theshold: "",
    },
  ],
}

// ---------------------------------------------------------------------------
// After 20251001_addLoanIdAndInterestRate
// • spells:  `theshold: ""` present
// • loans:   `id` + `interestRate: 0` added
// • vehicle: still no `vehicleCategory`
// • weapon:  still no `equipped`
// • sheet:   still no `_meta_`
// ---------------------------------------------------------------------------
export const characterPost20251001: Record<string, unknown> = {
  ...characterPost20250801,
  nuyen: {
    current: 1000,
    loans: [
      {
        id: TEST_LOAN_ID,
        lender: "TestLender",
        amount: 500,
        interestRate: 0,
        notes: "test loan",
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// After 20260416_addVehicleCategory
// • spells:  `theshold: ""` present
// • loans:   `id` + `interestRate: 0` present
// • vehicle: `vehicleCategory: "vehicle"` added
// • weapon:  still no `equipped`
// • sheet:   still no `_meta_`
// ---------------------------------------------------------------------------
export const characterPost20260416: Record<string, unknown> = {
  ...characterPost20251001,
  gear: {
    [TEST_WEAPON_ID]: {
      id: TEST_WEAPON_ID,
      itemType: "weapon",
      weaponType: "melee",
      name: "Combat Knife",
      // still no `equipped`
    },
    [TEST_VEHICLE_ID]: {
      id: TEST_VEHICLE_ID,
      itemType: "vehicle",
      vehicleCategory: "vehicle",
      vehicleType: "Car",
      name: "Runabout",
      handling: 4,
      accel: "10/20",
      pilot: 1,
      speed: 90,
      body: 8,
      armor: 4,
    },
  },
}

// ---------------------------------------------------------------------------
// After 20260417_setDefaultEquippedWeapons
// • spells:  `theshold: ""` present
// • loans:   `id` + `interestRate: 0` present
// • vehicle: `vehicleCategory: "vehicle"` present
// • weapon:  `equipped: true` set on the first melee weapon
// • sheet:   still no `_meta_`
// ---------------------------------------------------------------------------
export const characterPost20260417: Record<string, unknown> = {
  ...characterPost20260416,
  gear: {
    [TEST_WEAPON_ID]: {
      id: TEST_WEAPON_ID,
      itemType: "weapon",
      weaponType: "melee",
      name: "Combat Knife",
      equipped: true,
    },
    [TEST_VEHICLE_ID]: {
      id: TEST_VEHICLE_ID,
      itemType: "vehicle",
      vehicleCategory: "vehicle",
      vehicleType: "Car",
      name: "Runabout",
      handling: 4,
      accel: "10/20",
      pilot: 1,
      speed: 90,
      body: 8,
      armor: 4,
    },
  },
}

// ---------------------------------------------------------------------------
// Fully migrated — v1 (after 20260418_addMeta)
// • spells:  `theshold: ""` present
// • loans:   `id` + `interestRate: 0` present
// • vehicle: `vehicleCategory: "vehicle"` present
// • weapon:  `equipped: true` present
// • sheet:   `_meta_: { version: 1 }` added
// ---------------------------------------------------------------------------
export const characterV1: Record<string, unknown> = {
  ...characterPost20260417,
  version: "0.5.0",
  _meta_: { version: 1 },
}
