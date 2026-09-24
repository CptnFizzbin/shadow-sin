import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import { ProgramType } from "#/system/model/items/programData.ts"
import { makeAgent } from "#testUtils/fixtures/makeAgent.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { AgentDataCard } from "./agentDataCard.tsx"

const fakeAgent = makeAgent()

describe("AgentDataCard", () => {
  it("renders the agent's rating and matrix attributes", () => {
    // Arrange / Act
    renderWithRunner(<AgentDataCard agent={fakeAgent} />, { [fakeAgent.id]: fakeAgent })

    // Assert
    expect(screen.getByText("Griffin")).toBeDefined()
    expect(screen.getByText("Rating: 3")).toBeDefined()
    expect(screen.getByText("System: 4")).toBeDefined()
    expect(screen.getByText("Firewall: 2")).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderWithRunner(<AgentDataCard agent={fakeAgent} onOpen={onOpen} />, { [fakeAgent.id]: fakeAgent })

    // Act
    fireEvent.click(screen.getByText("Griffin"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("shows a Program currently attached to (running on) the agent", () => {
    // Arrange
    const runningProgram: ProgramData = {
      kind: EntityKind.item,
      items: { parentId: fakeAgent.id, childIds: [] },
      id: crypto.randomUUID(),
      name: "Analyze",
      itemType: ItemType.program,
      rating: 4,
      programType: ProgramType.other,
    }
    const agentWithChild: AgentData = { ...fakeAgent, items: { ...fakeAgent.items, childIds: [runningProgram.id] } }

    // Act
    renderWithRunner(<AgentDataCard agent={agentWithChild} />, {
      [agentWithChild.id]: agentWithChild,
      [runningProgram.id]: runningProgram,
    })

    // Assert
    expect(screen.getByText("Analyze")).toBeDefined()
  })

  it("removing the agent dispatches programs.destroy and updates the store", async () => {
    // Arrange
    const runnerStore = renderWithRunner(<AgentDataCard agent={fakeAgent} />, { [fakeAgent.id]: fakeAgent })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(runnerStore.getState().items[fakeAgent.id]).toBeUndefined())
  })
})
