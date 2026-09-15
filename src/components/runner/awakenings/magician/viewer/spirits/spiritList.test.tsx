import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { SpiritData } from "#/system/model/magic/spiritData.ts"
import { SpiritType } from "#/system/model/magic/spiritData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

import { SpiritList } from "./spiritList.tsx"

const fireSpirit: SpiritData = {
  kind: EntityKind.spirit,
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
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.spirits = spirits
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
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

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))
    fireEvent.click(await screen.findByRole("button", { name: "Dismiss" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().runner.spirits).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Ember")).toBeNull()
  })

  it("adjusting the physical damage track dispatches saveSpirit and updates the store", async () => {
    // Arrange: seeded with 2 boxes of physical damage taken; box 3 is the first wound-marker
    // cell (labeled "-1") on both Physical and Stun tracks — Physical renders first.
    const store = renderWithSpirits([fireSpirit])
    expect(store.getState().runner.spirits[0].damage.physical).toBe(2)

    // Act
    const [physicalWoundCell] = screen.getAllByRole("button", { name: "-1" })
    fireEvent.click(physicalWoundCell)

    // Assert: state updated...
    await waitFor(() => expect(store.getState().runner.spirits[0].damage.physical).toBe(3))
    // ...and the UI re-rendered off that same state.
    expect(store.getState().runner.spirits[0].damage.stun).toBe(0)
  })
})
