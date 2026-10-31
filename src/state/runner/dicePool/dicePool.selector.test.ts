import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { DicePoolSelectors } from "./dicePool.selector.ts"

/** `DicePoolSelectors`' `TState` — `{ runner, entity, items }` — is exactly what
 *  `useRunnerSelector` assembles from a `RunnerData` alone; tests assemble it the same way. */
const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

describe("DicePoolSelectors.selectStandardTest", () => {
  it("assembles the Attribute, the skill, its Specialization, and the Wound Modifier in order", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.attributes[AttributeKey.agility] = 4
        s.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3, specialization: "Semi-Automatics" }]
        s.damage.physical = 3
      },
    })

    // Act
    const pool = DicePoolSelectors.selectStandardTest(
      stateFor(runner),
      { attr: AttributeKey.agility, skill: SkillKey.pistols, specialization: "Semi-Automatics" },
    )

    // Assert
    expect(pool.groups).toEqual([
      { name: "AGI", size: 4, type: "attribute" },
      { name: SkillKey.pistols, size: 3, type: "skill" },
      { name: "Specialization: Semi-Automatics", size: 2, type: "bonus" },
      { name: "Wound", size: -1, type: "penalty" },
    ])
    expect(pool.size).toBe(4 + 3 + 2 - 1)
  })
})
