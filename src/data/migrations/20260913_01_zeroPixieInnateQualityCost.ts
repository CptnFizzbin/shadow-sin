import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface OldQuality {
  id?: string
  bpValue?: number
}

/** The corrected, valid-UUID ids `metatypeData.ts` hardcodes for Pixie's innate Qualities — see
 *  `20260913_00_fixMalformedInnateQualityIds.ts`, which runs first and remaps any older malformed
 *  id a Runner might still carry to these. */
const PIXIE_INNATE_QUALITY_IDS = new Set([
  "364b1c68-15fa-45ef-8c4c-621498a05d72", // Vanish
  "38d53d59-5237-4a50-9f34-29aebb478218", // Uneducated
])

/**
 * Zeroes the `bpValue` of Vanish and Uneducated when they carry one of Pixie's innate-Quality ids.
 * Both are part of the Pixie metatype package (already priced into its own BP cost) rather than
 * separately bought/sold Qualities, so they shouldn't also charge or refund BP/karma on their own
 * — but `metatypeData.ts` previously hardcoded Uneducated at its normal metahuman cost (20 BP) and
 * left Vanish's `bpValue` unset. Only the two specific innate ids are matched — a Runner who
 * separately chose Uneducated as an ordinary negative Quality keeps its normal cost.
 */
const migration: CharacterMigration<{ qualities?: OldQuality[] }> = {
  timestamp: "2026-09-13T18:30:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      for (const quality of draft.qualities ?? []) {
        if (quality.id !== undefined && PIXIE_INNATE_QUALITY_IDS.has(quality.id)) {
          quality.bpValue = 0
        }
      }
    })
  },
}

export default migration
