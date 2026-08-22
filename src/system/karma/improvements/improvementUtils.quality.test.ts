import type { UUID } from "node:crypto"

import { produce } from "immer"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import type { LearnQualityEntry, QualityBuyOffEntry } from "./improvementEntry.ts"
import { ImprovementType } from "./improvementType.ts"
import { applyImprovement } from "./improvementUtils.ts"

const FAKE_ID = "00000000-0000-0000-0000-000000000000" as UUID

describe.concurrent("applyImprovement — learnQuality", () => {
  it("adds the new quality to the sheet and deducts karma", () => {
    // Arrange — bpValue 15 × 2 = 30 karma
    const entry: LearnQualityEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnQuality,
      quality: { kind: EntityKind.quality, id: "q1" as UUID, name: "Toughness", type: "positive", bpValue: 15 },
    }
    const sheet = runnerDataFactory((draft) => {
      draft.karma.current = 30
      return draft
    })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(next.qualities).toContainEqual(entry.quality)
    expect(next.karma.current).toBe(0)
  })
})

describe.concurrent("applyImprovement — qualityBuyOff", () => {
  it("removes the matching negative quality and deducts karma", () => {
    // Arrange — bpValue 20 × 2 = 40 karma
    const entry: QualityBuyOffEntry = {
      id: FAKE_ID,
      type: ImprovementType.qualityBuyOff,
      qualityId: "q1" as UUID,
      qualityName: "Uneducated",
      bpValue: 20,
    }
    const sheet = runnerDataFactory((draft) => {
      draft.qualities = [{ kind: EntityKind.quality, id: "q1" as UUID, name: "Uneducated", type: "negative", bpValue: 20 }]
      draft.karma.current = 40
      return draft
    })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(next.qualities.find((quality) => quality.id === entry.qualityId)).toBeUndefined()
    expect(next.karma.current).toBe(0)
  })

  it("throws when the targeted quality is missing", () => {
    // Arrange
    const entry: QualityBuyOffEntry = {
      id: FAKE_ID,
      type: ImprovementType.qualityBuyOff,
      qualityId: "missing-quality" as UUID,
      qualityName: "Uneducated",
      bpValue: 20,
    }
    const sheet = runnerDataFactory()

    // Act + Assert
    expect(() => produce(sheet, (draft) => applyImprovement(draft, entry))).toThrow(
      /not found/i,
    )
  })
})
