import { waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { ProgramType } from "#/system/model/items/programData.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { AgentFormDialog } from "./agentFormDialog.tsx"

describe("AgentFormDialog", () => {
  it("submits an item with ItemType.program and programType agent", async () => {
    // Arrange
    const ctrl = new DialogCtrl<AgentData>()
    ctrl.open()
    // AgentFormDialog reads the gear store to populate the device dropdown,
    // so it needs the full RunnerDataProvider context.
    renderInBuilder(<AgentFormDialog ctrl={ctrl} />)

    // Act
    fillNameAndClickSave("Griffin")

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.program)
      expect(savedItem?.programType).toBe(ProgramType.agent)
    })
  })
})
