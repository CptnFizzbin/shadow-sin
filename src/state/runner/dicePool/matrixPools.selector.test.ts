import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import type { ItemData } from "#/data/items/itemData.ts"
import { createItem, createItemMap } from "#/data/items/itemData.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { ProgramData } from "#/data/items/programData.ts"
import { ProgramType } from "#/data/items/programData.ts"
import { runnerDataFactory } from "#/data/runner/runnerData.factory.ts"
import { getItemCatalog } from "#/data/runner/runnerTraits.ts"
import { SkillKey } from "#/data/skills/skillKey.ts"

import { MatrixPoolSelectors } from "./matrixPools.selector.ts"

const hackerState = ({ programRating, system }: { programRating: number, system?: number }) => {
  const [exploit] = createItem<ProgramData>({
    name: "Exploit",
    itemType: ItemType.program,
    rating: programRating,
    programType: ProgramType.exploit,
  }) as [ItemData]
  const runner = runnerDataFactory({
    items: createItemMap([exploit]),
    afterBuild: (s) => {
      s.skills.activeSkills = [{ name: SkillKey.hacking, rating: 4 }]
      if (system !== undefined) s.attributes[AttributeKey.system] = system
    },
  })
  return { state: { runner, entity: runner, items: getItemCatalog(runner) }, programId: exploit.id }
}

describe.concurrent("MatrixPoolSelectors.selectProgramTest", () => {
  it("rolls the skill plus the Program's rating", () => {
    // Arrange
    const { state, programId } = hackerState({ programRating: 3 })

    // Act
    const pool = MatrixPoolSelectors.selectProgramTest(state, { skill: SkillKey.hacking, itemId: programId })

    // Assert
    expect(pool.groups.map(({ name, size }) => [name, size])).toEqual([[SkillKey.hacking, 4], ["Exploit", 3]])
    expect(pool.size).toBe(7)
  })

  it("caps the Program's rating at the entity's System", () => {
    // Arrange
    const { state, programId } = hackerState({ programRating: 5, system: 3 })

    // Act
    const pool = MatrixPoolSelectors.selectProgramTest(state, { skill: SkillKey.hacking, itemId: programId })

    // Assert
    expect(pool.groups).toContainEqual({
      name: "Exploit",
      size: 3,
      type: "skill",
      breakdown: { rawValue: 5, modifiers: [{ name: "System limit", value: -2, isCap: true }], rating: 3 },
    })
  })

  it("adds Teamwork dice, limited by the leader's skill Rating", () => {
    // Arrange
    const { state, programId } = hackerState({ programRating: 3 })

    // Act
    const pool = MatrixPoolSelectors.selectProgramTest(state, {
      skill: SkillKey.hacking,
      itemId: programId,
      aid: [{ kind: "teamwork", name: "Slicer", hits: 6 }],
    })

    // Assert
    expect(pool.groups.slice(-2)).toEqual([
      { name: "Aid: Slicer", size: 6, type: "bonus" },
      { name: "Teamwork limit", size: -2, type: "penalty" },
    ])
  })
})
