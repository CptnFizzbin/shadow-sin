import type { Selector } from "reselect"

import type { RunnerData } from "#/system/runnerData.ts"

import { useRunnerStoreSelector } from "./runnerStore.selectors.ts"
import { runnerAttributesCatalog } from "./selectors/attribute.catalog.ts"
import { biologyCatalog } from "./selectors/biology.catalog.ts"
import { complexFormsCatalog } from "./selectors/complexForms.catalog.ts"
import { damageCatalog } from "./selectors/damage.catalog.ts"
import { itemCatalog } from "./selectors/item.catalog.ts"
import { karmaCapsCatalog } from "./selectors/karmaCaps.catalog.ts"
import { magicAdvancementCatalog } from "./selectors/magicAdvancement.catalog.ts"
import { modifiersCatalog } from "./selectors/modifiers.catalog.ts"
import { qualitiesCatalog } from "./selectors/qualities.catalog.ts"
import { skillsCatalog } from "./selectors/skills.catalog.ts"

/**
 * The namespaced menu `useRunnerSelector`'s callback picks from. Mirrors the existing
 * `Selectors.<domain>` split — each entry is a `Selector<RunnerData, TData>`, or a scoped-lookup
 * factory returning one (`byId`/`byType`/`forAttr`/`forTrack`/`forSkill`/`forModifier`, plus an
 * `all` sibling covering every key at once). Each namespace's shape is inferred from its catalog
 * module rather than hand-declared, so there's exactly one place that defines it.
 */
export interface RunnerSelectorCatalog {
  attributes: typeof runnerAttributesCatalog
  biology: typeof biologyCatalog
  complexForms: typeof complexFormsCatalog
  damage: typeof damageCatalog
  item: typeof itemCatalog
  karmaCaps: typeof karmaCapsCatalog
  magicAdvancement: typeof magicAdvancementCatalog
  modifiers: typeof modifiersCatalog
  qualities: typeof qualitiesCatalog
  skills: typeof skillsCatalog
}

// Built once, at module scope — every entry is a Selector reference or a factory that returns
// one, so this costs nothing to construct and never closes over RunnerData. See "The catalog
// mechanism" in docs/adr/0013-unify-runner-state-access.md.
const runnerSelectorCatalog: RunnerSelectorCatalog = {
  attributes: runnerAttributesCatalog,
  biology: biologyCatalog,
  complexForms: complexFormsCatalog,
  damage: damageCatalog,
  item: itemCatalog,
  karmaCaps: karmaCapsCatalog,
  magicAdvancement: magicAdvancementCatalog,
  modifiers: modifiersCatalog,
  qualities: qualitiesCatalog,
  skills: skillsCatalog,
}

/**
 * The one way to read `RunnerData` — see `docs/adr/0013-unify-runner-state-access.md`. `picker`
 * receives the namespaced catalog and returns whichever `Selector<RunnerData, T>` it needs; the
 * hook applies `RunnerData` to it once. Every catalog entry is backed by exactly one selector,
 * never a parallel implementation.
 *
 * For values relative to something other than the Runner — the nearest `AttributesProvider`, or a
 * specific `MatrixNode` — see the sibling hooks `useAttrSelector`/`useMatrixSelector` instead.
 *
 * @example
 * const system = useRunnerSelector(({ attributes }) => attributes.forAttr(AttributeKey.system).value)
 * const physicalDamage = useRunnerSelector(({ damage }) => damage.forTrack(DamageTrackKey.physical))
 * const woundMod = useRunnerSelector(({ damage }) => damage.woundMod)
 * const effectiveArmor = useRunnerSelector(({ item }) => item.armor.effective)
 * const activeSkillCaps = useRunnerSelector(({ karmaCaps }) => karmaCaps.activeSkill.all) // Record<SkillKey, Facets>
 * const qualities = useRunnerSelector(({ qualities }) => qualities.all)
 * const specialization = useRunnerSelector(({ skills }) => skills.forSkill(SkillKey.pistols).specialization)
 */
export function useRunnerSelector<T>(
  picker: (catalog: RunnerSelectorCatalog) => Selector<RunnerData, T>,
  compare?: (prev: T, next: T) => boolean,
): T {
  return useRunnerStoreSelector((state) => picker(runnerSelectorCatalog)(state), compare)
}
