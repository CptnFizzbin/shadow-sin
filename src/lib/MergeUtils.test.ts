import { describe, expect, it } from "vitest"

import { mergeArrays, mergeObjects } from "#/lib/MergeUtils.ts"

describe("mergeArrays", () => {
  it("deduplicates primitive values and preserves order", () => {
    // Arrange
    const a1 = [1, 2]
    const a2 = [2, 3]

    // Act
    const res = mergeArrays<number>(a1, a2)

    // Assert
    expect(res).toEqual([1, 2, 3])
  })

  it("merges objects with the same id (keeps a single merged item)", () => {
    // Arrange
    type ObjectWithId = { id: string, [key: string]: unknown }
    const o1: ObjectWithId = { id: "a", foo: 1 }
    const o2: ObjectWithId = { id: "a", bar: 2 }

    // Act
    const res = mergeArrays<ObjectWithId>([o1], [o2])

    // Assert
    expect(res).toHaveLength(1)
    expect(res[0]).toEqual({ id: "a", foo: 1, bar: 2 })
  })

  it("keeps distinct objects with different ids", () => {
    // Arrange
    type ObjectWithId = { id: string, [key: string]: unknown }
    const a: ObjectWithId = { id: "a", foo: 1 }
    const b: ObjectWithId = { id: "b", foo: 2 }

    // Act
    const res = mergeArrays<ObjectWithId>([a], [b])

    // Assert
    expect(res).toHaveLength(2)
    expect(res).toEqual([a, b])
  })
})

describe("mergeObjects", () => {
  it("merges nested objects recursively", () => {
    // Arrange
    type ObjectWithNested = { a: { x?: number, y?: number } }
    const o1: ObjectWithNested = { a: { x: 1 } }
    const o2: ObjectWithNested = { a: { y: 2 } }

    // Act
    const res = mergeObjects<ObjectWithNested>(o1, o2)

    // Assert
    expect(res.a).toEqual({ x: 1, y: 2 })
  })

  it("merges arrays inside objects using mergeArrays (by id)", () => {
    // Arrange
    type Weapon = { id: string, dmg?: number, ap?: number }
    type GearList = { weapons: Weapon[] }
    const obj1: GearList = {
      weapons: [{ id: "w1", dmg: 5 }],
    }
    const obj2: GearList = {
      weapons: [
        { id: "w1", ap: -1 },
        { id: "w2", dmg: 3 },
      ],
    }

    // Act
    const res = mergeObjects<GearList>(obj1, obj2)

    // Assert
    expect(res.weapons).toHaveLength(2)
    expect(res.weapons[0]).toEqual({ id: "w1", dmg: 5, ap: -1 })
    expect(res.weapons[1]).toEqual({ id: "w2", dmg: 3 })
  })

  it("overrides scalar values with later values", () => {
    // Arrange
    type SimpleObject = { a: number }
    const o1: SimpleObject = { a: 1 }
    const o2: SimpleObject = { a: 2 }

    // Act
    const res = mergeObjects<SimpleObject>(o1, o2)

    // Assert
    expect(res.a).toBe(2)
  })
})
