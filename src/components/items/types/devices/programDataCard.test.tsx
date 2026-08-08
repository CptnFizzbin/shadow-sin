import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ProgramType } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ProgramDataCard } from "./programDataCard.tsx"

const fakeProgram: ProgramData = {
  id: crypto.randomUUID(),
  name: "Exploit",
  itemType: ItemType.program,
  rating: 4,
  programType: ProgramType.exploit,
}

const renderProgramCard = (program: ProgramData) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory((runner) => ({ ...runner, gear: { [program.id]: program } })),
  )
  renderWithProviders(<ProgramDataCard program={program} />, { runnerStore })
  return runnerStore
}

describe("ProgramDataCard", () => {
  it("renders the program's own rating and type on itself", () => {
    // Arrange / Act
    renderProgramCard(fakeProgram)

    // Assert
    expect(screen.getByText("Exploit")).toBeDefined()
    expect(screen.getByText("4")).toBeDefined()
    expect(screen.getByText(ProgramType.exploit)).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderWithProviders(<ProgramDataCard program={fakeProgram} onOpen={onOpen} />)

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("offers an Edit action that calls onEdit", () => {
    // Arrange
    const onEdit = vi.fn()
    renderWithProviders(<ProgramDataCard program={fakeProgram} onEdit={onEdit} />)

    // Act
    fireEvent.contextMenu(screen.getByText("Exploit"))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

    // Assert
    expect(onEdit).toHaveBeenCalledOnce()
  })

  it("removing the program dispatches programs.destroy and updates the store", async () => {
    // Arrange
    const runnerStore = renderProgramCard(fakeProgram)

    // Act
    fireEvent.contextMenu(screen.getByText("Exploit"))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(runnerStore.getState().gear[fakeProgram.id]).toBeUndefined())
  })
})
