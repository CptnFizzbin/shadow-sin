import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { SpriteSelectors } from "./spritesSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

/** `selectMaxRegistered`/`selectMaxTasks` compose `AttrSelectors`/`SkillsSelectors`/
 *  `GameEffectSelectors`, which together need the full `useRunnerSelector`-assembled state. */
const fullStateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

describe("SpritesSelectors.selectAll", () => {
  it("returns the runner's sprites", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(SpriteSelectors.selectAll(stateFor(runner))).toBe(runner.sprites)
  })
})

describe("SpriteSelectors.selectMaxRegistered", () => {
  it("returns the runner's Charisma", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.charisma] = 5
    } })

    // Act / Assert
    expect(SpriteSelectors.selectMaxRegistered(fullStateFor(runner))).toBe(5)
  })
})

describe("SpriteSelectors.selectMaxTasks", () => {
  it("sums the Compiling rating and Resonance", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.biology.awakening = AwakeningType.Technomancer
      s.attributes[AttributeKey.resonance] = 4
      s.skills.activeSkills = [{ name: SkillKey.compiling, rating: 3 }]
    } })

    // Act / Assert
    expect(SpriteSelectors.selectMaxTasks(fullStateFor(runner))).toBe(7)
  })
})
