import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { ProgramType } from "#/system/model/items/programData.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { MatrixAgentsSection } from "./matrixAgentsSection.tsx"

const griffin: AgentData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "agent-1",
  name: "Griffin",
  itemType: ItemType.program,
  programType: ProgramType.agent,
  rating: 3,
  attributes: { system: 4, firewall: 2 },
  damage: { matrix: 0 },
}

describe("MatrixAgentsSection", () => {
  it("shows agents from the store", () => {
    // Arrange / Act
    renderWithRunner(<MatrixAgentsSection />, { [griffin.id]: griffin })

    // Assert
    expect(screen.getByText("Griffin")).toBeDefined()
  })

  it("shows an empty state when there are no agents", () => {
    // Arrange / Act
    renderWithRunner(<MatrixAgentsSection />)

    // Assert
    expect(screen.getByText("No Agents yet")).toBeDefined()
  })

  it("adding an agent through the dialog dispatches addItem with programType agent", async () => {
    // Arrange
    const runnerStore = renderWithRunner(<MatrixAgentsSection />)

    // Act: the Matrix tab is Viewer-only, so a new item's dialog offers Acquire/Purchase, not Save.
    fireEvent.click(screen.getByRole("button", { name: "Add Agent" }))
    fireEvent.change(await screen.findByLabelText("Name"), { target: { value: "Griffin" } })
    fireEvent.click(screen.getByRole("button", { name: "Acquire" }))

    // Assert
    await waitFor(() => expect(Object.values(runnerStore.getState().items)).toHaveLength(1))
    const [savedAgent] = Object.values(runnerStore.getState().items)
    expect(savedAgent.itemType).toBe(ItemType.program)
    expect((savedAgent as AgentData).programType).toBe(ProgramType.agent)
    expect(screen.getByText("Griffin")).toBeDefined()
  })
})
