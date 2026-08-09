import { useRootStoreSelector } from "#/lib/stores/root/rootStore.selectors.ts"
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
 * Reactive read of the `RunnerData` slice of the merged root store. A thin wrapper around
 * `useRootStoreSelector` — it curries the given `RunnerData`-scoped selector into a root-state
 * selector (`(state) => selector(state.runnerData)`), so domain selectors keep operating on
 * `RunnerData` even though the store's actual root state is wider.
 */
export function useRunnerStoreSelector<T>(
  selector: RunnerDataSelector<T>,
  compare?: (prev: T, next: T) => boolean,
) {
  return useRootStoreSelector((state) => selector(state.runnerData), compare)
}

/**
 * Namespaced access to every `RunnerData` domain's selectors, all defined in each domain's
 * `*Slice.selectors.ts` (e.g. `Selectors.biology.selectMetatype`, `Selectors.skills.selectActiveSkills`).
 * Prefer importing a specific selector directly
 * (`import { selectQualities } from ".../qualitiesSlice.selectors.ts"`) at real call sites — this
 * namespace is mainly useful for discoverability.
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
