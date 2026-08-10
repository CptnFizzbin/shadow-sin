import { useAttributesContext } from "#/lib/contexts/runner/attributesProvider.tsx"

import { useRunnerStoreSelector } from "./runnerStore.selectors.ts"
import type { RunnerAttributeCatalog } from "./selectors/attribute.catalog.ts"
import { buildAttributeCatalog } from "./selectors/attribute.catalog.ts"
import type { RunnerDamageCatalog } from "./selectors/damage.catalog.ts"
import { buildDamageCatalog } from "./selectors/damage.catalog.ts"
import type { RunnerItemCatalog } from "./selectors/item.catalog.ts"
import { buildItemCatalog } from "./selectors/item.catalog.ts"
import type { RunnerModifiersCatalog } from "./selectors/modifiers.catalog.ts"
import { buildModifiersCatalog } from "./selectors/modifiers.catalog.ts"

/**
 * The namespaced menu `useRunnerSelector`'s callback picks from. Mirrors the existing
 * `Selectors.<domain>` split — each entry is either callable by key (returning a facet object)
 * or a bare property for a value that doesn't need one.
 */
export interface RunnerSelectorCatalog {
  attribute: RunnerAttributeCatalog
  damage: RunnerDamageCatalog
  item: RunnerItemCatalog
  modifiers: RunnerModifiersCatalog
}

/**
 * The one way to read `RunnerData` — proof of concept for
 * `docs/adr/0013-unify-runner-state-access.md`. `picker` receives a namespaced catalog
 * (mirroring the existing `Selectors.<domain>` split) and returns whichever value it needs;
 * every catalog entry is backed by exactly one selector, never a parallel implementation.
 *
 * Only the `attribute` namespace resolves relative to a hosting entity today (via the nearest
 * `AttributesProvider`, currently always the Runner's own — see ADR-0013's non-goals). Every
 * other namespace reads `RunnerData` directly.
 *
 * @example
 * const system = useRunnerSelector(({ attribute }) => attribute(AttributeKey.system).baseValue)
 * const physicalDamage = useRunnerSelector(({ damage }) => damage(DamageTrackKey.physical).current)
 * const woundMod = useRunnerSelector(({ damage }) => damage.woundMod)
 * const effectiveArmor = useRunnerSelector(({ item }) => item.armor.effective)
 */
export function useRunnerSelector<T>(
  picker: (catalog: RunnerSelectorCatalog) => T,
  compare?: (prev: T, next: T) => boolean,
): T {
  const attributesContext = useAttributesContext()

  return useRunnerStoreSelector(
    (state) => {
      const attribute = buildAttributeCatalog(attributesContext)

      return picker({
        attribute,
        damage: buildDamageCatalog(state),
        item: buildItemCatalog(state, attribute),
        modifiers: buildModifiersCatalog(state),
      })
    },
    compare,
  )
}
