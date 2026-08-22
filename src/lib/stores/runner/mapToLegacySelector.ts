import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"

/**
 * Runs a standardized `{ runner, entity, items }` selector against a bare `RunnerData`, for a
 * `@deprecated` legacy export to delegate to its namespaced replacement without every caller of
 * that legacy export needing to change. See docs/adr/0014-selector-input-decomposition.md.
 */
export function mapToLegacySelector<TReturn>(
  runner: RunnerData,
  selector: Selector<{ runner: RunnerData, entity: RunnerData, items: ItemCatalog }, TReturn>,
): TReturn
export function mapToLegacySelector<TReturn, TOptions extends object | never = never>(
  runner: RunnerData,
  selector: Selector<{ runner: RunnerData, entity: RunnerData, items: ItemCatalog }, TReturn, TOptions>,
  options: TOptions,
): TReturn
export function mapToLegacySelector<TReturn, TOptions extends object | never = never>(
  runner: RunnerData,
  selector: Selector<{ runner: RunnerData, entity: RunnerData, items: ItemCatalog }, TReturn, TOptions>,
  options?: TOptions,
): TReturn {
  return selector(
    {
      runner,
      entity: runner,
      items: getItemCatalog(runner),
    },
    options as TOptions,
  )
}
