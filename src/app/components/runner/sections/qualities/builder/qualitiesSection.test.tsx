import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { QualitiesSection } from "./qualitiesSection.tsx"

function renderSection() {
  const runnerData = runnerDataFactory()
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<QualitiesSection />, { wrapper: Wrapper })

  return store
}

describe("QualitiesSection", () => {
  it("adding a quality dispatches addQuality and updates the store", async () => {
    // Arrange
    const store = renderSection()
    expect(store.getState().runner.qualities).toHaveLength(0)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add quality/i }))
    const dialog = await screen.findByRole("dialog", { name: "Add Quality" })
    fireEvent.change(within(dialog).getByLabelText(/^name/i), {
      target: { value: "Danger Sense" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().runner.qualities).toHaveLength(1))
    expect(store.getState().runner.qualities[0].name).toBe("Danger Sense")
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("Danger Sense")).toBeDefined()
  })
})
