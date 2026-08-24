import { describe, expect, it } from "vitest"

import migration from "./20260806_00_addSpriteDamage.ts"

describe.concurrent("020_addSpriteDamage", () => {
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

  it("adds damage { matrix: 0 } to a sprite missing the field", () => {
    const character = { sprites: [{ id: "abc", name: "Courier", force: 3 }] }

    const result = migration.up(character)

    expect(result.sprites?.[0].damage).toEqual({ matrix: 0 })
  })

  it("does not overwrite damage that already exists", () => {
    const character = {
      sprites: [{ id: "abc", name: "Fault", force: 5, damage: { matrix: 2 } }],
    }

    const result = migration.up(character)

    expect(result.sprites?.[0].damage).toEqual({ matrix: 2 })
  })

  it("handles a mixed array — backfills missing, preserves existing", () => {
    const character = {
      sprites: [
        { id: "a", name: "Courier", force: 3 },
        { id: "b", name: "Fault", force: 4, damage: { matrix: 1 } },
        { id: "c", name: "Crash", force: 6 },
      ],
    }

    const result = migration.up(character)

    expect(result.sprites?.[0].damage).toEqual({ matrix: 0 })
    expect(result.sprites?.[1].damage).toEqual({ matrix: 1 })
    expect(result.sprites?.[2].damage).toEqual({ matrix: 0 })
  })
})
