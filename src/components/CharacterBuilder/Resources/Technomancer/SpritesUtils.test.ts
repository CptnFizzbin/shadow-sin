import { describe, expect, it } from "vitest"

import type { SpriteFormState } from "#/components/CharacterBuilder/Resources/AwakenedFormState.ts"
import { getSpriteTasksBp } from "#/components/CharacterBuilder/Resources/Technomancer/SpritesUtils.ts"
import { SpriteBpPerTask } from "#/components/CharacterBuilder/Resources/Technomancer/TechnomancerUtils.ts"

function makeSprite(tasks: number): SpriteFormState {
  return { id: "test-sprite", name: "Test Sprite", tasks }
}

describe("getSpriteTasksBp", () => {
  it("returns 0 BP for a sprite with 0 tasks", () => {
    expect(getSpriteTasksBp(makeSprite(0))).toBe(0)
  })

  it("returns SpriteBpPerTask for a sprite with 1 task", () => {
    expect(getSpriteTasksBp(makeSprite(1))).toBe(SpriteBpPerTask)
  })

  it("returns tasks × SpriteBpPerTask for a sprite with 5 tasks", () => {
    expect(getSpriteTasksBp(makeSprite(5))).toBe(5 * SpriteBpPerTask)
  })

  it("returns tasks × SpriteBpPerTask for a higher task count", () => {
    expect(getSpriteTasksBp(makeSprite(10))).toBe(10 * SpriteBpPerTask)
  })
})
