import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { DiceTrayApi } from "./diceTrayApi.ts"
import { DiceTrayEdgeControls } from "./diceTrayEdgeControls.tsx"
import { DiceTrayProvider } from "./diceTrayProvider.tsx"

function renderWithEdge(max: number, current: number) {
  const runnerData = runnerDataFactory((data) => {
    data.attributes[AttributeKey.edge] = max
    data.edge.current = current
    return data
  })
  const store = new RunnerDataStore(runnerData)
  const diceTrayApi = new DiceTrayApi()

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>
      <DiceTrayProvider diceTrayApi={diceTrayApi}>{children}</DiceTrayProvider>
    </RunnerStoreProvider>
  )

  render(<DiceTrayEdgeControls />, { wrapper: Wrapper })

  return { store, diceTrayApi }
}

describe("DiceTrayEdgeControls", () => {
  it("renders the current/max edge from the runner store", () => {
    // Arrange / Act
    renderWithEdge(4, 2)

    // Assert
    expect(screen.getByText("Edge (2/4)")).toBeDefined()
  })

  it("disables both buttons when there is no edge left to spend", () => {
    // Arrange / Act
    renderWithEdge(4, 0)

    // Assert
    expect((screen.getByRole("button", { name: "Reroll Misses" }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole("button", { name: "Roll Edge" }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("disables Reroll Misses until a roll has happened, even with edge available", () => {
    // Arrange / Act
    renderWithEdge(4, 2)

    // Assert: nothing has been rolled yet in this dice tray
    expect((screen.getByRole("button", { name: "Reroll Misses" }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole("button", { name: "Roll Edge" }) as HTMLButtonElement).disabled).toBe(false)
  })

  it("clicking Roll Edge spends a point of edge, updating the store and the UI", async () => {
    // Arrange
    const { store } = renderWithEdge(4, 2)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Roll Edge" }))

    // Assert: state updated (setCurrentEdge is an async thunk)...
    await waitFor(() => expect(store.state.edge.current).toBe(1))
    // ...and the UI re-rendered off that same state.
    expect(screen.getByText("Edge (1/4)")).toBeDefined()
  })

  it("does not let Roll Edge be clicked twice for the same dice tray roll", async () => {
    // Arrange
    const { store, diceTrayApi } = renderWithEdge(4, 2)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Roll Edge" }))
    await waitFor(() => expect(store.state.edge.current).toBe(1))

    // Assert: rollEdge() marked the dice tray as edgeSpent, so a second click is a no-op
    expect(diceTrayApi.store.state.edgeSpent).toBe(true)
  })
})
