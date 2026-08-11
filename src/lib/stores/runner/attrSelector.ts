import type { Selector } from "reselect"

import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { useAttributesContext } from "#/lib/contexts/runner/attributesProvider.tsx"

import { attrSelectorsCatalog } from "./selectors/attribute.catalog.ts"

export type AttrSelectorCatalog = typeof attrSelectorsCatalog

/**
 * Reads attribute values/metadata relative to the nearest `AttributesProvider` in the render
 * tree — entity-agnostic by design, so the same hook serves the Runner, a drone, a spirit, a
 * sprite, or whatever else mounts a provider (see `AttributesProvider`'s doc comment). `picker`
 * receives the attribute catalog and returns whichever `Selector` it needs.
 *
 * @example
 * const droneAgility = useAttrSelector(({ forAttr }) => forAttr(AttributeKey.agility).value)
 */
export function useAttrSelector<T>(
  picker: (catalog: AttrSelectorCatalog) => Selector<AttributesContextValue, T>,
): T {
  const attributesContext = useAttributesContext()
  return picker(attrSelectorsCatalog)(attributesContext)
}
