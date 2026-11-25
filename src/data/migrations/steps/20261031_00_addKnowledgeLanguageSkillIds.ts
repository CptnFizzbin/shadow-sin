import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { uuid } from "#/utils/uuidUtils.ts"

interface MigratingSkill {
  id?: string
  name?: string
}

/**
 * Give every Knowledge and Language skill an `id`. Skills were matched by name, so renaming one
 * added a second copy instead of updating it; an id keeps the skill's identity through a rename.
 */
const migration: CharacterMigration<{
  skills?: { knowledgeSkills?: MigratingSkill[], languageSkills?: MigratingSkill[] }
}> = {
  timestamp: "2026-10-31T13:05:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      for (const skill of [...(draft.skills?.knowledgeSkills ?? []), ...(draft.skills?.languageSkills ?? [])]) {
        skill.id ??= uuid.v7()
      }
    })
  },
}

export default migration
