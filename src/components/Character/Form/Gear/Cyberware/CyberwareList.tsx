import Button from "@mui/material/Button"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { CyberwareListItem } from "#/components/Character/Form/Gear/Cyberware/CyberwareListItem.tsx"
import { ImplantFormDialog } from "#/components/Character/Form/Gear/Cyberware/Dialogs/ImplantFormDialog.tsx"
import type { ImplantFormState } from "#/components/Character/Form/Gear/Cyberware/Forms/ImplantFormState.ts"

type DialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; implant: ImplantFormState; open: boolean }

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
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const onDialogClose = () => {
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const onDialogClosed = () => {
    setDialogState(null)
  }

  const handleAdd = (implant: ImplantFormState) => {
    onAdd(implant)
    onDialogClose()
  }

  const handleUpdate = (implant: ImplantFormState) => {
    onUpdate(implant)
    onDialogClose()
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ mode: "create", open: true })}
        color="secondary"
        fullWidth
      >
        Add {label}
      </Button>

      {implants.map((implant) => (
        <CyberwareListItem
          key={implant.id}
          implant={implant}
          onEdit={() => setDialogState({ mode: "edit", implant, open: true })}
          onRemove={() => onRemove(implant.id)}
        />
      ))}

      {dialogState?.mode === "create" && (
        <ImplantFormDialog
          open={dialogState.open}
          label={label}
          onSave={handleAdd}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}

      {dialogState?.mode === "edit" && (
        <ImplantFormDialog
          open={dialogState.open}
          implant={dialogState.implant}
          label={label}
          onSave={handleUpdate}
          onClose={onDialogClose}
          onClosed={onDialogClosed}
        />
      )}
    </>
  )
}
