import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataProvider } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { ProfileSection } from "./profileSection.tsx"

function renderSection() {
  const runnerData = runnerDataFactory((data) => {
    data.profile.alias = "Ghost"
    data.profile.name = "Jane Doe"
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerDataProvider store={store}>{children}</RunnerDataProvider>
  )

  render(<ProfileSection />, { wrapper: Wrapper })

  return store
}

describe("ProfileSection", () => {
  it("shows the runner's profile fields from the store", () => {
    // Arrange / Act
    renderSection()

    // Assert
    expect((screen.getByLabelText("Alias") as HTMLInputElement).value).toBe("Ghost")
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Jane Doe")
  })

  it("editing the alias dispatches setProfileAlias, updating the store and the UI", async () => {
    // Arrange
    const store = renderSection()

    // Act
    fireEvent.change(screen.getByLabelText("Alias"), { target: { value: "Wraith" } })

    // Assert: state updated...
    await waitFor(() => expect(store.state.profile.alias).toBe("Wraith"))
    // ...and the UI re-rendered off that same state.
    expect((screen.getByLabelText("Alias") as HTMLInputElement).value).toBe("Wraith")
  })

  it("clearing the archetype dispatches setProfileArchetype with null", async () => {
    // Arrange
    const store = renderSection()
    fireEvent.change(screen.getByLabelText("Archetype"), { target: { value: "Street Samurai" } })
    await waitFor(() => expect(store.state.profile.archetype).toBe("Street Samurai"))

    // Act
    fireEvent.change(screen.getByLabelText("Archetype"), { target: { value: "" } })

    // Assert
    await waitFor(() => expect(store.state.profile.archetype).toBeNull())
  })
})
