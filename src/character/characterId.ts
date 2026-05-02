import type { UUID } from "node:crypto"

// A CharacterId encodes both the storage source and the character's UUID,
// allowing characters from multiple backends to coexist without ID collisions.
//
// Format: "${source}|${uuid}" e.g. "local|abc-123-def-456"
// The source "local" refers to LocalStorageProvider.
// A plain UUID string implies the "local" source.
export type CharacterId = string | UUID

export type CharacterRef = { source: string, id: UUID }

// Parse a CharacterId into its source and uuid parts.
// Accepts a plain UUID string and coerces it to a "local" CharacterId for
// backward-compatibility.
export function parseCharacterId(id: CharacterId): CharacterRef {
  const str = String(id)
  const pipeIndex = str.indexOf("|")

  if (pipeIndex === -1) {
    // Plain UUID — default source is "local"
    return { source: "local", id: str as UUID }
  }

  const source = str.slice(0, pipeIndex)
  const uuid = str.slice(pipeIndex + 1)

  if (!source || !uuid) {
    throw new Error(`Invalid CharacterId format: "${str}". Expected "source|uuid" or a plain UUID.`)
  }

  return { source, id: uuid as UUID }
}
