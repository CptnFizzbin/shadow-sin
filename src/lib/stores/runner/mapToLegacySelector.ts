import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

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
      items: runner.gear as ItemCatalog,
    },
    options as TOptions,
  )
}
