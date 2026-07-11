import { attributesSlice } from "./attributes/attributesSlice.ts"
import { biologySlice } from "./biology/biologySlice.ts"
import { complexFormsSlice } from "./complexForms/complexFormsSlice.ts"
import { contactsSlice } from "./contacts/contactsSlice.ts"
import { damageSlice } from "./damage/damageSlice.ts"
import { burnEdge } from "./edge/edgeSlice.actions.ts"
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

/**
 * Namespaced access to every migrated domain's action creators, plus cross-domain compound
 * actions (e.g. `Actions.edge.burnEdge()`) alongside the single-slice ones they combine
 * (`Actions.edge.burnCurrent`, `Actions.attributes.adjust`). Prefer importing a specific action
 * creator directly (`import { addQuality } from ".../qualitiesSlice.ts"`) at real call sites —
 * this namespace is mainly useful for discoverability and for compound actions, which don't
 * belong to any one slice's own `.actions`.
 */
export const Actions = {
  attributes: attributesSlice.actions,
  biology: biologySlice.actions,
  complexForms: complexFormsSlice.actions,
  contacts: contactsSlice.actions,
  damage: damageSlice.actions,
  edge: { ...edgeSlice.actions, burnEdge },
  initiative: initiativeSlice.actions,
  karma: karmaSlice.actions,
  nuyen: nuyenSlice.actions,
  powers: powersSlice.actions,
  profile: profileSlice.actions,
  qualities: qualitiesSlice.actions,
  skills: skillsSlice.actions,
  spells: spellsSlice.actions,
  spirits: spiritsSlice.actions,
  sprites: spritesSlice.actions,
  tradition: traditionSlice.actions,
}
