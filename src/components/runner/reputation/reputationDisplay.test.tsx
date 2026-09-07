import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { ReputationUtils } from "#/system/reputation/createLedgerEntry.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ReputationDisplay } from "./reputationDisplay.tsx"
import { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

function renderDisplay(afterBuild: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <ReputationDisplay />,
    { runnerStore: new RunnerDataStore(runnerDataFactory({ afterBuild })) },
  )
}

describe("ReputationDisplay", () => {
  it("shows Street Cred and Notoriety as plain numbers", () => {
    // Arrange / Act — streetCred = floor(40 / 10) = 4
    renderDisplay((sheet) => {
      sheet.karma.total = 40
      sheet.reputation.ledger = [
        ReputationUtils.createLedgerEntry({ stat: ReputationStatType.notoriety, amount: 2, description: "Bump" }),
      ]
    })

    // Assert
    expect(screen.getByText("Street Cred")).toBeTruthy()
    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("Notoriety")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
  })

  it("shows Public Awareness as its rating alongside the rank title", () => {
    // Arrange / Act — streetCred=floor(40/10)=4, notoriety=0 ⇒ floor((4+0)/3) = 1 ("Shadow")
    renderDisplay((sheet) => {
      sheet.karma.total = 40
    })

    // Assert
    expect(screen.getByText("Public Awareness")).toBeTruthy()
    expect(screen.getByText("1 - Shadow")).toBeTruthy()
  })
})
