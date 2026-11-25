import type { FC } from "react"

import { ItemDialog } from "#app/components/entities/items/dialogs/itemDialog.tsx"
import { ProgramFormFields } from "#app/components/entities/items/types/devices/forms/programFormFields.tsx"
import { GearFormLicenseSection } from "#app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import type { UUID } from "#common/uuid/uuidUtils.ts"
import { isAgentData } from "#data/items/agentData.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { ProgramData } from "#data/items/programData.ts"
import type { AnyDialogCtrl } from "#forms/dialog/dialogCtrl.ts"
import { useDialog } from "#forms/dialog/useDialog.tsx"
import { programFieldMap, useProgramForm } from "#forms/items/types/devices/useProgramForm.tsx"

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
      parentItemFilter={(item) => item.itemType === ItemType.device || isAgentData(item)}
      parentItemLabel="Device / Agent"
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
