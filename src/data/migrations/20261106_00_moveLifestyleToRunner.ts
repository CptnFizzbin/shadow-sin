import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

// Frozen copy of the standard lifestyle upkeeps at the time of this migration, so later changes to
// the live lifestyle table can't change what this migration produces.
const STANDARD_UPKEEP: Record<string, number> = {
  Street: 0,
  Squatter: 500,
  Low: 2_000,
  Middle: 5_000,
  High: 10_000,
  Luxury: 100_000,
}

interface MovedLifestyle {
  name: string
  upkeep: number
  monthsPaid: number
  notes?: string
}

/**
 * Move the Runner's lifestyle from `profile.lifestyle` (`{ quality, monthsPaid }`, possibly `null`) to a top-level
 * `lifestyle` (`{ name, upkeep, monthsPaid, notes? }`), so a lifestyle can carry a custom upkeep or an income. A
 * missing lifestyle becomes Street with one month prepaid — what the sheet already showed for it.
 */
const migration: CharacterMigration<{
  profile?: { lifestyle?: { quality?: string, monthsPaid?: number } | null }
  lifestyle?: MovedLifestyle
}> = {
  timestamp: "2026-11-06T22:48:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      if (!draft.lifestyle) {
        const previous = draft.profile?.lifestyle
        const name = previous?.quality && Object.hasOwn(STANDARD_UPKEEP, previous.quality) ? previous.quality : "Street"
        draft.lifestyle = {
          name,
          upkeep: STANDARD_UPKEEP[name],
          monthsPaid: previous?.monthsPaid ?? 1,
        }
      }

      if (draft.profile) delete draft.profile.lifestyle
    })
  },
}

export default migration
