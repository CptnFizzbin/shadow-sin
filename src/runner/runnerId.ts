import type { UUID } from "node:crypto"

export type RunnerId = string | UUID

export type RunnerRefLegacyPlaceholder = { source: string, id: UUID }

export function parseRunnerId(id: RunnerId): RunnerRefLegacyPlaceholder {
  const str = String(id)
  const pipeIndex = str.indexOf("|")

  if (pipeIndex === -1) {
    return { source: "local", id: str as UUID }
  }

  const source = str.slice(0, pipeIndex)
  const uuid = str.slice(pipeIndex + 1)

  if (!source || !uuid) {
    throw new Error(`Invalid RunnerId format: "${str}". Expected "source|uuid" or a plain UUID.`)
  }

  return { source, id: uuid as UUID }
}
