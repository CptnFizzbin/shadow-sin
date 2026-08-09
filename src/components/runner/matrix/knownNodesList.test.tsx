import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AccessLevel } from "#/system/matrix/accessLevel.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import type { MatrixGameState } from "#/system/matrix/matrixGameState.ts"
import { NodeType } from "#/system/matrix/nodeType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { KnownNodesList } from "./knownNodesList.tsx"

const arcologyNode: KnownNode = {
  id: "node-1",
  name: "Renraku Arcology",
  matrix: { system: 4, firewall: 5, response: 3, signal: 6 },
  nodeType: NodeType.general,
  accessLevel: AccessLevel.public,
}

function renderWithMatrixState(matrixState: MatrixGameState) {
  const runnerData = runnerDataFactory((data) => {
    data.gameState.matrix = matrixState
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<KnownNodesList />, { wrapper: Wrapper })

  return store
}

describe("KnownNodesList", () => {
  it("shows known nodes from the store", () => {
    // Arrange / Act
    renderWithMatrixState({ knownNodes: [arcologyNode], activePrograms: [] })

    // Assert
    expect(screen.getByText("Renraku Arcology")).toBeDefined()
  })

  it("shows an empty state when there are no known nodes", () => {
    // Arrange / Act
    renderWithMatrixState({ knownNodes: [], activePrograms: [] })

    // Assert
    expect(screen.getByText("No Known Nodes yet")).toBeDefined()
  })

  it("adding a node through the dialog dispatches addKnownNode", async () => {
    // Arrange
    const store = renderWithMatrixState({ knownNodes: [], activePrograms: [] })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Add Known Node" }))
    fireEvent.change(await screen.findByLabelText("Name"), { target: { value: "Ares Datavault" } })
    fireEvent.click(screen.getByRole("button", { name: "Save" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().gameState.matrix.knownNodes).toHaveLength(1))
    expect(store.getState().gameState.matrix.knownNodes[0].name).toBe("Ares Datavault")
    expect(store.getState().gameState.matrix.knownNodes[0].accessLevel).toBe(AccessLevel.public)
    // ...and the UI re-rendered off that same state.
    expect(screen.getByText("Ares Datavault")).toBeDefined()
  })

  it("removing a node, once confirmed, removes it from the store and the UI", async () => {
    // Arrange
    const store = renderWithMatrixState({ knownNodes: [arcologyNode], activePrograms: [] })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Remove" }))
    fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Remove" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().gameState.matrix.knownNodes).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Renraku Arcology")).toBeNull()
  })

  it("setting a node active updates the store and shows the Active chip", async () => {
    // Arrange
    const store = renderWithMatrixState({ knownNodes: [arcologyNode], activePrograms: [] })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Set Active" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().gameState.matrix.activeNodeId).toBe("node-1"))
    // ...and the UI re-rendered off that same state.
    expect(screen.getByText("Active")).toBeDefined()
    expect(screen.getByRole("button", { name: "Deactivate" })).toBeDefined()
  })

  it("deactivating the active node clears activeNodeId without removing the node", async () => {
    // Arrange
    const store = renderWithMatrixState({
      knownNodes: [arcologyNode],
      activeNodeId: "node-1",
      activePrograms: [],
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Deactivate" }))

    // Assert
    await waitFor(() => expect(store.getState().gameState.matrix.activeNodeId).toBeUndefined())
    expect(store.getState().gameState.matrix.knownNodes).toHaveLength(1)
    expect(screen.queryByText("Active")).toBeNull()
  })

  it("removing the active node also clears activeNodeId", async () => {
    // Arrange
    const store = renderWithMatrixState({
      knownNodes: [arcologyNode],
      activeNodeId: "node-1",
      activePrograms: [],
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Remove" }))
    fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(store.getState().gameState.matrix.knownNodes).toHaveLength(0))
    expect(store.getState().gameState.matrix.activeNodeId).toBeUndefined()
  })

  it("editing a node through the dialog dispatches updateKnownNode", async () => {
    // Arrange
    const store = renderWithMatrixState({ knownNodes: [arcologyNode], activePrograms: [] })

    // Act
    fireEvent.click(screen.getByText("Renraku Arcology"))
    const nameField = await screen.findByLabelText("Name")
    fireEvent.change(nameField, { target: { value: "Renraku Tsurugi" } })
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Save" }))

    // Assert
    await waitFor(() => expect(store.getState().gameState.matrix.knownNodes[0].name).toBe("Renraku Tsurugi"))
    expect(store.getState().gameState.matrix.knownNodes[0].id).toBe("node-1")
  })
})
