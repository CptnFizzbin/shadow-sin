import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { QuickEdgeSection } from "./quickEdgeSection.tsx"

function renderWithEdge(max: number, current: number) {
  const runnerData = runnerDataFactory({ override: (data) => {
    data.attributes[AttributeKey.edge] = max
    data.edge.current = current
    return data
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<QuickEdgeSection />, { wrapper: Wrapper })

  return store
}

describe("QuickEdgeSection", () => {
  it("disables Spend 1 when current edge is 0", () => {
    // Arrange / Act
    renderWithEdge(4, 0)

    // Assert
    expect((screen.getByRole("button", { name: "Spend 1" }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole("button", { name: "Regain 1" }) as HTMLButtonElement).disabled).toBe(false)
  })

  it("disables Regain 1 when current edge is at max", () => {
    // Arrange / Act
    renderWithEdge(4, 4)

    // Assert
    expect((screen.getByRole("button", { name: "Regain 1" }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole("button", { name: "Spend 1" }) as HTMLButtonElement).disabled).toBe(false)
  })

  it("clicking Spend 1 dispatches setCurrentEdge, updating the store and re-rendering the UI off it", async () => {
    // Arrange
    const store = renderWithEdge(4, 1)
    expect((screen.getByRole("button", { name: "Spend 1" }) as HTMLButtonElement).disabled).toBe(false)

    // Act: spend the last point of edge
    fireEvent.click(screen.getByRole("button", { name: "Spend 1" }))

    // Assert: state updated (setCurrentEdge is an async thunk)...
    await waitFor(() => expect(store.getState().edge.current).toBe(0))
    // ...and the UI re-rendered off that same state.
    expect((screen.getByRole("button", { name: "Spend 1" }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("clicking Regain 1 dispatches setCurrentEdge and updates the store", async () => {
    // Arrange
    const store = renderWithEdge(4, 2)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Regain 1" }))

    // Assert
    await waitFor(() => expect(store.getState().edge.current).toBe(3))
  })

  it("clicking an edge cell above current sets current to that cell's value", async () => {
    // Arrange
    const store = renderWithEdge(4, 2)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "4" }))

    // Assert
    await waitFor(() => expect(store.getState().edge.current).toBe(4))
  })

  it("clicking the cell matching current toggles it back by one", async () => {
    // Arrange
    const store = renderWithEdge(4, 2)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "2" }))

    // Assert
    await waitFor(() => expect(store.getState().edge.current).toBe(1))
  })

  it("disables the burn button when max edge is 1", () => {
    // Arrange / Act
    renderWithEdge(1, 1)

    // Assert
    expect((screen.getByRole("button", { name: "Burn edge" }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("burning edge, once confirmed, reduces max by 1 and resets current to 0", async () => {
    // Arrange
    const store = renderWithEdge(4, 2)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Burn edge" }))
    fireEvent.click(await screen.findByRole("button", { name: "BURN IT" }))

    // Assert
    await waitFor(() => expect(store.getState().attributes[AttributeKey.edge]).toBe(3))
    expect(store.getState().edge.current).toBe(0)
    expect(await screen.findByRole("button", { name: "3" })).toBeDefined()
  })

  it("does not burn edge when the confirmation is cancelled", async () => {
    // Arrange
    const store = renderWithEdge(4, 2)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Burn edge" }))
    fireEvent.click(await screen.findByRole("button", { name: "Cancel" }))

    // Assert: dialog closes without dispatching burnEdge
    await waitFor(() => expect(screen.queryByRole("button", { name: "BURN IT" })).toBeNull())
    expect(store.getState().attributes[AttributeKey.edge]).toBe(4)
    expect(store.getState().edge.current).toBe(2)
  })
})
