import { fireEvent, screen, within } from "@testing-library/react"
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

/**
 * The filter's toggle buttons and the ledger's chips share the same three labels ("Street
 * Cred", "Notoriety", "Public Awareness"), so assertions about table content scope their
 * queries to the table — the toggle buttons live outside it.
 */
function tableScope() {
  return within(screen.getByRole("table"))
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
    expect(tableScope().getByText("Street Cred")).toBeTruthy()
    expect(tableScope().getByText("+3")).toBeTruthy()
    expect(tableScope().getByText("Successful run for CorpSec")).toBeTruthy()
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
    expect(tableScope().getByText("Notoriety")).toBeTruthy()
    expect(tableScope().getByText("Public Awareness")).toBeTruthy()
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
    const streetCredChip = tableScope().getByText("Street Cred").closest(".MuiChip-root") as HTMLElement
    const notorietyChip = tableScope().getByText("Notoriety").closest(".MuiChip-root") as HTMLElement
    const paChip = tableScope().getByText("Public Awareness").closest(".MuiChip-root") as HTMLElement

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

  it("orders entries by timestamp, not by insertion order", () => {
    // Arrange / Act — appended out of chronological order; the newest by timestamp should
    // still lead regardless of where it sits in the underlying array
    renderList((sheet) => {
      sheet.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "streetCred", amount: 1, description: "Newest", timestamp: "2026-03-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000002", stat: "streetCred", amount: 1, description: "Oldest", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000003", stat: "streetCred", amount: 1, description: "Middle", timestamp: "2026-02-01T00:00:00Z", source: "manual" },
      ]
    })

    // Assert
    const descriptions = screen.getAllByText(/^(Newest|Oldest|Middle)$/).map((el) => el.textContent)
    expect(descriptions).toEqual(["Newest", "Middle", "Oldest"])
  })

  describe("filtering by stat", () => {
    function ledgerFor(sheet: RunnerData) {
      sheet.reputation.ledger = [
        { id: "00000000-0000-0000-0000-000000000001", stat: "streetCred", amount: 1, description: "SC entry", timestamp: "2026-01-01T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000002", stat: "notoriety", amount: 1, description: "No entry", timestamp: "2026-01-02T00:00:00Z", source: "manual" },
        { id: "00000000-0000-0000-0000-000000000003", stat: "publicAwarenessModifier", amount: 1, description: "PA entry", timestamp: "2026-01-03T00:00:00Z", source: "manual" },
      ]
    }

    it("shows every stat's entries by default", () => {
      // Arrange / Act
      renderList(ledgerFor)

      // Assert
      expect(screen.getByText("SC entry")).toBeTruthy()
      expect(screen.getByText("No entry")).toBeTruthy()
      expect(screen.getByText("PA entry")).toBeTruthy()
    })

    it("hides a stat's entries when its filter is toggled off", () => {
      // Arrange
      renderList(ledgerFor)

      // Act — deselect Notoriety
      fireEvent.click(screen.getByRole("button", { name: "Notoriety" }))

      // Assert
      expect(screen.getByText("SC entry")).toBeTruthy()
      expect(screen.queryByText("No entry")).toBeNull()
      expect(screen.getByText("PA entry")).toBeTruthy()
    })

    it("shows a distinct empty state when filters exclude every entry", () => {
      // Arrange
      renderList(ledgerFor)

      // Act — deselect all three stats
      fireEvent.click(screen.getByRole("button", { name: "Street Cred" }))
      fireEvent.click(screen.getByRole("button", { name: "Notoriety" }))
      fireEvent.click(screen.getByRole("button", { name: "Public Awareness" }))

      // Assert
      expect(screen.getByText("No entries match the selected filters")).toBeTruthy()
      expect(screen.queryByText("No reputation events recorded yet")).toBeNull()
    })

    it("restores hidden entries when the filter is toggled back on", () => {
      // Arrange
      renderList(ledgerFor)
      fireEvent.click(screen.getByRole("button", { name: "Notoriety" }))
      expect(screen.queryByText("No entry")).toBeNull()

      // Act
      fireEvent.click(screen.getByRole("button", { name: "Notoriety" }))

      // Assert
      expect(screen.getByText("No entry")).toBeTruthy()
    })
  })
})
