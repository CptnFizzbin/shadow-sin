import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { KarmaSection } from "./karmaSection.tsx"

function renderWithKarma(current: number, total: number, streetCred?: number, notoriety?: number) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.karma.current = current
    data.karma.total = total
    if (streetCred !== undefined) {
      data.profile.streetCred = streetCred
    }
    if (notoriety !== undefined) {
      data.profile.notoriety = notoriety
    }
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<KarmaSection />, { wrapper: Wrapper })

  return store
}

describe("KarmaSection", () => {
  it("shows current and total karma from the store", () => {
    // Arrange / Act
    renderWithKarma(5, 20)

    // Assert
    expect(screen.getByText("5")).toBeDefined()
    expect(screen.getByText("20")).toBeDefined()
  })

  it("shows Street Cred, Notoriety, and Public Awareness counters from the store", () => {
    // Arrange / Act
    renderWithKarma(5, 20, 10, 5)

    // Assert
    expect(screen.getByText("Street Cred")).toBeDefined()
    expect(screen.getByText("Notoriety")).toBeDefined()
    expect(screen.getByText("Public Awareness")).toBeDefined()
    // Street Cred value should be 10
    const streetCredElement = screen.getByText("Street Cred").parentElement
    expect(streetCredElement?.textContent).toContain("10")
    // Notoriety value should be 5
    const notorietyElement = screen.getByText("Notoriety").parentElement
    expect(notorietyElement?.textContent).toContain("5")
    // Public Awareness is calculated as floor((streetCred + notoriety) / 3) = floor(15 / 3) = 5
    const publicAwarenessElement = screen.getByText("Public Awareness").parentElement
    expect(publicAwarenessElement?.textContent).toContain("5")
  })

  it("adding karma dispatches addKarma, updating current and total in the store and the UI", async () => {
    // Arrange
    const store = renderWithKarma(5, 20)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add karma/i }))
    const dialog = await screen.findByRole("dialog", { name: "Add Karma" })
    fireEvent.click(within(dialog).getByRole("button", { name: /add/i }))

    // Assert: state updated (default Amount is 1)...
    await waitFor(() => expect(store.getState().karma.current).toBe(6))
    expect(store.getState().karma.total).toBe(21)
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("6")).toBeDefined()
    expect(screen.getByText("21")).toBeDefined()
  })
})
