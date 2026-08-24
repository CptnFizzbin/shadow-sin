import * as attributesActions from "./attributes/attributesSlice.actions.ts"
import * as biologyActions from "./biology/biologySlice.actions.ts"
import * as complexFormsActions from "./complexForms/complexFormsSlice.actions.ts"
import * as contactsActions from "./contacts/contactsSlice.actions.ts"
import * as damageActions from "./damage/damageSlice.actions.ts"
import * as edgeActions from "./edge/edgeSlice.actions.ts"
import * as matrixActions from "./gameState/matrix/matrixSlice.actions.ts"
import * as gearActions from "./gear/gearSlice.actions.ts"
import * as initiativeActions from "./initiative/initiativeSlice.actions.ts"
import * as karmaActions from "./karma/karmaSlice.actions.ts"
import * as nuyenActions from "./nuyen/nuyenSlice.actions.ts"
import * as powersActions from "./powers/powersSlice.actions.ts"
import * as profileActions from "./profile/profileSlice.actions.ts"
import * as qualitiesActions from "./qualities/qualitiesSlice.actions.ts"
import * as skillsActions from "./skills/skillsSlice.actions.ts"
import * as spellsActions from "./spells/spellsSlice.actions.ts"
import * as spiritsActions from "./spirits/spiritsSlice.actions.ts"
import * as spritesActions from "./sprites/spritesSlice.actions.ts"
import * as traditionActions from "./tradition/traditionSlice.actions.ts"

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
  gameState: { matrix: matrixActions },
  item: gearActions,
  initiative: initiativeActions,
  karma: karmaActions,
  nuyen: nuyenActions,
  powers: powersActions,
  profile: profileActions,
  qualities: qualitiesActions,
  skills: skillsActions,
  spells: spellsActions,
  spirits: spiritsActions,
  sprites: spritesActions,
  tradition: traditionActions,
}
