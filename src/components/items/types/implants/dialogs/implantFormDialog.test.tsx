import { waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { ImplantData } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ImplantFormDialog } from "./implantFormDialog.tsx"

describe("ImplantFormDialog", () => {
  it("submits an item with ItemType.implant", async () => {
    const onSave = vi.fn()
    renderInBuilder(<ImplantFormDialog open onSave={onSave} onClose={vi.fn()} />)

    fillNameAndClickSave("Wired Reflexes 1")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ImplantData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.implant)
    })
  })
})
