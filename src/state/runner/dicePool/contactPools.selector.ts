import type { DicePoolConfig } from "#/components/system/dicePool/dicePoolData.tsx"
import { injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"
import { DicePoolSelectors } from "./dicePool.selector.ts"

export namespace ContactPoolSelectors {
  /** The GM's Contact Knowledge Test for legwork: the contact's `connection`, rolled twice. */
  export const selectLegworkGmTest = createDicePoolSelector(
    SelectorOptions.connection,
    (connection): DicePoolConfig => ({
      id: "legwork.gm",
      label: "Contact Knowledge Test",
      groups: [
        { name: "Connection", size: connection },
        { name: "Connection", size: connection },
      ],
    }),
  )

  /** The player's Legwork Test: Charisma + Etiquette + the contact's `loyalty`. */
  export const selectLegworkPlayerTest = createDicePoolSelector(
    injectOption(DicePoolSelectors.selectAttrTest, { attr: AttributeKey.charisma }),
    injectOption(DicePoolSelectors.selectSkillTest, { skill: SkillKey.etiquette, isSpecialized: false, excludeDefaulting: false }),
    SelectorOptions.loyalty,
    (charismaGroups, etiquetteGroups, loyalty): DicePoolConfig => ({
      id: "legwork.player",
      label: "Legwork Test",
      groups: [...charismaGroups, ...etiquetteGroups, { name: "Loyalty", size: loyalty }],
    }),
  )
}
