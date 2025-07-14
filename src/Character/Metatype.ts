import {
  MetatypeIds as CrbMetatypeIds,
  Metatypes as CrbMetatypes,
} from "../data/Rulebooks/CRB"
import { CharacterQuality } from "../Qualities/CharacterQuality"
import { CharAttributes } from "./CharacterData"

export type MetatypeId = string

export interface Metatype {
  id: MetatypeId
  name: string
  qualities: CharacterQuality[]
  priorityLevels: string[]
  attrMaximums: CharAttributes
}

export const MetatypeIds = {
  CRB: CrbMetatypeIds,
}

export const Metatypes: Record<MetatypeId, Metatype> = {}
const registerMetatype = (metatype: Metatype) =>
  (Metatypes[metatype.id] = metatype)

CrbMetatypes.forEach(registerMetatype)

const MetatypeNames: Record<MetatypeId, string> = Object.entries(
  Metatypes,
).reduce((names, [id, metatype]) => ({ ...names, [id]: metatype.name }), {})

export function formatMetatype(metatypeId: MetatypeId): string {
  return MetatypeNames[metatypeId] || ""
}
