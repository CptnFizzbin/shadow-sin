import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ProgramType } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { ProgramDataCard } from "./programDataCard.tsx"

const fakeProgram: ProgramData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID(),
  name: "Exploit",
  itemType: ItemType.program,
  rating: 4,
  programType: ProgramType.exploit,
}

const renderProgramCard = (program: ProgramData, onOpen?: () => void, onEdit?: () => void) =>
  renderWithRunner(<ProgramDataCard program={program} onOpen={onOpen} onEdit={onEdit} />, { [program.id]: program })

describe("ProgramDataCard", () => {
  it("renders the program's own rating and type on itself", () => {
    // Arrange / Act
    renderProgramCard(fakeProgram)

    // Assert
    expect(screen.getByText("Exploit")).toBeDefined()
    expect(screen.getByText("Rating: 4")).toBeDefined()
    expect(screen.getByText(ProgramType.exploit)).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderProgramCard(fakeProgram, onOpen)

    // Act: click the title rather than getByRole("button") — the program always wires onRemove,
    // so the card's own Actions menu button is also present.
    fireEvent.click(screen.getByText("Exploit"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("offers an Edit action that calls onEdit", () => {
    // Arrange
    const onEdit = vi.fn()
    renderProgramCard(fakeProgram, undefined, onEdit)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

    // Assert
    expect(onEdit).toHaveBeenCalledOnce()
  })

  it("removing the program dispatches programs.destroy and updates the store", async () => {
    // Arrange
    const runnerStore = renderProgramCard(fakeProgram)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(runnerStore.getState())[fakeProgram.id]).toBeUndefined())
  })
})
