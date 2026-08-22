import type { Reducer, UnknownAction } from "@reduxjs/toolkit"
import { combineReducers, createSlice } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { attributesReducer } from "./attributes/attributesSlice.ts"
import { biologyReducer } from "./biology/biologySlice.ts"
import { complexFormsReducer } from "./complexForms/complexFormsSlice.ts"
import { contactsReducer } from "./contacts/contactsSlice.ts"
import { damageReducer } from "./damage/damageSlice.ts"
import { edgeReducer } from "./edge/edgeSlice.ts"
import { featureFlagsReducer } from "./featureFlags/featureFlagsSlice.ts"
import { matrixReducer } from "./gameState/matrix/matrixSlice.ts"
import { gearReducer } from "./gear/gearSlice.ts"
import { initiativeReducer } from "./initiative/initiativeSlice.ts"
import { karmaReducer } from "./karma/karmaSlice.ts"
import { metaReducer } from "./meta/metaSlice.ts"
import { nuyenReducer } from "./nuyen/nuyenSlice.ts"
import { powersReducer } from "./powers/powersSlice.ts"
import { profileReducer } from "./profile/profileSlice.ts"
import { qualitiesReducer } from "./qualities/qualitiesSlice.ts"
import { skillsReducer } from "./skills/skillsSlice.ts"
import { spellsReducer } from "./spells/spellsSlice.ts"
import { spiritsReducer } from "./spirits/spiritsSlice.ts"
import { spritesReducer } from "./sprites/spritesSlice.ts"
import { traditionReducer } from "./tradition/traditionSlice.ts"

const idSlice = createSlice({
  name: "id",
  initialState: NullUuid as RunnerData["id"],
  reducers: {},
})

// `kind` is a fixed constant for every RunnerData — never dispatched, mirrors idSlice above.
const kindSlice = createSlice({
  name: "kind",
  initialState: EntityKind.runner as RunnerData["kind"],
  reducers: {},
})

// Magic-advancement grades are only ever written by the karma-improvement
// apply flow (a direct `setState(produce(...))`, like spells/qualities), so
// no dispatched actions are needed — mirrors idSlice above.
const initiateGradeSlice = createSlice({
  name: "initiateGrade",
  initialState: 0 as RunnerData["initiateGrade"],
  reducers: {},
})

const submersionGradeSlice = createSlice({
  name: "submersionGrade",
  initialState: 0 as RunnerData["submersionGrade"],
  reducers: {},
})

const domainReducer = combineReducers({
  id: idSlice.reducer,
  kind: kindSlice.reducer,
  _meta_: metaReducer,
  attributes: attributesReducer,
  qualities: qualitiesReducer,
  karma: karmaReducer,
  nuyen: nuyenReducer,
  profile: profileReducer,
  biology: biologyReducer,
  contacts: contactsReducer,
  skills: skillsReducer,
  spells: spellsReducer,
  spirits: spiritsReducer,
  complexForms: complexFormsReducer,
  sprites: spritesReducer,
  powers: powersReducer,
  tradition: traditionReducer,
  edge: edgeReducer,
  damage: damageReducer,
  gameState: combineReducers({ matrix: matrixReducer }),
  initiative: initiativeReducer,
  gear: gearReducer,
  featureFlags: featureFlagsReducer,
  initiateGrade: initiateGradeSlice.reducer,
  submersionGrade: submersionGradeSlice.reducer,
})

/**
 * Mirrors `RunnerData.name` (the `EntityBase.name` field) from `profile.alias || profile.name`.
 * Unlike every reducer `domainReducer` composes above, this can't be a `combineReducers` leaf: a
 * leaf only ever sees its own previous slice value, but the mirror needs whichever of
 * `profile.alias`/`profile.name` *didn't* just change too — so `runnerRootReducer` calls it
 * directly against `domainReducer`'s already-updated output instead of registering it under a
 * `name` key.
 */
const nameReducer = (profile: RunnerData["profile"]): RunnerData["name"] => profile.alias || profile.name

export const runnerRootReducer: Reducer<RunnerData> = (state, action: UnknownAction) => {
  const next = domainReducer(state, action)
  return { ...next, name: nameReducer(next.profile) }
}
