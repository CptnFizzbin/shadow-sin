import type { UUID } from "node:crypto"

import type { FC } from "react"

import { ProgramFormFields } from "#/components/builder/sections/gear/devices/forms/programFormFields.tsx"
import {
  programFieldMap,
  useProgramForm,
} from "#/components/builder/sections/gear/devices/forms/useProgramForm.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"

interface ProgramFormDialogProps {
  open: boolean
  program?: ProgramData
  parentId?: UUID
  onClose: () => void
  onClosed?: () => void
  onSave?: (program: ProgramData) => void
}

export const ProgramFormDialog: FC<ProgramFormDialogProps> = ({
  open,
  program,
  parentId,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = program ? "Edit Program" : "Add Program"

  const form = useProgramForm({
    program,
    parentId,
    onSubmit: (submittedProgram) => onSave?.(submittedProgram),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={() => {
        form.reset()
        onClosed?.()
      }}
      parentItemFilter={(item) => item.itemType === ItemType.device}
      parentItemLabel="Device"
      options={{
        hasRating: { forced: true },
        isSubItem: { forced: true },
      }}
      slots={{
        itemFields: () => <ProgramFormFields form={form} fields={programFieldMap} />,
      }}
    />
  )
}
