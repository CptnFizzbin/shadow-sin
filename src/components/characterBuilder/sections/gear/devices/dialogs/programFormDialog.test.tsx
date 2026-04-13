import { waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ProgramFormDialog } from "#/components/characterBuilder/sections/gear/devices/dialogs/programFormDialog.tsx"
import type { ProgramData } from "#/lib/system/gear/programData.ts"
import { ItemType } from "#/lib/system/itemType.ts"
import { fillNameAndClickSave, renderWithProviders } from "#testUtils/renderUtils.tsx"

describe("ProgramFormDialog", () => {
  it("submits an item with ItemType.program", async () => {
    const onSave = vi.fn()
    // ProgramFormDialog reads the gear store to populate the device dropdown,
    // so it needs the full CharacterSheetProvider context.
    renderWithProviders(<ProgramFormDialog open onSave={onSave} onClose={vi.fn()} />)

    fillNameAndClickSave("Exploit")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ProgramData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.program)
    })
  })
})
