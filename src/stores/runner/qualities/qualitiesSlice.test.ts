import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import type { QualityData } from "#/system/qualityData.ts"

import { addQuality, qualitiesSlice, removeQuality, updateQuality } from "./qualitiesSlice.ts"

const makeQuality = (overrides: Partial<QualityData> = {}): QualityData => ({
  id: crypto.randomUUID() as UUID,
  name: "Pain Tolerance",
  type: "positive",
  ...overrides,
})

describe("qualitiesSlice", () => {
  it("add appends the given quality", () => {
    // Arrange
    const quality = makeQuality()

    // Act
    const next = qualitiesSlice.reducer([], addQuality(quality))

    // Assert
    expect(next).toEqual([quality])
  })

  it("update replaces the quality matching by name", () => {
    // Arrange
    const original = makeQuality({ name: "Restricted Item", bpValue: 10 })
    const updated = makeQuality({ name: "Restricted Item", bpValue: 15 })

    // Act
    const next = qualitiesSlice.reducer([original], updateQuality(updated))

    // Assert
    expect(next).toEqual([updated])
  })

  it("update is a no-op when no quality matches the name", () => {
    // Arrange
    const existing = makeQuality({ name: "Sensitive System" })
    const unrelated = makeQuality({ name: "Astral Chameleon" })

    // Act
    const next = qualitiesSlice.reducer([existing], updateQuality(unrelated))

    // Assert
    expect(next).toEqual([existing])
  })

  it("remove filters out the quality matching by name", () => {
    // Arrange
    const keep = makeQuality({ name: "Pain Tolerance" })
    const drop = makeQuality({ name: "Restricted Item" })

    // Act
    const next = qualitiesSlice.reducer([keep, drop], removeQuality(drop.name))

    // Assert
    expect(next).toEqual([keep])
  })
})
