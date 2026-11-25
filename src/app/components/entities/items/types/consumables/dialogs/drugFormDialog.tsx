import type { FC } from "react"

import { ItemDialog } from "#/components/entities/items/dialogs/itemDialog.tsx"
import { DrugFormFields } from "#/components/entities/items/types/consumables/forms/drugFormFields.tsx"
import { GearFormLicenseSection } from "#/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import { drugFieldMap, useDrugForm } from "#/hooks/items/types/consumables/forms/useDrugForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { AnyDialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import type { DrugData } from "#/system/model/items/consumableData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

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
