import { MetatypeId as CrbMetatypeId, Metatypes as CrbMetatypes } from '../data/Rulebooks/CRB'
import { QualityId } from '../Qualities/Quality'
import { CharAttributes } from './CharacterData'

export type MetatypeId = string;

export interface Metatype {
  id: MetatypeId
  name: string
  qualities: QualityId[]
  priorityLevels: string[]
  attrMaximums: CharAttributes
}

export const MetatypeIds: Record<string, MetatypeId> = {
  ...CrbMetatypeId,
}

export const Metatypes: Record<MetatypeId, Metatype> = {
  ...CrbMetatypes,
}

const MetatypeNames: Record<MetatypeId, string> = Object.entries(Metatypes)
  .reduce((names, [id, metatype]) => ({ ...names, [id]: metatype.name }), {})

export function formatMetatype (metatypeId: MetatypeId): string {
  return MetatypeNames[metatypeId] || ''
}
