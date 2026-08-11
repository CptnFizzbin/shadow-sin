import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { selectAttributes } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { selectAwakeningData, selectMetatypeData } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { selectAllAttrs, selectAttr } from "./attribute.selectors.ts"

/**
 * `Selector<AttributesContextValue, TData>` tree — the one implementation of attribute-facet
 * logic. Read directly via `useAttrSelector` (nearest `AttributesProvider`, entity-agnostic), or
 * via `runnerAttributesCatalog` below (always the Runner's own), never reimplemented per consumer.
 */
export const attrSelectorsCatalog = {
  all: selectAllAttrs,
  forAttr: (key: AttributeKey) => ({
    min: (ctx: AttributesContextValue): number => selectAttr(ctx, key).min,
    max: (ctx: AttributesContextValue): number => selectAttr(ctx, key).max,
    augMax: (ctx: AttributesContextValue): number => selectAttr(ctx, key).augMax,
    value: (ctx: AttributesContextValue): number => selectAttr(ctx, key).value,
  }),
}

/** Mirrors the derivation `RunnerAttributesProvider` feeds into `AttributesProvider`. */
function toAttributesContextValue(state: RunnerData): AttributesContextValue {
  const metatype = selectMetatypeData(state)
  const awakening = selectAwakeningData(state)
  return {
    values: selectAttributes(state),
    infos: { ...metatype.attributes, ...awakening.attributes },
  }
}

/**
 * `attrSelectorsCatalog` applied against the Runner's own `AttributesContextValue` — a contramap,
 * not a second implementation. Composed by hand per leaf rather than a generic recursive mapper;
 * see docs/adr/0013-unify-runner-state-access.md for why.
 */
export const runnerAttributesCatalog = {
  all: (state: RunnerData) => attrSelectorsCatalog.all(toAttributesContextValue(state)),
  forAttr: (key: AttributeKey) => ({
    min: (state: RunnerData): number => attrSelectorsCatalog.forAttr(key).min(toAttributesContextValue(state)),
    max: (state: RunnerData): number => attrSelectorsCatalog.forAttr(key).max(toAttributesContextValue(state)),
    augMax: (state: RunnerData): number => attrSelectorsCatalog.forAttr(key).augMax(toAttributesContextValue(state)),
    value: (state: RunnerData): number => attrSelectorsCatalog.forAttr(key).value(toAttributesContextValue(state)),
  }),
}
