import { waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ProgramFormDialog } from "#/components/items/types/devices/dialogs/programFormDialog.tsx"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

describe("ProgramFormDialog", () => {
  it("submits an item with ItemType.program", async () => {
    const onSave = vi.fn()
    // ProgramFormDialog reads the gear store to populate the device dropdown,
    // so it needs the full CharacterSheetProvider context.
    renderInBuilder(<ProgramFormDialog open onSave={onSave} onClose={vi.fn()} />)

    fillNameAndClickSave("Exploit")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ProgramData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.program)
    })
  })
})
