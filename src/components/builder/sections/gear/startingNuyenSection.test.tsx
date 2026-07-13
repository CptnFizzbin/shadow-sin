import { act, fireEvent, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { BuilderState } from "#/components/builder/builderState.ts"
import { builderStateFactory } from "#/components/builder/builderState.ts"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { builderStoreReducer } from "#/stores/builder/builderStore.reducer.ts"
import { DiceRoller } from "#/system/dice/diceRoller.ts"
import { LifestyleType } from "#/system/lifestyleType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { StartingNuyenSection } from "./startingNuyenSection.tsx"

function renderWithStreetLifestyle(builderOverrides?: Partial<BuilderState>) {
  return renderInBuilder(<StartingNuyenSection />, {
    runnerStore: new RunnerDataStore(runnerDataFactory((runner) => ({
      ...runner,
      profile: { ...runner.profile, lifestyle: { quality: LifestyleType.Street, monthsPaid: 1 } },
    }))),
    builderStore: createCompatStore({ ...builderStateFactory(), ...builderOverrides }, builderStoreReducer),
  })
}

describe("StartingNuyenSection", () => {
  describe("rolling", () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it("rolling dice dispatches setStartingNuyen and shows the resolved total", () => {
      // Arrange: Street is 1d6 x10¥, no gear purchased so no unspent-nuyen bonus.
      vi.spyOn(DiceRoller.prototype, "rollD6").mockReturnValue(4)
      renderWithStreetLifestyle()

      // Act
      fireEvent.click(screen.getByRole("button", { name: "Roll" }))
      act(() => {
        vi.runAllTimers()
      })

      // Assert: the UI re-rendered off the updated builder store. (`getByText`, not
      // `findByText` — its internal polling would need real timers to ever resolve.)
      expect(screen.getByText("40¥")).toBeDefined()
      expect(screen.getByRole("button", { name: "Reroll" })).toBeDefined()
      expect(screen.getByRole("button", { name: "Apply to Nuyen" })).toBeDefined()
    })

    it("applying to nuyen dispatches setNuyenAmount, updating the button to reflect it", () => {
      // Arrange
      vi.spyOn(DiceRoller.prototype, "rollD6").mockReturnValue(4)
      renderWithStreetLifestyle()
      fireEvent.click(screen.getByRole("button", { name: "Roll" }))
      act(() => {
        vi.runAllTimers()
      })
      screen.getByText("40¥")

      // Act
      fireEvent.click(screen.getByRole("button", { name: "Apply to Nuyen" }))

      // Assert: the UI re-rendered off the runner store's updated nuyen balance.
      const appliedButton = screen.getByRole("button", { name: "Applied to Nuyen" })
      expect((appliedButton as HTMLButtonElement).disabled).toBe(true)
    })
  })

  it("shows a starting nuyen persisted from an earlier roll without requiring a reroll", () => {
    // Arrange / Act
    renderWithStreetLifestyle({ nuyen: { starting: 250 } })

    // Assert
    expect(screen.getByText("250¥")).toBeDefined()
    expect(screen.getByText("From an earlier roll")).toBeDefined()
    expect(screen.getByRole("button", { name: "Reroll" })).toBeDefined()
    expect(screen.getByRole("button", { name: "Apply to Nuyen" })).toBeDefined()
  })

  it("resetting clears the persisted starting nuyen and shows the roll range again", () => {
    // Arrange
    renderWithStreetLifestyle({ nuyen: { starting: 250 } })
    expect(screen.getByText("250¥")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Reset" }))

    // Assert: the UI re-rendered off the cleared builder store.
    expect(screen.queryByText("250¥")).toBeNull()
    expect(screen.getByRole("button", { name: "Roll" })).toBeDefined()
    expect(screen.queryByRole("button", { name: "Apply to Nuyen" })).toBeNull()
  })
})
