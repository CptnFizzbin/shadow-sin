import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { BiologySelectors } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"

/**
 * `AttributeInfo` bounds plus the runner's own base (raw stored) and current (effective) values
 * for one attribute — see `AttrSelectors.selectBase`/`selectValue`.
 */
export interface RunnerAttrInfo extends AttributeInfo {
  base: number
  current: number
}

/**
 * Returns bounds and values for every attribute, derived from the runner's metatype/awakening
 * type and stored attribute values. Unlike attribute values on their own (see
 * `useEntitySelector`/`AttrSelectors`), these bounds are always the Runner's own — a
 * metatype/awakening-derived concept with no "nearest entity" equivalent for devices, spirits, or
 * sprites.
 */
export const useAllRunnerAttrInfos = (): Record<AttributeKey, RunnerAttrInfo> => {
  const metatype = useRunnerSelector(BiologySelectors.selectMetatypeInfo)
  const awakening = useRunnerSelector(BiologySelectors.selectAwakeningInfo)
  const attributes = useRunnerSelector(AttrSelectors.selectAll)

  const bounds = { ...metatype.attributes, ...awakening.attributes }
  const entity = { attributes }

  return Object.fromEntries(
    Object.entries(bounds).map(([attr, info]) => [
      attr,
      {
        ...info,
        base: AttrSelectors.selectBase({ entity }, { key: attr as AttributeKey }),
        current: AttrSelectors.selectValue({ entity }, { key: attr as AttributeKey }),
      },
    ]),
  ) as Record<AttributeKey, RunnerAttrInfo>
}

/**
 * Returns bounds and values for the given attribute, derived from the runner's metatype/awakening
 * type and stored attribute value.
 */
export const useRunnerAttrInfo = (attr: AttributeKey): RunnerAttrInfo => {
  return useAllRunnerAttrInfos()[attr]
}
