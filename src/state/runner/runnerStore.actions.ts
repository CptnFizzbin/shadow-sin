import { createAction } from "@reduxjs/toolkit"
import { produce } from "immer"

import type { RunnerStateDispatch, RunnerState } from "#/state/runnerState.ts"
import { toRunnerData } from "#/state/toRunnerData.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import * as attributesActions from "./attributes/attributes.actions.ts"
import * as biologyActions from "./biology/biology.actions.ts"
import * as complexFormsActions from "./complexForms/complexForms.actions.ts"
import * as contactsActions from "./contacts/contacts.actions.ts"
import * as damageActions from "./damage/damage.actions.ts"
import * as edgeActions from "./edge/edge.actions.ts"
import * as extendedTestsActions from "./extendedTests/extendedTests.actions.ts"
import * as matrixActions from "./gameState/matrix/matrix.actions.ts"
import * as initiativeActions from "./initiative/initiative.actions.ts"
import * as gearActions from "./items/items.actions.ts"
import * as karmaActions from "./karma/karma.actions.ts"
import * as nuyenActions from "./nuyen/nuyen.actions.ts"
import * as powersActions from "./powers/powers.actions.ts"
import * as profileActions from "./profile/profile.actions.ts"
import * as qualitiesActions from "./qualities/qualities.actions.ts"
import * as reputationActions from "./reputation/reputation.actions.ts"
import * as skillsActions from "./skills/skills.actions.ts"
import * as spellsActions from "./spells/spells.actions.ts"
import * as spiritsActions from "./spirits/spirits.actions.ts"
import * as spritesActions from "./sprites/sprites.actions.ts"
import * as traditionActions from "./tradition/tradition.actions.ts"

const load = createAction<RunnerData>("runner/load")

export const RunnerActions = {
  load,

  /**
   * Applies `updater` to a snapshot of the current `RunnerData` — merged via `toRunnerData` so
   * `_data_.items` reflects the canonical normalized `items` catalog rather than this slice's own
   * possibly-stale mirror — then loads the result back in via {@link load}. A plain, synchronous
   * thunk rather than `createAsyncThunk`: `getState`/`dispatch` both run synchronously here, so
   * callers that read the store again immediately after dispatching (no `await`) see the result.
   */
  update: (updater: (runner: RunnerData) => void | RunnerData) => {
    return (dispatch: RunnerStateDispatch, getState: () => RunnerState): RunnerData => {
      const next = produce(toRunnerData(getState()), updater)
      dispatch(load(next))
      return next
    }
  },
}

/**
 * Namespaced access to every `RunnerData` domain's action creators — native and compound alike, all
 * defined in each domain's `*Slice.actions.ts` (e.g. `Actions.edge.burnEdge()`,
 * `Actions.edge.spendEdge(...)`). Prefer importing a specific action creator directly
 * (`import { addQuality } from ".../qualitiesSlice.actions.ts"`) at real call sites — this
 * namespace is mainly useful for discoverability.
 */
export const Actions = {
  attributes: attributesActions,
  biology: biologyActions,
  complexForms: complexFormsActions,
  contacts: contactsActions,
  damage: damageActions,
  edge: edgeActions,
  extendedTests: extendedTestsActions,
  gameState: { matrix: matrixActions },
  item: gearActions,
  initiative: initiativeActions,
  karma: karmaActions,
  nuyen: nuyenActions,
  powers: powersActions,
  profile: profileActions,
  qualities: qualitiesActions,
  reputation: reputationActions,
  skills: skillsActions,
  spells: spellsActions,
  spirits: spiritsActions,
  sprites: spritesActions,
  tradition: traditionActions,
}
