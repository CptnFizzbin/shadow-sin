import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { AgentData } from "#/system/matrix/agentData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { AgentList } from "./agentList.tsx"

const watchdogAgent: AgentData = {
  id: NullUuid,
  name: "Watchdog",
  rating: 4,
  notes: "",
}

function renderWithAgents(agents: AgentData[]) {
  const runnerData = runnerDataFactory((data) => {
    data.agents = agents
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<AgentList />, { wrapper: Wrapper })

  return store
}

describe("AgentList", () => {
  it("shows agents from the store", () => {
    // Arrange / Act
    renderWithAgents([watchdogAgent])

    // Assert
    expect(screen.getByText("Watchdog")).toBeDefined()
  })

  it("removing an agent, once confirmed, removes it from the store and the UI", async () => {
    // Arrange
    const store = renderWithAgents([watchdogAgent])

    // Act: the edit and remove icon buttons have no accessible name, but
    // remove is the second icon action rendered on the card.
    const [, removeButton] = screen.getAllByRole("button")
      .filter((button) => button.textContent === "")
    fireEvent.click(removeButton)
    fireEvent.click(await screen.findByRole("button", { name: "Remove" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().agents).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Watchdog")).toBeNull()
  })
})
