import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { ProgramFormFields } from "#/components/items/types/devices/forms/programFormFields.tsx"
import { GearFormLicenseSection } from "#/components/items/types/licenses/gearFormLicenseSection.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { programFieldMap, useProgramForm } from "#/hooks/items/types/devices/forms/useProgramForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"

interface ProgramFormDialogProps {
  ctrl: AnyDialogCtrl
  program?: ProgramData
  parentId?: UUID
}

export const ProgramFormDialog: FC<ProgramFormDialogProps> = ({ ctrl, program, parentId }) => {
  const title = program ? "Edit Program" : "Add Program"

  const form = useProgramForm({
    program,
    parentId,
    onSubmit: (submittedProgram) => ctrl.close(submittedProgram),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      onClosed={() => form.reset()}
      parentItemFilter={(item) => item.itemType === ItemType.device}
      parentItemLabel="Device"
      options={{
        hasRating: { forced: true },
        isSubItem: { forced: true },
      }}
      slots={{
        itemFields: () => (
          <>
            <ProgramFormFields form={form} fields={programFieldMap} />
            <GearFormLicenseSection form={form} />
          </>
        ),
      }}
    />
  )
}

type UseProgramFormDialogProps = Omit<ProgramFormDialogProps, "ctrl">

export const useProgramFormDialog = () => useDialog<ProgramData, UseProgramFormDialogProps | undefined>(
  (ctrl, props) => <ProgramFormDialog ctrl={ctrl} {...props} />,
)
