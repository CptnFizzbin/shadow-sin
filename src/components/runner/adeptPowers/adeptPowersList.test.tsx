import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { AdeptPowersList } from "./adeptPowersList.tsx"

const improvedReflexes: AdeptPowerData = {
  kind: EntityKind.adeptPower,
  type: "adeptPower",
  id: "00000000-0000-0000-0000-000000000001",
  name: "Improved Reflexes",
  rating: 1,
  costPerRating: 1.5,
}

function renderWithPowers(powers: AdeptPowerData[]) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.attributes[AttributeKey.magic] = 6
    data.powers = powers
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<AdeptPowersList />, { wrapper: Wrapper })

  return store
}

describe("AdeptPowersList", () => {
  it("shows adept powers and used power points from the store", () => {
    // Arrange / Act
    renderWithPowers([improvedReflexes])

    // Assert
    expect(screen.getByText("Improved Reflexes")).toBeDefined()
    expect(screen.getByText("1.5 / 6 PP")).toBeDefined()
  })

  it("adding a power dispatches savePower and updates the store", async () => {
    // Arrange
    const store = renderWithPowers([])

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add power/i }))
    const dialog = await screen.findByRole("dialog", { name: "Add Adept Power" })
    fireEvent.change(within(dialog).getByLabelText(/^name/i), {
      target: { value: "Combat Sense" },
    })
    // The form's default Source.page (0) fails validation (min 1) even though
    // Source itself is optional data — a pre-existing quirk unrelated to this
    // migration. Give it a valid page so the save actually goes through.
    fireEvent.change(within(dialog).getByLabelText(/^page/i), {
      target: { value: "1" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().powers).toHaveLength(1))
    expect(store.getState().powers[0].name).toBe("Combat Sense")
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("Combat Sense")).toBeDefined()
  })
})
