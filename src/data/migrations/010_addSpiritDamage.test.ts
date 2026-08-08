import { describe, expect, it } from "vitest"

import migration from "./010_addSpiritDamage.ts"

describe("010_addSpiritDamage", () => {
  it("does nothing when spirits array is absent", () => {
    const character = {}

    const result = migration.up(character)

    expect(result).not.toHaveProperty("spirits")
  })

  it("does nothing when spirits array is empty", () => {
    const character = { spirits: [] }

    const result = migration.up(character)

    expect(result.spirits).toEqual([])
  })

  it("adds damage { physical: 0, stun: 0 } to a spirit missing the field", () => {
    const character = { spirits: [{ id: "abc", spiritType: "wind", force: 4 }] }

    const result = migration.up(character)

    expect(result.spirits?.[0].damage).toEqual({ physical: 0, stun: 0 })
  })

  it("does not overwrite damage that already exists", () => {
    const character = {
      spirits: [{ id: "abc", spiritType: "fire", force: 6, damage: { physical: 3, stun: 1 } }],
    }

    const result = migration.up(character)

    expect(result.spirits?.[0].damage).toEqual({ physical: 3, stun: 1 })
  })

  it("handles a mixed array — backfills missing, preserves existing", () => {
    const character = {
      spirits: [
        { id: "a", spiritType: "earth", force: 5 },
        { id: "b", spiritType: "beast", force: 3, damage: { physical: 2, stun: 0 } },
        { id: "c", spiritType: "water", force: 7 },
      ],
    }

    const result = migration.up(character)

    expect(result.spirits?.[0].damage).toEqual({ physical: 0, stun: 0 })
    expect(result.spirits?.[1].damage).toEqual({ physical: 2, stun: 0 })
    expect(result.spirits?.[2].damage).toEqual({ physical: 0, stun: 0 })
  })

  it("does nothing when _meta_.version is already at or past this migration", () => {
    const character = {
      _meta_: { version: 10 },
      spirits: [{ id: "abc", spiritType: "wind", force: 4 }],
    }

    const result = migration.up(character)

    expect(result.spirits?.[0]).not.toHaveProperty("damage")
  })
})
