import { describe, expect, it } from "vitest"

import { AwakeningType, awakenings } from "#/system/awakeningType.ts"
import { MetatypeType, metatypes } from "#/system/metatypeData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import {
  BiologySelectors,
  selectAwakening,
  selectAwakeningData,
  selectBiology,
  selectMetatype,
  selectMetatypeData,
} from "./biologySlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("selectBiology", () => {
  it("returns the runner's biology record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectBiology(runner)).toBe(runner.biology)
  })
})

describe("selectMetatype", () => {
  it("returns the runner's metatype", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.biology.metatype = MetatypeType.Troll
      return s
    } })

    // Act / Assert
    expect(selectMetatype(runner)).toBe(MetatypeType.Troll)
  })
})

describe("selectAwakening", () => {
  it("returns the runner's awakening type", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.biology.awakening = AwakeningType.Adept
      return s
    } })

    // Act / Assert
    expect(selectAwakening(runner)).toBe(AwakeningType.Adept)
  })
})

describe("selectMetatypeData", () => {
  it("returns the denormalized MetatypeData for the runner's metatype", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.biology.metatype = MetatypeType.Elf
      return s
    } })

    // Act / Assert
    expect(selectMetatypeData(runner)).toBe(metatypes[MetatypeType.Elf])
  })
})

describe("selectAwakeningData", () => {
  it("returns the denormalized AwakeningData for the runner's awakening", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.biology.awakening = AwakeningType.Magician
      return s
    } })

    // Act / Assert
    expect(selectAwakeningData(runner)).toBe(awakenings[AwakeningType.Magician])
  })
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
    const runner = runnerDataFactory({ override: (s) => {
      s.biology.metatype = MetatypeType.Dwarf
      return s
    } })

    // Act / Assert
    expect(BiologySelectors.selectMetatype(stateFor(runner))).toBe(MetatypeType.Dwarf)
  })
})

describe("BiologySelectors.selectAwakening", () => {
  it("returns the runner's awakening type", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.biology.awakening = AwakeningType.Technomancer
      return s
    } })

    // Act / Assert
    expect(BiologySelectors.selectAwakening(stateFor(runner))).toBe(AwakeningType.Technomancer)
  })
})

describe("BiologySelectors.selectMetatypeInfo", () => {
  it("returns the denormalized MetatypeData for the runner's metatype", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.biology.metatype = MetatypeType.Ork
      return s
    } })

    // Act / Assert
    expect(BiologySelectors.selectMetatypeInfo(stateFor(runner))).toBe(metatypes[MetatypeType.Ork])
  })
})

describe("BiologySelectors.selectAwakeningInfo", () => {
  it("returns the denormalized AwakeningData for the runner's awakening", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.biology.awakening = AwakeningType.MysticAdept
      return s
    } })

    // Act / Assert
    expect(BiologySelectors.selectAwakeningInfo(stateFor(runner))).toBe(awakenings[AwakeningType.MysticAdept])
  })
})
