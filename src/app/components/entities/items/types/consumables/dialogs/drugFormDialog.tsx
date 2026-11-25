import type { FC } from "react"

import { ItemDialog } from "#app/components/entities/items/dialogs/itemDialog.tsx"
import { DrugFormFields } from "#app/components/entities/items/types/consumables/forms/drugFormFields.tsx"
import { GearFormLicenseSection } from "#app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import type { UUID } from "#common/uuid/uuidUtils.ts"
import type { DrugData } from "#data/items/consumableData.ts"
import type { AnyDialogCtrl } from "#forms/dialog/dialogCtrl.ts"
import { useDialog } from "#forms/dialog/useDialog.tsx"
import { drugFieldMap, useDrugForm } from "#forms/items/types/consumables/useDrugForm.tsx"

interface DrugFormDialogProps {
  ctrl: AnyDialogCtrl
  drug?: DrugData
  wizard?: boolean
  parentId?: UUID
}

export const DrugFormDialog: FC<DrugFormDialogProps> = ({ ctrl, drug, wizard, parentId }) => {
  const title = drug ? "Edit Drug" : "Add Drug"

  const form = useDrugForm({
    drug,
    parentId,
    onSubmit: (drugData) => ctrl.close(drugData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      wizard={wizard}
      options={{
        hasEffects: { forced: true },
        // Each Consume uses up one dose, so the dose count is always shown.
        multiple: { forced: true },
        isSubItem: parentId ? { forced: true } : undefined,
      }}
      slots={{
        itemFields: () => (
          <>
            <DrugFormFields form={form} fields={drugFieldMap} />
            <GearFormLicenseSection form={form} />
          </>
        ),
      }}
    />
  )
}

type UseDrugFormDialogProps = Omit<DrugFormDialogProps, "ctrl">

export const useDrugFormDialog = () => useDialog<DrugData, UseDrugFormDialogProps | undefined>(
  (ctrl, props) => <DrugFormDialog ctrl={ctrl} {...props} />,
)
