import { combineReducers, createSlice } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
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

export const runnerRootReducer = combineReducers({
  id: idSlice.reducer,
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
