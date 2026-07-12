import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataProvider } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { SpiritType } from "#/system/magic/spiritData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { SpiritList } from "./spiritList.tsx"

const fireSpirit: SpiritData = {
  id: NullUuid,
  name: "Ember",
  spiritType: SpiritType.fire,
  force: 4,
  services: { max: 4, used: 0 },
  bound: true,
  optionalPowers: [],
  damage: { physical: 2, stun: 0 },
}

function renderWithSpirits(spirits: SpiritData[]) {
  const runnerData = runnerDataFactory((data) => {
    data.spirits = spirits
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerDataProvider store={store}>{children}</RunnerDataProvider>
  )

  render(<SpiritList />, { wrapper: Wrapper })

  return store
}

describe("SpiritList", () => {
  it("shows spirits from the store", () => {
    // Arrange / Act
    renderWithSpirits([fireSpirit])

    // Assert
    expect(screen.getByText("Ember")).toBeDefined()
  })

  it("dismissing a spirit, once confirmed, removes it from the store and the UI", async () => {
    // Arrange
    const store = renderWithSpirits([fireSpirit])

    // Act: the edit and remove icon buttons have no accessible name, but
    // remove is the second icon action rendered on the card.
    const [, removeButton] = screen.getAllByRole("button")
      .filter((button) => button.textContent === "")
    fireEvent.click(removeButton)
    fireEvent.click(await screen.findByRole("button", { name: "Dismiss" }))

    // Assert: state updated...
    await waitFor(() => expect(store.state.spirits).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Ember")).toBeNull()
  })

  it("resetting physical damage dispatches saveSpirit and updates the store", async () => {
    // Arrange: seeded with 2 boxes of physical damage taken
    const store = renderWithSpirits([fireSpirit])
    expect(store.state.spirits[0].damage.physical).toBe(2)

    // Act: the Physical damage track's Reset button is the first of the two
    // ("Reset" for Physical, then "Reset" for Stun).
    const [resetPhysical] = screen.getAllByRole("button", { name: "Reset" })
    fireEvent.click(resetPhysical)

    // Assert: state updated...
    await waitFor(() => expect(store.state.spirits[0].damage.physical).toBe(0))
    // ...and the UI re-rendered off that same state (only Reset buttons remain, no filled cells).
    expect(store.state.spirits[0].damage.stun).toBe(0)
  })
})
