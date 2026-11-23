import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AvailableGearFilter } from "#/components/entities/items/viewer/availableGearFilter.tsx"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import { ProgramType } from "#/system/model/items/programData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { MatrixProgramsSection } from "./matrixProgramsSection.tsx"

const exploit: ProgramData = {
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001" as UUID,
  name: "Exploit",
  itemType: ItemType.program,
  rating: 4,
  programType: ProgramType.exploit,
}

const stashedSpoof: ProgramData = {
  ...exploit,
  id: "00000000-0000-0000-0000-000000000002" as UUID,
  name: "Spoof",
  programType: ProgramType.spoof,
  state: ItemState.stashed,
}

describe("MatrixProgramsSection", () => {
  it("Run opens the Run dialog for that Program", async () => {
    // Arrange
    renderWithRunner(<MatrixProgramsSection />, { [exploit.id]: exploit })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Run" }))

    // Assert
    expect(await screen.findByRole("dialog", { name: "Run Exploit" })).toBeDefined()
  })

  it("leaves stashed Programs out inside an available-gear view", () => {
    // Arrange / Act
    renderWithRunner(
      <AvailableGearFilter>
        <MatrixProgramsSection />
      </AvailableGearFilter>,
      { [exploit.id]: exploit, [stashedSpoof.id]: stashedSpoof },
    )

    // Assert
    expect(screen.getByText("Exploit")).toBeDefined()
    expect(screen.queryByText("Spoof")).toBeNull()
  })
})
