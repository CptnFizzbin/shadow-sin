import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { useRunnerStoreContext } from "#/lib/contexts/runner/runnerStore.context.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import * as attributesSelectors from "./attributes/attributesSlice.selectors.ts"
import * as biologySelectors from "./biology/biologySlice.selectors.ts"
import * as complexFormsSelectors from "./complexForms/complexFormsSlice.selectors.ts"
import * as contactsSelectors from "./contacts/contactsSlice.selectors.ts"
import * as damageSelectors from "./damage/damageSlice.selectors.ts"
import * as edgeSelectors from "./edge/edgeSlice.selectors.ts"
import * as matrixSelectors from "./gameState/matrix/matrixSlice.selectors.ts"
import * as gearSelectors from "./gear/gearSlice.selectors.ts"
import * as houseRulesSelectors from "./houseRules/houseRulesSlice.selectors.ts"
import * as initiativeSelectors from "./initiative/initiativeSlice.selectors.ts"
import * as karmaSelectors from "./karma/karmaSlice.selectors.ts"
import * as metaSelectors from "./meta/metaSlice.selectors.ts"
import * as nuyenSelectors from "./nuyen/nuyenSlice.selectors.ts"
import * as powersSelectors from "./powers/powersSlice.selectors.ts"
import * as profileSelectors from "./profile/profileSlice.selectors.ts"
import * as qualitiesSelectors from "./qualities/qualitiesSlice.selectors.ts"
import * as skillsSelectors from "./skills/skillsSlice.selectors.ts"
import * as spellsSelectors from "./spells/spellsSlice.selectors.ts"
import * as spiritsSelectors from "./spirits/spiritsSlice.selectors.ts"
import * as spritesSelectors from "./sprites/spritesSlice.selectors.ts"
import * as traditionSelectors from "./tradition/traditionSlice.selectors.ts"

export type RunnerDataSelector<TData> = (state: RunnerData) => TData

/**
 * @deprecated Use {@link useRunnerSelector} instead — it takes a standardized
 * `Selector<{ runner: RunnerData }, TReturn, TOptions>` (see
 * docs/adr/0014-selector-input-decomposition.md) and assembles the `{ runner: ... }` state itself,
 * instead of requiring every call site to pass a bare `(state: RunnerData) => T` closure.
 */
export function useRunnerStoreSelector<T>(
  selector: RunnerDataSelector<T>,
  compare?: (prev: T, next: T) => boolean,
) {
  const store = useRunnerStoreContext()
  return useSelector(store, selector, { compare })
}

/**
 * The standardized way to read `RunnerData` in a component — assembles the `{ runner: RunnerData }`
 * state a namespaced selector (`ProfileSelectors.selectName`, `KarmaSelectors.selectCurrent`, ...)
 * expects, so call sites just pass the selector (and its options, if it takes any):
 *
 * @example
 * const name = useRunnerSelector(ProfileSelectors.selectName)
 * const base = useRunnerSelector(SkillsSelectors.selectValue, { skillName: SkillKey.pistols })
 *
 * Only fits selectors whose `TState` is exactly `{ runner: RunnerData }` — the shape every
 * Runner-domain namespace in `src/lib/stores/runner/**` uses except `AttrSelectors` (`{ entity: ... }`,
 * a future `useEntitySelector`'s job) and `ItemSelectors` (`{ items: ... }`, not yet served by a
 * hook). See docs/adr/0014-selector-input-decomposition.md.
 */
export function useRunnerSelector<TReturn>(
  selector: Selector<{ runner: RunnerData }, TReturn>,
  compare?: (prev: TReturn, next: TReturn) => boolean,
): TReturn
export function useRunnerSelector<TReturn, TOptions extends object>(
  selector: Selector<{ runner: RunnerData }, TReturn, TOptions>,
  options: TOptions,
  compare?: (prev: TReturn, next: TReturn) => boolean,
): TReturn
export function useRunnerSelector<TReturn, TOptions extends object>(
  selector: (state: { runner: RunnerData }, options?: TOptions) => TReturn,
  optionsOrCompare?: TOptions | ((prev: TReturn, next: TReturn) => boolean),
  compare?: (prev: TReturn, next: TReturn) => boolean,
): TReturn {
  const isCompareArg = typeof optionsOrCompare === "function"
  const options = isCompareArg ? undefined : optionsOrCompare
  const resolvedCompare = isCompareArg ? optionsOrCompare : compare

  return useRunnerStoreSelector((runner) => selector({ runner }, options), resolvedCompare)
}

/**
 * Namespaced access to every `RunnerData` domain's selectors, all defined in each domain's
 * `*Slice.selectors.ts` (e.g. `Selectors.biology.selectMetatype`, `Selectors.skills.selectActiveSkills`).
 *
 * @deprecated Every selector reachable from here has a standardized replacement on that same
 * domain file's `PascalCase` namespace (`AttrSelectors`, `ProfileSelectors`, `ItemSelectors`, ...)
 * — see docs/adr/0014-selector-input-decomposition.md. Read it via {@link useRunnerSelector}
 * (or the future `useEntitySelector` for `AttrSelectors`) instead of this aggregator.
 */
export const Selectors = {
  attributes: attributesSelectors,
  biology: biologySelectors,
  complexForms: complexFormsSelectors,
  contacts: contactsSelectors,
  damage: damageSelectors,
  edge: edgeSelectors,
  gameState: { matrix: matrixSelectors },
  gear: gearSelectors,
  houseRules: houseRulesSelectors,
  initiative: initiativeSelectors,
  karma: karmaSelectors,
  meta: metaSelectors,
  nuyen: nuyenSelectors,
  powers: powersSelectors,
  profile: profileSelectors,
  qualities: qualitiesSelectors,
  skills: skillsSelectors,
  spells: spellsSelectors,
  spirits: spiritsSelectors,
  sprites: spritesSelectors,
  tradition: traditionSelectors,
}
