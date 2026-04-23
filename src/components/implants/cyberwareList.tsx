import type { UUID } from "node:crypto"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useGearByType, useGearStore } from "#/components/gear/useGearStore.ts"
import { CyberwareListItem } from "#/components/implants/cyberwareListItem.tsx"
import { ImplantFormDialog } from "#/components/implants/dialogs/implantFormDialog.tsx"
import type { ImplantData } from "#/system/gear/implantData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

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
              sx={{
                gap: 0,
                padding: 0,
                borderLeft: "4px solid",
                borderBottom: "1px solid",
                borderColor: "secondary.dark",
                paddingLeft: 1,
              }}
            >
              {accessories.map((accessory) => (
                <CyberwareListItem
                  key={accessory.id}
                  implant={accessory}
                  onEdit={() =>
                    setImplantDialog({ mode: "edit", implant: accessory, open: true })}
                  onRemove={() => handleRemoveImplant(accessory)}
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
