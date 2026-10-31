import type { DicePoolConfig } from "#/components/system/dicePool/dicePoolData.tsx"
import { injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { DiceGroupSelectors } from "#/state/runner/diceGroup/diceGroup.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

export namespace ContactPoolSelectors {
  /** The GM's Contact Knowledge Test for legwork: the contact's `connection`, rolled twice. */
  export const selectLegworkGmTest = createDicePoolSelector(
    SelectorOptions.connection,
    (connection): DicePoolConfig => ({
      id: "legwork.gm",
      label: "Contact Knowledge Test",
      // The Contact rolls this, so the Runner's Wound Modifier doesn't apply.
      excludeWoundMod: true,
      groups: [
        { name: "Connection", size: connection },
        { name: "Connection", size: connection },
      ],
    }),
  )

  /** The player's Legwork Test: Charisma + Etiquette + the contact's `loyalty`. */
  export const selectLegworkPlayerTest = createDicePoolSelector(
    injectOption(DiceGroupSelectors.selectAttr, { attr: AttributeKey.charisma }),
    injectOption(DiceGroupSelectors.selectSkill, { skill: SkillKey.etiquette, excludeDefaulting: false }),
    SelectorOptions.loyalty,
    (charismaGroups, etiquetteGroups, loyalty): DicePoolConfig => ({
      id: "legwork.player",
      label: "Legwork Test",
      groups: [...charismaGroups, ...etiquetteGroups, { name: "Loyalty", size: loyalty }],
    }),
  )
}
