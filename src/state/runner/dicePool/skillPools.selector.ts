import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { injectOption } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { DicePoolModSelectors } from "#/state/runner/gameEffects/dicePoolMods.selector.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { DicePoolId } from "#/system/model/gameEffects/dicePoolId.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const NO_GROUPS: DiceGroup[] = []

/** Bonus dice (e.g. from a Power Focus) every test that rolls Magic gets, when `attr` is Magic. */
const selectMagicTestModGroups = (state: EntityScope, { attr }: { attr: AttributeKey }): DiceGroup[] =>
  attr === AttributeKey.magic
    ? DicePoolModSelectors.selectGroups(state, { poolId: DicePoolId.magicTests })
    : NO_GROUPS

/** Bonus dice for rolling the skill as the `modPoolId` test narrowed to `poolSubTarget`, if one is given. */
const selectSkillPoolModGroups = (
  state: EntityScope,
  { modPoolId, poolSubTarget }: { modPoolId?: DicePoolId, poolSubTarget?: string },
): DiceGroup[] =>
  modPoolId ? DicePoolModSelectors.selectGroups(state, { poolId: modPoolId, poolSubTarget }) : NO_GROUPS

/** Skill test pools. Their labels are generic; the component showing one names the skill. */
export namespace SkillPoolSelectors {
  /**
   * An Active Skill test: the skill, `attr`, the `specialization` bonus when one is given, bonuses
   * every Magic test gets when `attr` is Magic, and — when `modPoolId` is given — the bonuses for
   * rolling it as that test narrowed to `poolSubTarget` (e.g. Spellcasting for Combat spells).
   */
  export const selectActiveSkillTest = createDicePoolSelector({
    id: "skill.active",
    label: "Active Skill",
    groups: [
      SkillsSelectors.DiceGroups.selectSkill,
      AttrSelectors.DiceGroups.selectAttr,
      selectMagicTestModGroups,
      SkillsSelectors.DiceGroups.selectSpecialization,
      selectSkillPoolModGroups,
    ],
  })

  /** A Knowledge Skill test: the skill's `rating` and Specialization bonus, then Logic. */
  export const selectKnowledgeSkillTest = createDicePoolSelector({
    id: "skill.knowledge",
    label: "Knowledge Skill",
    groups: [
      SkillsSelectors.DiceGroups.selectKnowledgeSkill,
      injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.logic }),
    ],
  })

  /**
   * A Language Skill test: the skill's `rating` (none for a native language, which always succeeds
   * automatically) and lingo bonus, then Intuition.
   */
  export const selectLanguageSkillTest = createDicePoolSelector({
    id: "skill.language",
    label: "Language Skill",
    groups: [
      SkillsSelectors.DiceGroups.selectLanguageSkill,
      injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.intuition }),
    ],
  })

  /** The Availability Test for acquiring an item: Negotiation + Charisma. */
  export const selectAvailabilityTest = createDicePoolSelector({
    id: "availabilityTest",
    label: "Availability Test",
    groups: [
      injectOption(SkillsSelectors.DiceGroups.selectSkill, { skill: SkillKey.negotiation, excludeDefaulting: false }),
      injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.charisma }),
    ],
  })
}
