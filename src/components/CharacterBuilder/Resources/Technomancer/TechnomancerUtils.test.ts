import { describe, expect, it } from "vitest"

import {
  ComplexFormBpPerRating,
  SpriteBpPerTask,
  isTechnomancer,
} from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerUtils.ts"
import { AwakeningType } from "#/lib/system/awakeningType.ts"

describe("TechnomancerUtils constants", () => {
  it("costs 1 BP per complex form rating", () => {
    expect(ComplexFormBpPerRating).toBe(1)
  })

  it("costs 1 BP per sprite task", () => {
    expect(SpriteBpPerTask).toBe(1)
  })
})

describe("isTechnomancer", () => {
  it("returns true for Technomancer awakening", () => {
    expect(isTechnomancer(AwakeningType.Technomancer)).toBe(true)
  })

  it("returns false for Magician awakening", () => {
    expect(isTechnomancer(AwakeningType.Magician)).toBe(false)
  })

  it("returns false for Adept awakening", () => {
    expect(isTechnomancer(AwakeningType.Adept)).toBe(false)
  })

  it("returns false for MysticAdept awakening", () => {
    expect(isTechnomancer(AwakeningType.MysticAdept)).toBe(false)
  })

  it("returns false for Mundane awakening", () => {
    expect(isTechnomancer(AwakeningType.Mundane)).toBe(false)
  })
})
