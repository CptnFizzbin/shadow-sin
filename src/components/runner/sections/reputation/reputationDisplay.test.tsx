import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ReputationUtils } from "#/system/model/reputation/createLedgerEntry.ts"
import { ReputationStatType } from "#/system/model/reputation/reputationLedgerEntry.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ReputationDisplay } from "./reputationDisplay.tsx"

function renderDisplay(afterBuild: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <ReputationDisplay />,
    { runner: runnerDataFactory({ afterBuild }) },
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
    // Arrange / Act
    renderDisplay((sheet) => {
      sheet.karma.total = 40
    })

    // Assert
    expect(screen.getByText("Public Awareness")).toBeTruthy()
    expect(screen.getByText("1 - Known")).toBeTruthy()
  })

  it("explains the current Public Awareness rank in a tooltip when its help button is clicked", async () => {
    // Arrange
    renderDisplay((sheet) => {
      sheet.karma.total = 40
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "About the Known rank" }))

    // Assert
    expect((await screen.findByRole("tooltip")).textContent).toContain("starting to make a name for yourself")
  })

  it("renders the rank description as text, without a help button, in inline mode", () => {
    // Arrange
    renderWithProviders(
      <ReputationDisplay descriptionStyle="inline" />,
      { runner: runnerDataFactory({ afterBuild: (sheet) => { sheet.karma.total = 40 } }) },
    )

    // Assert
    expect(screen.getByText(/starting to make a name for yourself/)).toBeTruthy()
    expect(screen.queryByRole("button", { name: "About the Known rank" })).toBeNull()
  })
})
