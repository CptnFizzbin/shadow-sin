import type { UUID } from "node:crypto"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { CyberwareListItem } from "#/components/characterBuilder/sections/gear/cyberware/cyberwareListItem.tsx"
import { ImplantFormDialog } from "#/components/gear/cyberware/dialogs/implantFormDialog.tsx"
import { useGearStore, useGearByType } from "#/components/gear/useGearApi.ts"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import type { ItemData } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

type ImplantDialogState =
  | null
  | { mode: "create", parentId?: UUID, open: boolean }
  | { mode: "edit", implant: ImplantData, open: boolean }

export const CyberwareList: FC = () => {
  const gearApi = useGearStore()
  const implants = useGearByType<ImplantData>(ItemType.implant)
  const rootImplants = implants.filter((implant) => !implant.parentId)

  const [implantDialog, setImplantDialog] = useState<ImplantDialogState>(null)

  const closeImplantDialog = () =>
    setImplantDialog((prev) => prev && { ...prev, open: false })

  const handleAddImplant = (implant: ItemData) => {
    gearApi.save(implant)
    closeImplantDialog()
  }

  const handleUpdateImplant = (implant: ItemData) => {
    gearApi.save(implant)
    closeImplantDialog()
  }

  const handleRemoveImplant = (implant: ItemData) => {
    gearApi.remove(implant)
    closeImplantDialog()
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {rootImplants.map((implant) => {
        const accessories = implants.filter((i) => i.parentId === implant.id)

        return (
          <Box key={implant.id}>
            <CyberwareListItem
              implant={implant}
              onEdit={() =>
                setImplantDialog({ mode: "edit", implant, open: true })}
              onRemove={() => handleRemoveImplant(implant)}
            />

            <Stack
              sx={{ gap: 1, paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: accessories.length > 0 ? 1 : 0,
                borderLeft: "4px solid",
                borderBottom: accessories.length > 0 ? "1px solid" : "none",
                borderColor: "divider" }}
            >
              {accessories.map((accessory) => (
                <CyberwareListItem
                  key={accessory.id}
                  implant={accessory}
                  onEdit={() =>
                    setImplantDialog({ mode: "edit", implant, open: true })}
                  onRemove={() => handleRemoveImplant(implant)}
                />
              ))}

              <Button
                variant="text"
                size="small"
                startIcon={<RiAddLine size={12} />}
                onClick={() =>
                  setImplantDialog({
                    mode: "create",
                    parentId: implant.id,
                    open: true,
                  })}
                color="secondary"
                fullWidth
              >
                Add Component
              </Button>
            </Stack>
          </Box>
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setImplantDialog({ mode: "create", open: true })}
        color="secondary"
        fullWidth
      >
        Add Implant
      </Button>

      {implantDialog?.mode === "create" && (
        <ImplantFormDialog
          open={implantDialog.open}
          parentId={implantDialog.parentId}
          onSave={handleAddImplant}
          onClose={closeImplantDialog}
          onClosed={() => setImplantDialog(null)}
        />
      )}

      {implantDialog?.mode === "edit" && (
        <ImplantFormDialog
          open={implantDialog.open}
          implant={implantDialog.implant}
          onSave={handleUpdateImplant}
          onClose={closeImplantDialog}
          onClosed={() => setImplantDialog(null)}
        />
      )}
    </Stack>
  )
}
