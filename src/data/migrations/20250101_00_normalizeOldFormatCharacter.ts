import type { CharacterMigration } from "#/data/characterMigration.ts"

interface OldAttributeValue {
  value: number
}

interface OldSkillGroup {
  groupName: string
  rating: number
}

interface OldLanguageSkill {
  name: string
  isNative?: boolean
  rating: number
}

interface OldGearItem {
  id?: string
  itemType?: string
  sinId?: string

  [key: string]: unknown
}

interface OldAwakened {
  spells?: unknown[]
  adeptPowers?: unknown[]
  complexForms?: unknown[]
  sprites?: unknown[]
}

interface OldFormatCharacter {
  characterId?: string
  name?: string
  alias?: string
  lifestyle?: string
  lifestyleMonths?: number
  age?: number
  metatype?: string
  awakening?: string
  attributes?: Record<string, OldAttributeValue | number>
  skills?: {
    activeSkills?: unknown[]
    activeSkillGroups?: OldSkillGroup[]
    knowledgeSkills?: unknown[]
    languageSkills?: OldLanguageSkill[]
    skillGroups?: unknown[]
  }
  awakened?: OldAwakened
  gear?: OldGearItem[] | Record<string, unknown>
  buildPoints?: unknown
  spells?: unknown[]
  adeptPowers?: unknown[]
  complexForms?: unknown[]
  sprites?: unknown[]
  karma?: unknown
  nuyen?: unknown
  edge?: unknown
  damage?: unknown

  [key: string]: unknown
}

/**
 * Maps old plural / non-standard itemType strings to the current ItemType enum
 * values.  Keys not listed here are kept as-is (they may already be valid).
 */
const ITEM_TYPE_MAP: Record<string, string> = {
  misc: "other",
  weapons: "weapon",
  devices: "device",
  vehicles: "vehicle",
  sins: "sin",
  licenses: "license",
}

/**
 * Migrates characters saved in the old flat YAML export format to the current
 * nested RunnerData structure.
 *
 * Old format indicators:
 * - Top-level `characterId` field (instead of `id`)
 * - `name`, `alias`, `lifestyle`, `lifestyleMonths`, `age`, `metatype`,
 *   `awakening` all at the root (instead of nested under `profile`/`biology`)
 * - `attributes` values are objects `{min, max, augMax, value}` (not plain numbers)
 * - Skills stored under `activeSkillGroups` with `groupName` key
 * - Spells/adeptPowers/complexForms/sprites nested under an `awakened` object
 * - `gear` is an array (not a `Record<id, item>`); entries may be empty `{}`
 * - `itemType` values use plural or non-standard strings (e.g. `"weapons"`,
 *   `"sins"`, `"misc"`)
 * - Licenses reference their parent SIN via `sinId` instead of `parentId`
 * - Language skills have an `isNative` boolean flag instead of `"native"` rating
 */
const migration: CharacterMigration<Record<string, unknown>> = {
  timestamp: "2025-01-01T00:00:00Z",
  up: (character) => {
    // Only transform characters in the old flat format.
    if (!("characterId" in character)) {
      return character as Record<string, unknown>
    }

    const old = character as OldFormatCharacter

    // ── Attributes ────────────────────────────────────────────────────────────
    // Old: {body: {min: 1, max: 6, augMax: 9, value: 4}, ...}
    // New: {body: 4, ...}
    const flatAttributes: Record<string, number> = {}
    for (const [key, val] of Object.entries(old.attributes ?? {})) {
      flatAttributes[key] =
        typeof val === "object" && val !== null
          ? (val as OldAttributeValue).value
          : (val as number)
    }

    // ── Skill groups ──────────────────────────────────────────────────────────
    // Old: [{id?, groupName: "Athletics", rating: 2}]
    // New: [{name: "Athletics", rating: 2}]
    const skillGroups = (old.skills?.activeSkillGroups ?? []).map(
      ({ groupName, rating }) => ({ name: groupName, rating }),
    )

    // ── Language skills ───────────────────────────────────────────────────────
    // Old: [{name: "English", isNative: true, rating: 0}]
    // New: [{name: "English", rating: "native"}]
    const languageSkills = (old.skills?.languageSkills ?? []).map(
      ({ name, isNative, rating }) => ({
        name,
        rating: isNative ? ("native" as const) : rating,
      }),
    )

    // ── Awakened arrays ───────────────────────────────────────────────────────
    // Old: awakened.{spells, adeptPowers, complexForms, sprites}
    // New: top-level {spells, adeptPowers, complexForms, sprites}
    const { awakened } = old
    const spells = awakened?.spells ?? old.spells ?? []
    const adeptPowers = awakened?.adeptPowers ?? old.adeptPowers ?? []
    const complexForms = awakened?.complexForms ?? old.complexForms ?? []
    const sprites = awakened?.sprites ?? old.sprites ?? []

    // ── Gear ──────────────────────────────────────────────────────────────────
    // Old: flat array, may contain empty {}, uses plural itemType strings,
    //      licenses carry sinId pointing to their parent SIN.
    // New: Record<id, ItemData>
    const gearRecord: Record<string, Record<string, unknown>> = {}

    if (Array.isArray(old.gear)) {
      // First pass: build the flat record, normalising itemType
      for (const rawItem of old.gear) {
        if (
          !rawItem
          || typeof rawItem !== "object"
          || !("id" in rawItem)
          || !(rawItem as Record<string, unknown>).id
        ) {
          continue
        }
        const item = rawItem as Record<string, unknown>
        const oldItemType = item.itemType as string | undefined
        gearRecord[item.id as string] = {
          ...item,
          itemType: oldItemType
            ? (ITEM_TYPE_MAP[oldItemType] ?? oldItemType)
            : oldItemType,
        }
      }

      // Second pass: resolve sinId → parentId on licenses, childIds on SINs
      for (const item of Object.values(gearRecord)) {
        const sinId = item.sinId as string | undefined
        if (item.itemType === "license" && sinId) {
          item.parentId = sinId
          delete item.sinId
          const sinItem = gearRecord[sinId]
          if (sinItem) {
            const existingChildIds = (sinItem.childIds as string[] | undefined) ?? []
            sinItem.childIds = [...existingChildIds, item.id as string]
          }
        }
      }
    } else if (old.gear && typeof old.gear === "object") {
      // Already a Record — keep as-is
      Object.assign(gearRecord, old.gear)
    }

    // ── Profile ───────────────────────────────────────────────────────────────
    const profile: Record<string, unknown> = {
      alias: old.alias ?? "",
      name: old.name ?? "",
      streetCred: 0,
      notoriety: 0,
    }
    if (old.lifestyle) {
      profile.lifestyle = {
        quality: old.lifestyle,
        monthsPaid: old.lifestyleMonths ?? 0,
      }
    }

    // ── Biology ───────────────────────────────────────────────────────────────
    const biology: Record<string, unknown> = {
      metatype: old.metatype ?? "Human",
      awakening: old.awakening ?? "Mundane",
    }
    if (old.age !== undefined) {
      biology.age = old.age
    }

    // ── Strip relocated / obsolete top-level fields ───────────────────────────
    const {
      characterId,
      name: _name,
      alias: _alias,
      lifestyle: _lifestyle,
      lifestyleMonths: _lifestyleMonths,
      age: _age,
      metatype: _metatype,
      awakening: _awakening,
      buildPoints: _buildPoints,
      awakened: _awakened,
      attributes: _attributes,
      skills: _skills,
      gear: _gear,
      spells: _spells,
      adeptPowers: _adeptPowers,
      complexForms: _complexForms,
      sprites: _sprites,
      ...rest
    } = old

    return {
      ...rest,
      id: characterId,
      profile,
      biology,
      attributes: flatAttributes,
      skills: {
        activeSkills: old.skills?.activeSkills ?? [],
        skillGroups,
        knowledgeSkills: old.skills?.knowledgeSkills ?? [],
        languageSkills,
      },
      karma: old.karma ?? { total: 0, current: 0 },
      nuyen: old.nuyen ?? { current: 0, loans: [] },
      edge: old.edge ?? { current: flatAttributes.edge ?? 0 },
      damage: old.damage ?? { physical: 0, stun: 0, matrix: 0 },
      gear: gearRecord,
      spells,
      adeptPowers,
      complexForms,
      sprites,
    }
  },
}

export default migration
