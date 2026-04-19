/**
 * Versioned character-sheet fixtures for migration tests.
 *
 * Each export represents the raw JSON structure of a character at a specific
 * migration boundary — i.e. the state that would be found in storage BEFORE
 * the next set of migrations has run.  They intentionally omit fields that
 * hadn't been introduced yet, so they are typed as `Record<string, unknown>`
 * rather than `CharacterSheet`.
 *
 * Migration timeline (each migration adds its ID to `_meta_.appliedMigrations`
 * once run; the manager bootstraps `_meta_` with `appliedMigrations: []` for
 * characters that pre-date the tracking system):
 *
 *   characterOldFormat         – old flat YAML export shape (has `characterId`, not `id`)
 *   characterPreAllMigrations  – before any migration (oldest raw shape, no `_meta_`)
 *   characterPost20250801      – after 20250801_addSpellThreshold
 *   characterPost20251001      – after 20251001_addLoanIdAndInterestRate
 *   characterPost20260416      – after 20260416_addVehicleCategory
 *   characterPost20260417      – after 20260417_setDefaultEquippedWeapons
 *   characterPost20260418      – after 20260418_addMeta (has `_meta_`, still has old `version`)
 *   characterV1                – fully migrated (no `version` field, all migrations in `appliedMigrations`)
 */

// Stable UUIDs shared across all version fixtures so tests can reference them.
export const TEST_CHARACTER_ID = "ccccdddd-0000-0000-0000-000000000001" as const
export const TEST_WEAPON_ID = "ccccdddd-0000-0000-0000-000000000002" as const
export const TEST_VEHICLE_ID = "ccccdddd-0000-0000-0000-000000000003" as const
export const TEST_LOAN_ID = "ccccdddd-0000-0000-0000-000000000004" as const

// Stable UUIDs for the old-format character fixture
export const TEST_OLD_FORMAT_CHARACTER_ID = "00000000-0000-0000-0000-000000000000" as const
export const TEST_OLD_FORMAT_SIN_ID = "7ad0eba6-e9b1-4b0b-83cf-ee30c560e672" as const
export const TEST_OLD_FORMAT_LICENSE_ID = "89f99b5a-b065-4827-9bfd-50d7396f07ed" as const

// ---------------------------------------------------------------------------
// Old flat YAML export shape — before 20250101_normalizeOldFormatCharacter.
// This is the format produced by older versions of the app's YAML export.
// Key differences from the current CharacterSheet:
// • top-level `characterId` instead of `id`
// • `name`, `alias`, `lifestyle`, `lifestyleMonths`, `age`, `metatype`,
//   `awakening` at root (not nested under `profile`/`biology`)
// • `attributes` values are objects with `{min, max, augMax, value}` shape
// • `skills.activeSkillGroups` with `groupName` instead of `skillGroups` with `name`
// • `awakened.{spells, adeptPowers, complexForms, sprites}` instead of top-level
// • `gear` is an array (not a Record); may include empty `{}` entries
// • `itemType` uses plural/non-standard values (`"weapons"`, `"sins"`, `"misc"`)
// • Licenses link to parent SIN via `sinId` instead of `parentId`
// • Language skills use `isNative: true` flag instead of `rating: "native"`
// ---------------------------------------------------------------------------
export const characterV0 = {
  characterId: TEST_OLD_FORMAT_CHARACTER_ID,
  name: "Long",
  alias: "Blur",
  lifestyle: "Low",
  lifestyleMonths: 3,
  age: 0,
  metatype: "Human",
  awakening: "Mystic Adept",

  attributes: {
    body: { min: 1, max: 6, augMax: 9, value: 4 },
    agility: { min: 1, max: 6, augMax: 9, value: 5 },
    reaction: { min: 1, max: 6, augMax: 9, value: 5 },
    strength: { min: 1, max: 6, augMax: 9, value: 5 },
    charisma: { min: 1, max: 6, augMax: 9, value: 1 },
    intuition: { min: 1, max: 6, augMax: 9, value: 3 },
    logic: { min: 1, max: 6, augMax: 9, value: 1 },
    willpower: { min: 1, max: 6, augMax: 9, value: 3 },
    edge: { min: 2, max: 7, value: 2 },
    magic: { min: 1, max: 6, augMax: 0, value: 5 },
    resonance: { min: 0, max: 0, augMax: 0, value: 0 },
    essence: { min: 6, max: 6, value: 6 },
  },

  qualities: [
    {
      id: "78b60d44-68da-4b26-936c-45128e156750",
      name: "Pain Tolerance 2",
      type: "positive",
      description: "",
      bpValue: 10,
    },
    {
      id: "3fe412a9-094c-4e66-8e1c-cab7a24cdb6b",
      name: "Restricted Item",
      type: "positive",
      description: "",
      bpValue: 10,
    },
    {
      id: "19a46cb9-2206-4f52-9c6d-8b84c32bc0dc",
      name: "Sensitive System",
      type: "negative",
      description: "",
      bpValue: 15,
    },
  ],

  skills: {
    activeSkills: [
      { id: "868de255-f634-4927-862a-71ebff6f008b", name: "Blades", rating: 5, specialization: "Swords" },
      { id: "68f2db69-2f1a-4df4-83fc-f2c6793d323b", name: "Spellcasting", rating: 4 },
      { id: "4b7b3495-db1c-4324-93ff-ecc8bb751330", name: "Unarmed Combat", rating: 3 },
      { id: "3d6f7daa-3545-472d-adc5-19276552fc89", name: "Longarms", rating: 4, specialization: "Sniper Rifles" },
      { id: "1ee094b2-5141-445a-86e7-6512d4c80612", name: "Infiltration", rating: 4 },
      { id: "4e46fb68-7b0f-4aa0-a416-ae28e4ad3f9e", name: "Perception", rating: 3 },
      { id: "9fec0beb-fd20-42cb-85a1-0278234002d2", name: "Demolitions", rating: 2, specialization: "Commercial" },
    ],
    activeSkillGroups: [
      { id: "a03efaff-b854-4971-abc1-d465079de0c9", groupName: "Athletics", rating: 2 },
    ],
    knowledgeSkills: [
      { id: "9b3ce838-800f-4eda-aeb7-fda25efdb0ee", name: "Japanese History", rating: 3 },
    ],
    languageSkills: [
      { id: "5d17ce35-6545-43de-9498-aa759779c704", name: "English", isNative: true, rating: 0 },
      { id: "27a3db73-0815-46cb-a97b-9f4d0994612a", name: "Sylvan", isNative: false, rating: 4 },
    ],
  },

  awakened: {
    complexForms: [],
    sprites: [],
    spells: [
      {
        id: "10f6ca56-2501-4ca5-9dfd-4a53e545fc84",
        name: "IMPROVED INVISIBILITY",
        type: "Physical",
        range: "LoS",
        damage: "Physical",
        description: "",
      },
      {
        id: "9950ccef-03a7-4869-ad82-b500b963951c",
        name: "Oxygenate",
        type: "Physical",
        range: "LoS",
        damage: "Physical",
        description: "",
      },
    ],
    adeptPowers: [
      {
        id: "45b87148-3839-4313-ad44-c3889da2473e",
        name: "Astral Perception",
        rating: 1,
        costPerRating: 1,
        description: "",
        source: { book: "", page: 0 },
      },
      {
        id: "e12c4658-00ac-4871-a591-2ee5901a73ac",
        name: "Improved Senses",
        rating: 4,
        costPerRating: 0.25,
        description: "Direction, Scent, Flare, Sound",
        source: { book: "", page: 0 },
      },
      {
        id: "02d7954e-df06-4b71-9f7b-b01b4d548e94",
        name: "Improved Reflexes 2",
        rating: 1,
        costPerRating: 2.5,
        description: "",
        source: { book: "", page: 0 },
      },
      {
        id: "d9aaf66f-bec7-45bb-822f-c967f6658752",
        name: "Kinesics",
        rating: 1,
        costPerRating: 0.5,
        description: "",
        source: { book: "", page: 0 },
      },
    ],
  },

  contacts: [
    { id: "c1c687c9-a2a0-493c-a645-62df63a833fc", name: "Talismonger", connection: 2, loyalty: 1 },
    { id: "b2e3e451-efc9-42e1-ba0f-413e75f71501", name: "Candy (Fixer)", connection: 3, loyalty: 1 },
  ],

  buildPoints: {
    total: 400,
    spent: { metatype: 0, qualities: 0, attributes: 200, skills: 0, gear: 1 },
  },

  // gear is an array in the old format; leading entries may be empty {}
  gear: [
    {},
    {},
    {},
    {
      id: "18f65514-6d3a-4667-8513-baad8751765b",
      name: "Power Foci 2",
      cost: 50000,
      quantity: 1,
      description: "",
      availability: { rating: 0, restricted: false, forbidden: false },
      source: { book: "", page: 0 },
      itemType: "misc",
    },
    {
      id: "d93581d1-b323-4fcb-b572-c4a95c7f9ce5",
      name: "SM-4",
      cost: 6200,
      quantity: 1,
      description: "",
      availability: { rating: 0, restricted: false, forbidden: false },
      source: { book: "", page: 0 },
      itemType: "weapons",
    },
    {
      id: "14912365-ddc2-4800-9bed-c373db404c5c",
      name: "Monofilament Sword",
      cost: 750,
      quantity: 1,
      description: "",
      availability: { rating: 0, restricted: false, forbidden: false },
      source: { book: "", page: 0 },
      itemType: "weapons",
    },
    {
      id: "97a8a21d-e495-49d5-8f55-c04ee4477a5d",
      name: "Armor Jacket",
      cost: 900,
      quantity: 1,
      description: "",
      availability: { rating: 0, restricted: false, forbidden: false },
      source: { book: "", page: 0 },
      itemType: "armor",
    },
    {
      id: "c34eee95-bee7-46b1-b1d5-29f7ee188c1a",
      name: "Contact Lenses 3",
      cost: 150,
      quantity: 1,
      description: "",
      availability: { rating: 0, restricted: false, forbidden: false },
      source: { book: "", page: 0 },
      itemType: "devices",
    },
    {
      id: "88c039ae-4555-4a23-ae1e-90ba178017e6",
      name: "CMT Clip Commlink (1/3)",
      cost: 300,
      quantity: 1,
      description: "",
      availability: { rating: 0, restricted: false, forbidden: false },
      source: { book: "", page: 0 },
      itemType: "devices",
    },
    { id: TEST_OLD_FORMAT_SIN_ID, name: "Long Xiang", rating: 3, cost: 3000, itemType: "sins" },
    {
      id: TEST_OLD_FORMAT_LICENSE_ID,
      name: "Monofilament Sword",
      sinId: TEST_OLD_FORMAT_SIN_ID,
      rating: "3",
      cost: 300,
      itemType: "licenses",
    },
    {
      id: "4a9ee940-94ad-42a2-9411-5ce67cc85ed3",
      name: "Indian Pathfinder",
      cost: 6000,
      quantity: 1,
      description: "",
      availability: { rating: 0, restricted: false, forbidden: false },
      source: { book: "", page: 0 },
      itemType: "vehicles",
    },
  ],
}

// ---------------------------------------------------------------------------
// Oldest shape — before any migration has been applied.
// • spells:  no `threshold` field
// • loans:   no `id`, no `interestRate`
// • vehicle: no `vehicleCategory`
// • weapon:  no `equipped`
// • sheet:   no `_meta_`, has old `version` string
// ---------------------------------------------------------------------------
export const characterV1_0 = {
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

  // Pre-20250801 spell shape — no `threshold` field
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
// • spells:  `threshold: ""` added
// • loans:   still no `id` or `interestRate`
// • vehicle: still no `vehicleCategory`
// • weapon:  still no `equipped`
// • sheet:   still no `_meta_`, still has old `version`
// ---------------------------------------------------------------------------
export const characterV1_20250801 = {
  ...characterV1_0,
  _meta_: { version: 1, appliedMigrations: ["20250801"] },
  spells: [
    {
      name: "Fireball",
      category: "Combat",
      type: "Physical",
      range: "LoS",
      damage: "Physical",
      duration: "Instantaneous",
      threshold: "",
    },
  ],
}

// ---------------------------------------------------------------------------
// After 20251001_addLoanIdAndInterestRate
// • spells:  `threshold: ""` present
// • loans:   `id` + `interestRate: 0` added
// • vehicle: still no `vehicleCategory`
// • weapon:  still no `equipped`
// • sheet:   still no `_meta_`, still has old `version`
// ---------------------------------------------------------------------------
export const characterV1_20251001 = {
  ...characterV1_20250801,
  _meta_: { version: 1, appliedMigrations: ["20250801", "20251001"] },
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
// • spells:  `threshold: ""` present
// • loans:   `id` + `interestRate: 0` present
// • vehicle: `vehicleCategory: "vehicle"` added
// • weapon:  still no `equipped`
// • sheet:   still no `_meta_`, still has old `version`
// ---------------------------------------------------------------------------
export const characterV1_20260416 = {
  ...characterV1_20251001,
  _meta_: { version: 1, appliedMigrations: ["20250801", "20251001", "20260416"] },
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
// • spells:  `threshold: ""` present
// • loans:   `id` + `interestRate: 0` present
// • vehicle: `vehicleCategory: "vehicle"` present
// • weapon:  `equipped: true` set on the first melee weapon
// • sheet:   still no `_meta_`, still has old `version`
// ---------------------------------------------------------------------------
export const characterV1_20260417 = {
  ...characterV1_20260416,
  _meta_: {
    version: 1,
    appliedMigrations: ["20250801", "20251001", "20260416", "20260417"],
  },
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
// After 20260418_addMeta
// All previous migrations applied; `_meta_` updated; old `version` still present.
// ---------------------------------------------------------------------------
export const characterV1_20260418 = {
  ...characterV1_20260417,
  version: "0.1.0",
  _meta_: {
    version: 1,
    appliedMigrations: ["20250801", "20251001", "20260416", "20260417", "20260418"],
  },
}

// ---------------------------------------------------------------------------
// Fully migrated — v1 (after 20260419_removeVersionField)
// • All migrations in `appliedMigrations`
// • `version` field removed by 20260419
// ---------------------------------------------------------------------------
const { version, ...rest } = characterV1_20260418
export const characterV1 = {
  ...rest,
  _meta_: {
    version: 1,
    appliedMigrations: [
      "20250801",
      "20251001",
      "20260416",
      "20260417",
      "20260418",
      "20260419",
    ],
  },
}
