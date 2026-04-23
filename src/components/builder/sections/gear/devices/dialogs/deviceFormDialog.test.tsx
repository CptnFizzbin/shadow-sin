import { waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { DeviceFormDialog } from "#/components/builder/sections/gear/devices/dialogs/deviceFormDialog.tsx"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import { ItemType } from "#/system/itemType.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

describe("DeviceFormDialog", () => {
  it("submits an item with ItemType.device", async () => {
    const onSave = vi.fn()
    renderInBuilder(<DeviceFormDialog open onSave={onSave} onClose={vi.fn()} />)

    fillNameAndClickSave("Renraku Sensei")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: DeviceData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.device)
    })
  })
})
