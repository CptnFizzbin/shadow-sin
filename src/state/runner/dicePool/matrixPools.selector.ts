import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { aidDiceGroups } from "#/rules/dicePool/aidDiceGroups.ts"
import type { DiceGroup } from "#/rules/dicePool/diceGroup.tsx"
import { ratingDiceGroup } from "#/rules/dicePool/diceGroup.tsx"
import type { RatingBreakdown } from "#/rules/ratings/ratingFormulas.ts"
import { RatingFormulas } from "#/rules/ratings/ratingFormulas.ts"
import { createMemoizedSelector, injectOption } from "#/state/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const NO_GROUPS: DiceGroup[] = []

/**
 * The Program `itemId`'s rating, capped at the System rating of the entity in scope when it has
 * one. `undefined` when `itemId` isn't a Program.
 */
const selectProgramRatingBreakdown = createMemoizedSelector(
  ItemSelectors.Programs.selectById,
  injectOption(AttrSelectors.selectRating, { attr: AttributeKey.system }),
  (program, system): RatingBreakdown | undefined => program
    // An entity without a System (e.g. a Runner using a commlink they don't run as a Matrix
    // entity) has a System rating of 0, which would wrongly zero every Program.
    ? RatingFormulas.getProgramRating({ rawValue: program.rating, systemLimit: system > 0 ? system : undefined })
    : undefined,
)

/** The Program `itemId`'s rating as a Dice Group, named after the Program, or none when it isn't one. */
const selectProgramGroups = createMemoizedSelector(
  ItemSelectors.Programs.selectById,
  selectProgramRatingBreakdown,
  (program, breakdown): DiceGroup[] =>
    program && breakdown ? [ratingDiceGroup({ name: program.name, type: "skill" }, breakdown)] : NO_GROUPS,
)

/** Dice from `aid`, with Teamwork limited by the leader's `skill` Rating. */
const selectMatrixAidGroups = createMemoizedSelector(
  SelectorOptions.aid,
  SkillsSelectors.selectRating,
  aidDiceGroups,
)

/** Matrix test pools. */
export namespace MatrixPoolSelectors {
  /** A Matrix test: `skill` + the Program `itemId`, and any `aid` from assistants. */
  export const selectProgramTest = createDicePoolSelector({
    id: "matrix.program",
    label: "Matrix Test",
    groups: [SkillsSelectors.DiceGroups.selectSkill, selectProgramGroups, selectMatrixAidGroups],
  })
}
