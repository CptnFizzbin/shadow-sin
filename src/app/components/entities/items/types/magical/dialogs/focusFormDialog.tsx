import type { FC } from "react"

import { ItemDialog } from "#app/components/entities/items/dialogs/itemDialog.tsx"
import { GearFormLicenseSection } from "#app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import { FocusFormFields } from "#app/components/entities/items/types/magical/forms/focusFormFields.tsx"
import { FocusWeaponField } from "#app/components/entities/items/types/magical/forms/focusWeaponField.tsx"
import type { UUID } from "#common/uuid/uuidUtils.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { FocusData } from "#data/items/magicalData.ts"
import { focusFieldMap, useFocusForm } from "#forms/items/types/magical/useFocusForm.tsx"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"
import type { AnyDialogCtrl } from "#ui/dialog/dialogCtrl.ts"
import { useDialog } from "#ui/dialog/useDialog.tsx"

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
