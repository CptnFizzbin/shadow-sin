import type { UUID } from "node:crypto"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { ImplantFormDialog } from "#/components/CharacterBuilder/Sections/Gear/Cyberware/Dialogs/implant-form-dialog.tsx"
import { CyberwareListItem } from "#/components/CharacterBuilder/Sections/Gear/Cyberware/cyberware-list-item.tsx"
import { useGearApi, useGearByType } from "#/components/Gear/use-gear-api.ts"
import type { ImplantData } from "#/lib/system/gear/implant-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"
import type { ItemData } from "#/lib/system/item-data.ts"

type ImplantDialogState =
  | null
  | { mode: "create", parentId?: UUID, open: boolean }
  | { mode: "edit", implant: ImplantData, open: boolean }

export const CyberwareList: FC = () => {
  const gearApi = useGearApi()
  const implants = useGearByType<ImplantData>(GearType.implant)
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
    <Stack gap={1}>
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
              gap={1}
              sx={{
                paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: accessories.length > 0 ? 1 : 0,
                borderLeft: "4px solid",
                borderBottom: accessories.length > 0 ? "1px solid" : "none",
                borderColor: "divider",
              }}
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
