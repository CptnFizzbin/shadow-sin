import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { AdeptPowersViewerSection } from "./adeptPowersViewerSection.tsx"

const improvedReflexes: AdeptPowerData = {
  type: "adeptPower",
  id: "00000000-0000-0000-0000-000000000001",
  name: "Improved Reflexes",
  rating: 1,
  costPerRating: 1.5,
}

function renderWithPowers(powers: AdeptPowerData[]) {
  const runnerData = runnerDataFactory((data) => {
    data.attributes[AttributeKey.magic] = 6
    data.powers = powers
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<AdeptPowersViewerSection />, { wrapper: Wrapper })

  return store
}

describe("AdeptPowersViewerSection", () => {
  it("shows a placeholder when no adept powers are learned", () => {
    // Arrange / Act
    renderWithPowers([])

    // Assert
    expect(screen.getByText("No adept powers learned")).toBeDefined()
  })

  it("deleting a power from the edit dialog dispatches removePower and updates the store", async () => {
    // Arrange
    const store = renderWithPowers([improvedReflexes])

    // Act
    fireEvent.click(screen.getByText("Improved Reflexes"))
    const dialog = await screen.findByRole("dialog", { name: "Edit Adept Power" })
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }))

    // Assert: state updated...
    await waitFor(() => expect(store.state.powers).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.getByText("No adept powers learned")).toBeDefined()
  })
})
