import { combineReducers } from "#/integrations/reduxToolkit/combineReducers.ts"

import { attributesSlice } from "./attributes/attributesSlice.ts"
import { biologySlice } from "./biology/biologySlice.ts"
import { complexFormsSlice } from "./complexForms/complexFormsSlice.ts"
import { contactsSlice } from "./contacts/contactsSlice.ts"
import { damageSlice } from "./damage/damageSlice.ts"
import { edgeSlice } from "./edge/edgeSlice.ts"
import { initiativeSlice } from "./initiative/initiativeSlice.ts"
import { karmaSlice } from "./karma/karmaSlice.ts"
import { nuyenSlice } from "./nuyen/nuyenSlice.ts"
import { powersSlice } from "./powers/powersSlice.ts"
import { profileSlice } from "./profile/profileSlice.ts"
import { qualitiesSlice } from "./qualities/qualitiesSlice.ts"
import { skillsSlice } from "./skills/skillsSlice.ts"
import { spellsSlice } from "./spells/spellsSlice.ts"
import { spiritsSlice } from "./spirits/spiritsSlice.ts"
import { spritesSlice } from "./sprites/spritesSlice.ts"
import { traditionSlice } from "./tradition/traditionSlice.ts"

export const runnerRootReducer = combineReducers({
  attributes: attributesSlice.reducer,
  qualities: qualitiesSlice.reducer,
  karma: karmaSlice.reducer,
  nuyen: nuyenSlice.reducer,
  profile: profileSlice.reducer,
  biology: biologySlice.reducer,
  contacts: contactsSlice.reducer,
  skills: skillsSlice.reducer,
  spells: spellsSlice.reducer,
  spirits: spiritsSlice.reducer,
  complexForms: complexFormsSlice.reducer,
  sprites: spritesSlice.reducer,
  powers: powersSlice.reducer,
  tradition: traditionSlice.reducer,
  edge: edgeSlice.reducer,
  damage: damageSlice.reducer,
  initiative: initiativeSlice.reducer,
})
