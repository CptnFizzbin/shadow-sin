import { produce } from "immer"
import { describe, expect, it } from "vitest"

import type { UUID } from "#/lib/uuidUtils.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import type { InitiationIncreaseEntry, SubmersionIncreaseEntry } from "./improvementEntry.ts"
import { ImprovementType } from "./improvementType.ts"
import { applyImprovement } from "./improvementUtils.ts"

const FAKE_ID = "00000000-0000-0000-0000-000000000000" as UUID

describe.concurrent("applyImprovement — initiationIncrease", () => {
  it("raises the initiate grade and deducts karma", () => {
    // Arrange — grade 0 → 1 costs 10 + 1*3 = 13
    const entry: InitiationIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.initiationIncrease,
      baseGrade: 0,
      newGrade: 1,
    }
    const sheet = runnerDataFactory((draft) => {
      draft.karma.current = 13
      return draft
    })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(next.initiateGrade).toBe(1)
    expect(next.karma.current).toBe(0)
  })
})

describe.concurrent("applyImprovement — submersionIncrease", () => {
  it("raises the submersion grade and deducts karma", () => {
    // Arrange — grade 0 → 1 costs 10 + 1*3 = 13
    const entry: SubmersionIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.submersionIncrease,
      baseGrade: 0,
      newGrade: 1,
    }
    const sheet = runnerDataFactory((draft) => {
      draft.karma.current = 13
      return draft
    })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(next.submersionGrade).toBe(1)
    expect(next.karma.current).toBe(0)
  })
})
