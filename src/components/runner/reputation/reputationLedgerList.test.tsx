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
    expect(screen.getByText("Public Awareness")).toBeTruthy()
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

  // Street Cred and Notoriety intentionally have opposite polarity: going up is good for
  // Street Cred (green) but bad for Notoriety (red), so the same positive amount must render
  // in different colors for the two stats.
  it("colors Street Cred green when up and red when down", () => {
    // Arrange / Act
    renderList((sheet) => {
      sheet.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "streetCred", amount: 2, description: "Up", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000002", stat: "streetCred", amount: -2, description: "Down", timestamp: "2026-01-02T00:00:00Z", source: "manual" },
      ]
    })
    const upValue = screen.getByText("Up").closest("tr")!.querySelector("td:nth-child(2) p")!
    const downValue = screen.getByText("Down").closest("tr")!.querySelector("td:nth-child(2) p")!

    // Assert
    expect(getComputedStyle(upValue).color).toBe("#2e7d32") // success.main
    expect(getComputedStyle(downValue).color).toBe("#d32f2f") // error.main
  })

  it("colors Notoriety red when up and green when down — the inverse of Street Cred", () => {
    // Arrange / Act
    renderList((sheet) => {
      sheet.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "notoriety", amount: 2, description: "Up", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000002", stat: "notoriety", amount: -2, description: "Down", timestamp: "2026-01-02T00:00:00Z", source: "manual" },
      ]
    })
    const upValue = screen.getByText("Up").closest("tr")!.querySelector("td:nth-child(2) p")!
    const downValue = screen.getByText("Down").closest("tr")!.querySelector("td:nth-child(2) p")!

    // Assert
    expect(getComputedStyle(upValue).color).toBe("#d32f2f") // error.main
    expect(getComputedStyle(downValue).color).toBe("#2e7d32") // success.main
  })

  it("colors Public Awareness blue when up and purple when down — its own pair, not green/red", () => {
    // Arrange / Act
    renderList((sheet) => {
      sheet.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "publicAwarenessModifier", amount: 2, description: "Up", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000002", stat: "publicAwarenessModifier", amount: -2, description: "Down", timestamp: "2026-01-02T00:00:00Z", source: "manual" },
      ]
    })
    const upValue = screen.getByText("Up").closest("tr")!.querySelector("td:nth-child(2) p")!
    const downValue = screen.getByText("Down").closest("tr")!.querySelector("td:nth-child(2) p")!

    // Assert
    expect(getComputedStyle(upValue).color).toBe("#0288d1") // info.main (blue)
    expect(getComputedStyle(downValue).color).toBe("#ab47bc") // purple[400]
  })

  it("colors each stat's chip to match its identity: green, red, and purple", () => {
    // Arrange / Act
    renderList((sheet) => {
      sheet.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "streetCred", amount: 1, description: "SC", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000002", stat: "notoriety", amount: 1, description: "No", timestamp: "2026-01-02T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000003", stat: "publicAwarenessModifier", amount: 1, description: "PA", timestamp: "2026-01-03T00:00:00Z", source: "manual" },
      ]
    })
    const streetCredChip = screen.getByText("Street Cred").closest(".MuiChip-root") as HTMLElement
    const notorietyChip = screen.getByText("Notoriety").closest(".MuiChip-root") as HTMLElement
    const paChip = screen.getByText("Public Awareness").closest(".MuiChip-root") as HTMLElement

    // Assert
    expect(getComputedStyle(streetCredChip).color).toBe("#2e7d32") // success.main
    expect(getComputedStyle(notorietyChip).color).toBe("#d32f2f") // error.main
    expect(getComputedStyle(paChip).color).toBe("#ab47bc") // purple[400]
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
