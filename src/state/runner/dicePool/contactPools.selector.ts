import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { SkillKey } from "#/data/skills/skillKey.ts"
import type { DiceGroup } from "#/rules/dicePool/diceGroup.tsx"
import { createMemoizedSelector, injectOption } from "#/state/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const selectConnectionGroups = createMemoizedSelector(
  SelectorOptions.connection,
  (connection): DiceGroup[] => [{ name: "Connection", size: connection }],
)

const selectLoyaltyGroups = createMemoizedSelector(
  SelectorOptions.loyalty,
  (loyalty): DiceGroup[] => [{ name: "Loyalty", size: loyalty }],
)

export namespace ContactPoolSelectors {
  /** The GM's Contact Knowledge Test for legwork: the contact's `connection`, rolled twice. */
  export const selectLegworkGmTest = createDicePoolSelector({
    id: "legwork.gm",
    label: "Contact Knowledge Test",
    groups: [selectConnectionGroups, selectConnectionGroups],
    // The Contact rolls this, so the Runner's Wound Modifier and Sustaining penalty don't apply.
    excludeWoundMod: true,
    excludeSustainingPenalty: true,
  })

  /** The player's Legwork Test: Charisma + Etiquette + the contact's `loyalty`. */
  export const selectLegworkPlayerTest = createDicePoolSelector({
    id: "legwork.player",
    label: "Legwork Test",
    groups: [
      injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.charisma }),
      injectOption(SkillsSelectors.DiceGroups.selectSkill, { skill: SkillKey.etiquette, excludeDefaulting: false }),
      selectLoyaltyGroups,
    ],
  })
}
