import { z } from "zod"

import type { CharacterId } from "./characterId.ts"

export interface SavedCharacter {
  id: CharacterId
  name: string
  lastModified: string // ISO 8601 timestamp
}

export const SavedCharacterSchema = z.object({
  id: z.string().transform((val) => val as CharacterId),
  name: z.string(),
  lastModified: z.string(),
}) satisfies z.ZodType<SavedCharacter>

export const CharacterIndexSchema = z.array(SavedCharacterSchema)
