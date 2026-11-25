import { describe, expect, it } from "vitest"

import { AttributeKey } from "#data/attributes/attributeKey.ts"
import { AwakeningType } from "#data/magic/awakeningType.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import type { RunnerData } from "#data/runner/runnerData.ts"
import { getItemCatalog } from "#data/runner/runnerTraits.ts"
import { SkillKey } from "#data/skills/skillKey.ts"

import { SpriteSelectors } from "./sprites.selector.ts"

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
