import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { QualityData } from "#/system/qualityData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { QualitiesList } from "./qualitiesList.tsx"

const toughness: QualityData = {
  kind: EntityKind.quality,
  id: NullUuid,
  name: "Toughness",
  type: "positive",
  bpValue: 10,
}

function renderWithQualities(qualities: QualityData[]) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.qualities = qualities
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<QualitiesList />, { wrapper: Wrapper })

  return store
}

describe("QualitiesList", () => {
  it("shows qualities from the store, with their BP cost", () => {
    // Arrange / Act
    renderWithQualities([toughness])

    // Assert
    expect(screen.getByText("Toughness")).toBeDefined()
    expect(screen.getByText("10 BP")).toBeDefined()
  })

  it("removing a quality dispatches removeQuality and updates the store", async () => {
    // Arrange
    const store = renderWithQualities([toughness])

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Remove quality Toughness" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().qualities).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Toughness")).toBeNull()
    expect(screen.getByText("No Qualities qualities added")).toBeDefined()
  })

  it("editing and saving a quality dispatches updateQuality and updates the store", async () => {
    // Arrange
    const store = renderWithQualities([toughness])

    // Act: open the pre-filled edit dialog, change the BP cost, and save.
    // (updateQuality matches by name, so the name itself must stay stable.)
    fireEvent.click(screen.getByText("Toughness"))
    const dialog = await screen.findByRole("dialog", { name: "Edit Quality" })
    fireEvent.change(within(dialog).getByLabelText(/BP Cost/i), {
      target: { value: "15" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().qualities[0].bpValue).toBe(15))
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("15 BP")).toBeDefined()
    expect(screen.queryByText("10 BP")).toBeNull()
  })
})
