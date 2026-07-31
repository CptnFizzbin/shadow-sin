import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import type {
  AttrIncreaseEntry,
  LearnActiveSkillEntry,
  SkillIncreaseEntry,
} from "./improvementEntry.ts"
import { ImprovementStore } from "./improvementStore.ts"
import { ImprovementType } from "./improvementType.ts"
import { applyImprovements } from "./improvementUtils.ts"

const FAKE_ID = "00000000-0000-0000-0000-000000000000" as UUID

describe("applyImprovements — karma ledger writes", () => {
  it("appends one ledger entry per applied improvement", () => {
    // Arrange — two improvements: Body 3→4 (20k) and learn Pistols rating 1 (4k)
    const sheet = runnerDataFactory((draft) => {
      draft.attributes[AttributeKey.body] = 3
      draft.skills.activeSkills = []
      draft.skills.skillGroups = []
      draft.karma.current = 100
      draft.karma.total = 100
      return draft
    })
    const runnerStore = new RunnerDataStore(sheet)
    const improvementStore = new ImprovementStore()
    const attrEntry: Omit<AttrIncreaseEntry, "id"> = {
      type: ImprovementType.attrIncrease,
      attr: AttributeKey.body,
      baseRating: 3,
      newRating: 4,
    }
    const learnEntry: Omit<LearnActiveSkillEntry, "id"> = {
      type: ImprovementType.learnActiveSkill,
      skill: { name: SkillKey.pistols, rating: 1 },
    }
    improvementStore.add(attrEntry)
    improvementStore.add(learnEntry)

    // Act
    applyImprovements(improvementStore, runnerStore)

    // Assert
    const log = runnerStore.getState().karma.log
    expect(log).toHaveLength(2)
    expect(log.every((entry) => entry.source === "spendKarma")).toBe(true)
    expect(log.every((entry) => entry.amount < 0)).toBe(true)
    // Total amount in ledger matches karma deducted
    const totalDeducted = log.reduce((sum, entry) => sum + entry.amount, 0)
    expect(totalDeducted).toBe(-(20 + 4))
    expect(runnerStore.getState().karma.current).toBe(100 - 20 - 4)
  })

  it("preserves the full ImprovementEntry on each ledger entry for v2 undo support", () => {
    // Arrange — Archery is not part of any skill group, so no group-break logic runs
    const sheet = runnerDataFactory((draft) => {
      draft.skills.activeSkills = [{ name: SkillKey.archery, rating: 3 }]
      draft.skills.skillGroups = []
      draft.karma.current = 50
      return draft
    })
    const runnerStore = new RunnerDataStore(sheet)
    const improvementStore = new ImprovementStore()
    const entry: Omit<SkillIncreaseEntry, "id"> = {
      type: ImprovementType.skillIncrease,
      skillType: "ActiveSkill",
      skill: SkillKey.archery,
      baseRating: 3,
      newRating: 4,
    }
    const added = improvementStore.add(entry)

    // Act
    applyImprovements(improvementStore, runnerStore)

    // Assert — improvement payload round-trips onto the ledger entry
    const logged = runnerStore.getState().karma.log[0]
    expect(logged.improvement).toEqual(added)
  })

  it("writes a description derived from the entry shape", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.attributes[AttributeKey.agility] = 4
      draft.karma.current = 50
      return draft
    })
    const runnerStore = new RunnerDataStore(sheet)
    const improvementStore = new ImprovementStore()
    const entry: Omit<AttrIncreaseEntry, "id"> = {
      type: ImprovementType.attrIncrease,
      attr: AttributeKey.agility,
      baseRating: 4,
      newRating: 5,
    }
    improvementStore.add(entry)

    // Act
    applyImprovements(improvementStore, runnerStore)

    // Assert
    expect(runnerStore.getState().karma.log[0].description).toBe("Raised AGI 4 → 5")
  })

  it("does not append to the ledger when the improvement queue is empty", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.karma.current = 50
      return draft
    })
    const runnerStore = new RunnerDataStore(sheet)
    const improvementStore = new ImprovementStore()

    // Act
    applyImprovements(improvementStore, runnerStore)

    // Assert
    expect(runnerStore.getState().karma.log).toEqual([])
  })

  it("stamps each entry with an ISO 8601 timestamp", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.attributes[AttributeKey.body] = 3
      draft.karma.current = 50
      return draft
    })
    const runnerStore = new RunnerDataStore(sheet)
    const improvementStore = new ImprovementStore()
    const entry: Omit<AttrIncreaseEntry, "id"> = {
      type: ImprovementType.attrIncrease,
      attr: AttributeKey.body,
      baseRating: 3,
      newRating: 4,
    }
    improvementStore.add(entry)

    // Act
    applyImprovements(improvementStore, runnerStore)

    // Assert — ISO 8601 round-trips cleanly to a valid Date
    const timestamp = runnerStore.getState().karma.log[0].timestamp
    expect(new Date(timestamp).toISOString()).toBe(timestamp)
  })

  it("ignores the FAKE_ID constant — entries are generated with fresh UUIDs", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.karma.current = 50
      return draft
    })
    const runnerStore = new RunnerDataStore(sheet)
    const improvementStore = new ImprovementStore()
    const entry: Omit<AttrIncreaseEntry, "id"> = {
      type: ImprovementType.attrIncrease,
      attr: AttributeKey.body,
      baseRating: 3,
      newRating: 4,
    }
    improvementStore.add(entry)

    // Act
    applyImprovements(improvementStore, runnerStore)

    // Assert — ledger entry has its own id, distinct from FAKE_ID
    expect(runnerStore.getState().karma.log[0].id).not.toBe(FAKE_ID)
    expect(runnerStore.getState().karma.log[0].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  })
})
