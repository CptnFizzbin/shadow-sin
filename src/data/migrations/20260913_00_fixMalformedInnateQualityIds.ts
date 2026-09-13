import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface OldQuality {
  id?: string
}

/**
 * Pixie's innate Qualities (`metatypeData.ts`) previously carried hardcoded placeholder ids that
 * were not valid UUIDs. `EntityWithQualitiesSchema` requires every Quality id to be a valid
 * `z.uuid()` — the Viewer's header narrows the runner entity to `isEntityWithQualities` on every
 * render (see `DamageSelectors`), so a Quality with a malformed id fails that check and throws,
 * crashing the whole sheet on load rather than just the Qualities section. Any Runner that picked
 * up those ids (via the Builder's Pixie metatype selection, or a hand-edited/imported sheet) still
 * carries them. This remaps the two known malformed ids to the corrected ids now hardcoded in
 * `metatypeData.ts`, and backfills a fresh id onto any other Quality whose id isn't a valid UUID.
 */
const REMAPPED_IDS: Record<string, string> = {
  "6c1d4e5f-7a8b-9c0d-1e2f-3a4b5c6d7e8f": "364b1c68-15fa-45ef-8c4c-621498a05d72",
  "7d2e5f6a-8b9c-0d1e-2f3a-4b5c6d7e8f9a": "38d53d59-5237-4a50-9f34-29aebb478218",
}

// RFC 9562 UUID: 8-4-4-4-12 hex digits, a version nibble of 1-8, and an RFC4122 variant nibble.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const migration: CharacterMigration<{ qualities?: OldQuality[] }> = {
  timestamp: "2026-09-13T18:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      for (const quality of draft.qualities ?? []) {
        if (quality.id === undefined || UUID_PATTERN.test(quality.id)) continue
        quality.id = REMAPPED_IDS[quality.id] ?? crypto.randomUUID()
      }
    })
  },
}

export default migration
