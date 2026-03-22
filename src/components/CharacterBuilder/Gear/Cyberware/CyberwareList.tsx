import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { CyberwareListItem } from "#/components/CharacterBuilder/Gear/Cyberware/CyberwareListItem.tsx"
import { ImplantFormDialog } from "#/components/CharacterBuilder/Gear/Cyberware/Dialogs/ImplantFormDialog.tsx"
import type { ImplantFormState } from "#/components/CharacterBuilder/Gear/Cyberware/Forms/ImplantFormState.ts"
import { useCyberwareFormGroup } from "#/components/CharacterBuilder/Gear/Cyberware/UseCyberwareFormGroup.ts"
import { GearItemFormDialog } from "#/components/CharacterBuilder/Gear/Generic/Dialogs/GearItemFormDialog.tsx"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { GearItemCard } from "#/components/CharacterBuilder/Gear/Generic/GearItemCard.tsx"

type ImplantDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; implant: ImplantFormState; open: boolean }

type ModDialogState =
  | null
  | { mode: "create"; parentId: string; open: boolean }
  | { mode: "edit"; mod: GearItemFormState; open: boolean }

interface CyberwareListProps {
  implants: ImplantFormState[]
  onAdd: (implant: ImplantFormState) => void
  onUpdate: (implant: ImplantFormState) => void
  onRemove: (implantId: string) => void
  label?: string
}

export const CyberwareList: FC<CyberwareListProps> = ({
  implants,
  onAdd,
  onUpdate,
  onRemove,
  label = "Implant",
}) => {
  const [implantDialog, setImplantDialog] = useState<ImplantDialogState>(null)
  const [modDialog, setModDialog] = useState<ModDialogState>(null)

  const {
    addImplantMod,
    updateImplantMod,
    removeImplantMod,
    getModsForImplant,
  } = useCyberwareFormGroup()

  const closeImplantDialog = () =>
    setImplantDialog((prev) => prev && { ...prev, open: false })
  const closeModDialog = () =>
    setModDialog((prev) => prev && { ...prev, open: false })

  const handleAddImplant = (implant: ImplantFormState) => {
    onAdd(implant)
    closeImplantDialog()
  }

  const handleUpdateImplant = (implant: ImplantFormState) => {
    onUpdate(implant)
    closeImplantDialog()
  }

  const handleAddMod = (mod: GearItemFormState) => {
    const parentId =
      modDialog?.mode === "create" ? modDialog.parentId : undefined
    if (parentId) addImplantMod({ ...mod, parentId })
    closeModDialog()
  }

  const handleUpdateMod = (mod: GearItemFormState) => {
    updateImplantMod(mod)
    closeModDialog()
  }

  return (
    <Stack gap={1}>
      {implants.map((implant) => {
        const mods = getModsForImplant(implant.id)

        return (
          <Box key={implant.id}>
            <CyberwareListItem
              implant={implant}
              onEdit={() =>
                setImplantDialog({ mode: "edit", implant, open: true })
              }
              onRemove={() => onRemove(implant.id)}
            />

            <Stack
              gap={1}
              sx={{
                paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: mods.length > 0 ? 1 : 0,
                borderLeft: "4px solid",
                borderBottom: mods.length > 0 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              {mods.map((mod) => (
                <GearItemCard
                  key={mod.id}
                  item={mod}
                  onEdit={() => setModDialog({ mode: "edit", mod, open: true })}
                  onRemove={() => removeImplantMod(mod.id)}
                />
              ))}

              <Button
                variant="text"
                size="small"
                startIcon={<RiAddLine size={12} />}
                onClick={() =>
                  setModDialog({
                    mode: "create",
                    parentId: implant.id,
                    open: true,
                  })
                }
                color="secondary"
                fullWidth
              >
                Add mod
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
        Add {label}
      </Button>

      {implantDialog?.mode === "create" && (
        <ImplantFormDialog
          open={implantDialog.open}
          label={label}
          onSave={handleAddImplant}
          onClose={closeImplantDialog}
          onClosed={() => setImplantDialog(null)}
        />
      )}

      {implantDialog?.mode === "edit" && (
        <ImplantFormDialog
          open={implantDialog.open}
          implant={implantDialog.implant}
          label={label}
          onSave={handleUpdateImplant}
          onClose={closeImplantDialog}
          onClosed={() => setImplantDialog(null)}
        />
      )}

      {modDialog?.mode === "create" && (
        <GearItemFormDialog
          open={modDialog.open}
          label="Mod"
          onSave={handleAddMod}
          onClose={closeModDialog}
          onClosed={() => setModDialog(null)}
        />
      )}

      {modDialog?.mode === "edit" && (
        <GearItemFormDialog
          open={modDialog.open}
          item={modDialog.mod}
          label="Mod"
          onSave={handleUpdateMod}
          onClose={closeModDialog}
          onClosed={() => setModDialog(null)}
        />
      )}
    </Stack>
  )
}
