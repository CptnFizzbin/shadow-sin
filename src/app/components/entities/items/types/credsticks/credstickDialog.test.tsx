import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { UUID } from "#common/uuid/uuidUtils.ts"
import { EntityKind } from "#data/entities/entityKind.ts"
import type { CredstickData } from "#data/items/credstickData.ts"
import { CredstickMaxBalance, CredstickType } from "#data/items/credstickData.ts"
import { ItemType } from "#data/items/itemType.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { getItemCatalog } from "#data/runner/runnerTraits.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"
import { DialogCtrl } from "#ui/dialog/dialogCtrl.ts"

import { CredstickDialog } from "./credstickDialog.tsx"

const makeCredstick = (balance: number): CredstickData => ({
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001" as UUID,
  name: "Street Cred",
  itemType: ItemType.credstick,
  credstickType: CredstickType.standard,
  balance,
})

const renderEditDialog = (credstick: CredstickData) => {
  const ctrl = new DialogCtrl<CredstickData>()
  ctrl.open()
  const store = renderWithProviders(<CredstickDialog ctrl={ctrl} mode="edit" credstick={credstick} />, {
    runner: runnerDataFactory({
      items: { [credstick.id]: credstick },
      afterBuild: (data) => {
        data.nuyen.current = 100
      },
    }),
  })
  return { ctrl, store }
}

describe("CredstickDialog", () => {
  it("in edit mode, returns the renamed credstick for the caller to save instead of writing it itself", async () => {
    // Arrange
    const credstick = makeCredstick(500)
    const { ctrl, store } = renderEditDialog(credstick)

    // Act
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Rainy Day Fund" } })
    fireEvent.click(screen.getByRole("button", { name: /save/i }))
    const saved = await ctrl.result()

    // Assert
    expect(saved).toEqual({ ...credstick, name: "Rainy Day Fund" })
    expect(getItemCatalog(store.getState().runner)[credstick.id]).toEqual(credstick)
    expect(store.getState().runner.nuyen.current).toBe(100)
  })

  it("in edit mode, leaves the balance untouched even when it exceeds the type's max", async () => {
    // Arrange
    const overfilledBalance = CredstickMaxBalance[CredstickType.standard] + 1_000
    const credstick = makeCredstick(overfilledBalance)
    const { ctrl } = renderEditDialog(credstick)

    // Act
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Overfilled" } })
    fireEvent.click(screen.getByRole("button", { name: /save/i }))
    const saved = await ctrl.result()

    // Assert
    expect(saved?.balance).toBe(overfilledBalance)
  })
})
