import { produce } from "immer"
import { describe, expect, it } from "vitest"

import type { UUID } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import type { ComplexFormIncreaseEntry } from "./improvementEntry.ts"
import { ImprovementType } from "./improvementType.ts"
import { applyImprovement } from "./improvementUtils.ts"

const FAKE_ID = "00000000-0000-0000-0000-000000000000" as UUID

describe.concurrent("applyImprovement — complexFormIncrease", () => {
  it("raises the rating of the matching complex form and deducts karma", () => {
    // Arrange — 2 → 3 costs 3*1 = 3
    const entry: ComplexFormIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.complexFormIncrease,
      complexFormId: "cf1",
      baseRating: 2,
      newRating: 3,
    }
    const sheet = runnerDataFactory({ afterBuild: (draft) => {
      draft.complexForms = [{ kind: EntityKind.complexForm, id: "cf1", name: "Resonance Spike", rating: 2 }]
      draft.karma.current = 20
    } })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(next.complexForms.find((cf) => cf.id === "cf1")?.rating).toBe(3)
    expect(next.karma.current).toBe(20 - 3)
  })

  it("throws when the targeted complex form is missing", () => {
    // Arrange
    const entry: ComplexFormIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.complexFormIncrease,
      complexFormId: "missing-cf",
      baseRating: 1,
      newRating: 2,
    }
    const sheet = runnerDataFactory({ afterBuild: (draft) => {
      draft.complexForms = [{ kind: EntityKind.complexForm, id: "cf1", name: "Resonance Spike", rating: 1 }]
    } })

    // Act + Assert
    expect(() => produce(sheet, (draft) => applyImprovement(draft, entry))).toThrow(
      /not found/i,
    )
  })
})
