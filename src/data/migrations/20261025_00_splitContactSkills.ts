import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface LegacyContactSkill {
  name: string
  rating?: number
  type?: string
  specialization?: string
}

interface MigratingContact {
  knowledgeSkills?: LegacyContactSkill[]
  skills?: LegacyContactSkill[]
}

/**
 * Replace each contact's rated `knowledgeSkills` with unrated `skills`, each typed as Key Active
 * or Knowledge. Skills without a type become Knowledge skills.
 */
const migration: CharacterMigration<{ contacts?: MigratingContact[] }> = {
  timestamp: "2026-10-25T14:20:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      for (const contact of draft.contacts ?? []) {
        const legacySkills = contact.knowledgeSkills ?? []
        delete contact.knowledgeSkills
        contact.skills = [...(contact.skills ?? []), ...legacySkills].map(({ name, type, specialization }) => ({
          name,
          type: type ?? "knowledge",
          ...(specialization !== undefined && { specialization }),
        }))
      }
    })
  },
}

export default migration
