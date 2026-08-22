import { fireEvent, screen, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it, vi } from "vitest"

import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/system/gear/implantData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { ImplantDataCard } from "./implantDataCard.tsx"

const alphaImplant: ImplantData = {
  kind: EntityKind.item,
  id: crypto.randomUUID(),
  name: "Wired Reflexes 2",
  itemType: ItemType.implant,
  implantType: ImplantType.cyberware,
  grade: ImplantGrade.alpha,
  essenceCost: 2,
  cost: 5000,
  location: ImplantLocation.rightArm,
}

const standardImplant: ImplantData = {
  kind: EntityKind.item,
  id: crypto.randomUUID(),
  name: "Datajack",
  itemType: ItemType.implant,
  implantType: ImplantType.cyberware,
  grade: ImplantGrade.standard,
  essenceCost: 0.1,
  cost: 500,
}

const accessory: ItemData = {
  kind: EntityKind.item,
  id: crypto.randomUUID(),
  name: "Reflex Recorder",
  itemType: ItemType.other,
  parentId: alphaImplant.id,
}

const implantWithAccessory: ImplantData = { ...alphaImplant, childIds: [accessory.id] }

const renderImplantCard = (implant: ImplantData, extraGear: Record<string, ItemData> = {}, onOpen?: () => void) =>
  renderWithRunner(<ImplantDataCard implant={implant} onOpen={onOpen} />, { [implant.id]: implant, ...extraGear })

interface RemovableImplantCardProps {
  implantId: ImplantData["id"]
}

/**
 * Stops rendering `ImplantDataCard` once its implant is gone from the store — the same guard
 * every real caller gets for free by mapping over the store's implant list. An `ImplantDataCard`
 * kept mounted with an `implant.id` no longer in gear would otherwise re-run its own
 * `selectChildrenOf` selector against a missing parent and throw.
 */
const RemovableImplantCard: FC<RemovableImplantCardProps> = ({ implantId }) => {
  const implant = useRunnerStoreSelector(Selectors.gear.selectById(implantId)) as ImplantData | undefined
  return implant ? <ImplantDataCard implant={implant} /> : null
}

const renderRemovableImplantCard = (implant: ImplantData, extraGear: Record<string, ItemData> = {}) =>
  renderWithRunner(<RemovableImplantCard implantId={implant.id} />, { [implant.id]: implant, ...extraGear })

describe("ImplantDataCard", () => {
  it("renders the Alpha grade's effective Essence and Cost alongside the raw values", () => {
    // Arrange / Act
    renderImplantCard(alphaImplant)

    // Assert: raw values struck through, effective (grade-multiplied) values highlighted
    expect(screen.getByText("Ess: 2.00")).toBeDefined()
    expect(screen.getByText("Ess: 1.60")).toBeDefined()
    expect(screen.getByText("5,000¥")).toBeDefined()
    expect(screen.getByText("10,000¥")).toBeDefined()
  })

  it("renders the implant's type as its SubType, location, and grade", () => {
    // Arrange / Act
    renderImplantCard(alphaImplant)

    // Assert
    expect(screen.getByText("Cyber")).toBeDefined()
    expect(screen.getByText(ImplantLocation.rightArm)).toBeDefined()
    expect(screen.getByText("Alpha")).toBeDefined()
  })

  it("renders only a single Essence/Cost value for Standard grade (no multiplier to distinguish)", () => {
    // Arrange / Act
    renderImplantCard(standardImplant)

    // Assert
    expect(screen.getAllByText("Ess: 0.10")).toHaveLength(1)
    expect(screen.getAllByText("500¥")).toHaveLength(1)
    expect(screen.queryByText("Std")).toBeNull()
  })

  it("renders accessories as nested subitems", () => {
    // Arrange / Act
    renderImplantCard(implantWithAccessory, { [accessory.id]: accessory })

    // Assert
    expect(screen.getByText("Reflex Recorder")).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderImplantCard(alphaImplant, {}, onOpen)

    // Act: click the title rather than getByRole("button") — the implant always wires onRemove,
    // so the card's own Actions menu button is also present.
    fireEvent.click(screen.getByText("Wired Reflexes 2"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("removing an implant asks for confirmation, then dispatches removeItem", async () => {
    // Arrange
    const runnerStore = renderRemovableImplantCard(alphaImplant)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))
    fireEvent.click(await screen.findByRole("button", { name: "Remove Implant" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(runnerStore.getState())[alphaImplant.id]).toBeUndefined())
  })
})
