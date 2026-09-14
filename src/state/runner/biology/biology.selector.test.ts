import { describe, expect, it } from "vitest"

import { metatypes, MetatypeType } from "#/system/model/biology/metatypeData.ts"
import { awakenings, AwakeningType } from "#/system/model/magic/awakeningType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { BiologySelectors } from "./biology.selector.ts"

const stateFor = (runner: RunnerData) => ({
  runner: runner,
  entity: runner,
})

describe("BiologySelectors.select", () => {
  it("returns the runner's biology record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(BiologySelectors.select(stateFor(runner))).toBe(runner.biology)
  })
})

describe("BiologySelectors.selectMetatype", () => {
  it("returns the runner's metatype", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.biology.metatype = MetatypeType.Dwarf
      },
    })

    // Act / Assert
    expect(BiologySelectors.selectMetatype(stateFor(runner))).toBe(MetatypeType.Dwarf)
  })
})

describe("BiologySelectors.selectAwakening", () => {
  it("returns the runner's awakening type", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.biology.awakening = AwakeningType.Technomancer
      },
    })

    // Act / Assert
    expect(BiologySelectors.selectAwakening(stateFor(runner))).toBe(AwakeningType.Technomancer)
  })
})

describe("BiologySelectors.selectMetatypeInfo", () => {
  it("returns the denormalized MetatypeData for the runner's metatype", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.biology.metatype = MetatypeType.Ork
      },
    })

    // Act / Assert
    expect(BiologySelectors.selectMetatypeInfo(stateFor(runner))).toBe(metatypes[MetatypeType.Ork])
  })
})

describe("BiologySelectors.selectAwakeningInfo", () => {
  it("returns the denormalized AwakeningData for the runner's awakening", () => {
    // Arrange
    const runner = runnerDataFactory({
      afterBuild: (s) => {
        s.biology.awakening = AwakeningType.MysticAdept
      },
    })

    // Act / Assert
    expect(BiologySelectors.selectAwakeningInfo(stateFor(runner))).toBe(awakenings[AwakeningType.MysticAdept])
  })
})
