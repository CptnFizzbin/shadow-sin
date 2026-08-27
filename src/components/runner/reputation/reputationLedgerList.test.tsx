import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ReputationLedgerList } from "./reputationLedgerList.tsx"

function renderList(afterBuild?: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <ReputationLedgerList />,
    { runnerStore: new RunnerDataStore(runnerDataFactory({ afterBuild })) },
  )
}

describe("ReputationLedgerList", () => {
  it("shows an empty-state message when there are no entries", () => {
    // Arrange / Act
    renderList()

    // Assert
    expect(screen.getByText("No reputation events recorded yet")).toBeTruthy()
  })

  it("renders a row per ledger entry with its stat, value, and description", () => {
    // Arrange / Act
    renderList((sheet) => {
      sheet.reputation.ledger = [
        {
          id: "00000000-0000-0000-0000-000000000001",
          stat: "streetCred",
          amount: 3,
          description: "Successful run for CorpSec",
          timestamp: "2026-01-01T00:00:00Z",
          source: "manual",
        },
      ]
    })

    // Assert
    expect(screen.getByText("Street Cred")).toBeTruthy()
    expect(screen.getByText("+3")).toBeTruthy()
    expect(screen.getByText("Successful run for CorpSec")).toBeTruthy()
  })

  it("shows a full stat label for notoriety and public awareness modifier entries", () => {
    // Arrange / Act
    renderList((sheet) => {
      sheet.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "notoriety", amount: -1, description: "Botched job", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000002", stat: "publicAwarenessModifier", amount: 1, description: "Went viral", timestamp: "2026-01-02T00:00:00Z", source: "manual" },
      ]
    })

    // Assert
    expect(screen.getByText("Notoriety")).toBeTruthy()
    expect(screen.getByText("Public Awareness Modifier")).toBeTruthy()
  })

  it("does not prefix a negative amount with a plus sign", () => {
    // Arrange / Act
    renderList((sheet) => {
      sheet.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "notoriety", amount: -2, description: "Betrayal", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
      ]
    })

    // Assert
    expect(screen.getByText("-2")).toBeTruthy()
    expect(screen.queryByText("+-2")).toBeNull()
  })

  it("lists the most recently added entry first", () => {
    // Arrange / Act
    renderList((sheet) => {
      sheet.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "streetCred", amount: 1, description: "First entry", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000002", stat: "streetCred", amount: 2, description: "Second entry", timestamp: "2026-01-02T00:00:00Z", source: "manual" },
      ]
    })

    // Assert — "Second entry" (added later) appears before "First entry" in document order
    const descriptions = screen.getAllByText(/entry$/).map((el) => el.textContent)
    expect(descriptions).toEqual(["Second entry", "First entry"])
  })
})
