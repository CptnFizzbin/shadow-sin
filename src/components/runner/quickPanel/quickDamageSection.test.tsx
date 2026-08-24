import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { QuickDamageSection } from "./quickDamageSection.tsx"

function renderWithDamage(physical: number, stun: number) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.attributes[AttributeKey.body] = 4
    data.attributes[AttributeKey.willpower] = 4
    data.damage.physical = physical
    data.damage.stun = stun
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<QuickDamageSection />, { wrapper: Wrapper })

  return store
}

describe("QuickDamageSection", () => {
  it("resetting physical damage dispatches setDamage and updates the store", async () => {
    // Arrange: seeded with damage taken on both tracks
    const store = renderWithDamage(3, 2)
    expect(store.getState().damage.physical).toBe(3)

    // Act: the Physical track's Reset button is the first of the two.
    const [resetPhysical] = screen.getAllByRole("button", { name: "Reset" })
    fireEvent.click(resetPhysical)

    // Assert: state updated...
    await waitFor(() => expect(store.getState().damage.physical).toBe(0))
    // ...and the stun track (untouched) is unaffected.
    expect(store.getState().damage.stun).toBe(2)
  })

  it("resetting stun damage dispatches setDamage and updates the store", async () => {
    // Arrange
    const store = renderWithDamage(3, 2)

    // Act: the Stun track's Reset button is the second of the two.
    const [, resetStun] = screen.getAllByRole("button", { name: "Reset" })
    fireEvent.click(resetStun)

    // Assert
    await waitFor(() => expect(store.getState().damage.stun).toBe(0))
    expect(store.getState().damage.physical).toBe(3)
  })
})
