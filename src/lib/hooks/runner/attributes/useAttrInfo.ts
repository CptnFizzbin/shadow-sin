import { BiologySelectors } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

/**
 * Returns metadata (min, max, augMax) for every attribute, derived from the runner's metatype and
 * awakening type. Unlike attribute values (see `useEntitySelector`/`AttrSelectors`), these bounds
 * are always the Runner's own — a metatype/awakening-derived concept with no "nearest entity"
 * equivalent for devices, spirits, or sprites.
 */
export const useAllAttrInfos = (): Record<AttributeKey, AttributeInfo> => {
  const metatype = useRunnerSelector(BiologySelectors.selectMetatypeInfo)
  const awakening = useRunnerSelector(BiologySelectors.selectAwakeningInfo)

  return { ...metatype.attributes, ...awakening.attributes }
}

/**
 * Returns the metadata (min, max, augMax) for the given attribute, derived from the runner's
 * metatype and awakening type.
 */
export const useAttrInfo = (attr: AttributeKey): AttributeInfo => {
  return useAllAttrInfos()[attr]
}
