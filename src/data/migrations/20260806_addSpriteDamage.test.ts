import { describe, expect, it } from "vitest"

import migration from "./20260806_addSpriteDamage.ts"

describe("20260806_addSpriteDamage", () => {
  it("does nothing when sprites array is absent", () => {
    const character = {}

    const result = migration.up(character)

    expect(result).not.toHaveProperty("sprites")
  })

  it("does nothing when sprites array is empty", () => {
    const character = { sprites: [] }

    const result = migration.up(character)

    expect(result.sprites).toEqual([])
  })

  it("adds damage { physical: 0, stun: 0 } to a sprite missing the field", () => {
    const character = { sprites: [{ id: "abc", name: "Courier", force: 3 }] }

    const result = migration.up(character)

    expect(result.sprites?.[0].damage).toEqual({ physical: 0, stun: 0 })
  })

  it("does not overwrite damage that already exists", () => {
    const character = {
      sprites: [{ id: "abc", name: "Fault", force: 5, damage: { physical: 2, stun: 1 } }],
    }

    const result = migration.up(character)

    expect(result.sprites?.[0].damage).toEqual({ physical: 2, stun: 1 })
  })

  it("handles a mixed array — backfills missing, preserves existing", () => {
    const character = {
      sprites: [
        { id: "a", name: "Courier", force: 3 },
        { id: "b", name: "Fault", force: 4, damage: { physical: 1, stun: 0 } },
        { id: "c", name: "Crash", force: 6 },
      ],
    }

    const result = migration.up(character)

    expect(result.sprites?.[0].damage).toEqual({ physical: 0, stun: 0 })
    expect(result.sprites?.[1].damage).toEqual({ physical: 1, stun: 0 })
    expect(result.sprites?.[2].damage).toEqual({ physical: 0, stun: 0 })
  })
})
