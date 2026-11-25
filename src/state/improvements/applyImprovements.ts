import { produce } from "immer"

import type { UUID } from "#common/uuid/uuidUtils.ts"
import type { RunnerData } from "#data/runner/runnerData.ts"
import { describeImprovement } from "#rules/karma/improvements/improvementDescription.ts"
import { applyImprovement, getImprovementCost } from "#rules/karma/improvements/improvementUtils.ts"

import type { ImprovementStore } from "./improvementStore.ts"

export const applyImprovements = (
  improvementsStore: ImprovementStore,
  runnerStore: {
    setState: (
      updater: (runner: RunnerData) => RunnerData,
    ) => void
  },
): void => {
  const improvementsState = improvementsStore.store.getState()

  runnerStore.setState(produce((sheet) => {
    for (const entry of Object.values(improvementsState)) {
      const cost = getImprovementCost(entry)
      applyImprovement(sheet, entry, cost)
      sheet.karma.log.push({
        id: crypto.randomUUID() as UUID,
        timestamp: new Date().toISOString(),
        amount: -cost,
        description: describeImprovement(entry),
        source: "spendKarma",
        improvement: entry,
      })
    }
  }))
}
