import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface OldLanguageSkill {
  rating?: unknown
  isNative?: unknown
}

/**
 * `LanguageSkillData` retires its `rating: "native"` string-sentinel case (see #535) for an
 * explicit `isNative` flag: a language skill whose `rating` was the `"native"` sentinel becomes
 * `{ isNative: true }` (dropping `rating` entirely); any other rating value becomes
 * `{ isNative: false, rating: <that value> }`. Idempotent — a skill already carrying `isNative`
 * (this migration's own output) is left untouched.
 */
const migration: CharacterMigration<{ skills?: { languageSkills?: OldLanguageSkill[] } }> = {
  timestamp: "2026-08-30T09:10:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      const languageSkills = draft.skills?.languageSkills
      if (!languageSkills) return

      for (const skill of languageSkills) {
        if ("isNative" in skill) continue

        if (skill.rating === "native") {
          delete skill.rating
          skill.isNative = true
        } else {
          skill.isNative = false
        }
      }
    })
  },
}

export default migration
