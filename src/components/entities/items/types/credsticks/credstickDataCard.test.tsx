import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/runnerDataStore.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { CredstickData } from "#/system/model/items/credstickData.ts"
import { CredstickType } from "#/system/model/items/credstickData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { CredstickDataCard } from "./credstickDataCard.tsx"

const streetStick: CredstickData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: NullUuid,
  name: "Street Cred",
  itemType: ItemType.credstick,
  credstickType: CredstickType.standard,
  balance: 2500,
}

const renderCredstickCard = (credstick: CredstickData) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory({ items: { [credstick.id]: credstick } }),
  )
  renderWithProviders(<CredstickDataCard credstick={credstick} />, { runnerStore })
  return runnerStore
}

describe("CredstickDataCard", () => {
  it("renders the credstick's name, type, balance, and fill percent", () => {
    // Arrange / Act
    renderCredstickCard(streetStick)

    // Assert
    expect(screen.getByText("Street Cred")).toBeDefined()
    expect(screen.getByText("Standard")).toBeDefined()
    expect(screen.getByText("2,500¥")).toBeDefined()
    expect(screen.getByText("50% full")).toBeDefined()
  })

  it("falls back to the credstick type's label when it has no name", () => {
    // Arrange / Act
    renderCredstickCard({ ...streetStick, name: "" })

    // Assert: type's label appears twice — once as the fallback title, once as the SubType.
    expect(screen.getAllByText("Standard")).toHaveLength(2)
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderWithProviders(<CredstickDataCard credstick={streetStick} onOpen={onOpen} />)

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("offers an Edit action that calls onEdit", () => {
    // Arrange
    const onEdit = vi.fn()
    renderWithProviders(<CredstickDataCard credstick={streetStick} onEdit={onEdit} />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

    // Assert
    expect(onEdit).toHaveBeenCalledOnce()
  })
})
