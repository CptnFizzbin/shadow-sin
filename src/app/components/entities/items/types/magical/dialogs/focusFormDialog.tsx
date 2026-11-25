import type { FC } from "react"

import { ItemDialog } from "#/components/entities/items/dialogs/itemDialog.tsx"
import { GearFormLicenseSection } from "#/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import { FocusFormFields } from "#/components/entities/items/types/magical/forms/focusFormFields.tsx"
import { FocusWeaponField } from "#/components/entities/items/types/magical/forms/focusWeaponField.tsx"
import { focusFieldMap, useFocusForm } from "#/hooks/items/types/magical/forms/useFocusForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { AnyDialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

interface FocusFormDialogProps {
  ctrl: AnyDialogCtrl
  focus?: FocusData
  wizard?: boolean
  parentId?: UUID
}

export const FocusFormDialog: FC<FocusFormDialogProps> = ({ ctrl, focus, wizard, parentId }) => {
  const title = focus ? "Edit Focus" : "Add Focus"
  const weapons = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.weapon })
  const weaponOptions = Object.values(weapons).map((weapon) => ({ label: weapon.name, value: weapon.id }))

  const form = useFocusForm({
    focus,
    parentId,
    onSubmit: (focusData) => ctrl.close(focusData),
  })

  return (
    <ItemDialog
      form={form}
      title={title}
      ctrl={ctrl}
      wizard={wizard}
      options={{
        // A Focus's Game Effects come from its type, Force, and link, never from hand-entered ones.
        hasEffects: { forced: true, enabled: false },
        isSubItem: parentId ? { forced: true } : undefined,
      }}
      slots={{
        itemFields: () => (
          <>
            <FocusFormFields form={form} fields={focusFieldMap} />
            <FocusWeaponField form={form} weaponOptions={weaponOptions} />
            <GearFormLicenseSection form={form} />
          </>
        ),
      }}
    />
  )
}

type UseFocusFormDialogProps = Omit<FocusFormDialogProps, "ctrl">

export const useFocusFormDialog = () => useDialog<FocusData, UseFocusFormDialogProps | undefined>(
  (ctrl, props) => <FocusFormDialog ctrl={ctrl} {...props} />,
)
