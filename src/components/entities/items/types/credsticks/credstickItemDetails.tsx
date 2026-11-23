import type { FC } from "react"

import { useEditItemDialog } from "#/components/entities/items/actions/useEditItemDialog.tsx"
import { ItemDetailsRoot } from "#/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/entities/items/details/itemDetailsSlot.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { CredstickData } from "#/system/model/items/credstickData.ts"
import { CredstickMaxBalance, CredstickTypeLabel } from "#/system/model/items/credstickData.ts"

export interface CredstickItemDetailsProps {
  credstick: CredstickData
}

/** Item details view for credstick gear items. */
// No Remove action — matching CredstickDataCard, credsticks don't offer one today.
export const CredstickItemDetails: FC<CredstickItemDetailsProps> = ({ credstick }) => {
  const maxBalance = CredstickMaxBalance[credstick.credstickType]
  const fillPercent = maxBalance > 0 ? (credstick.balance / maxBalance) * 100 : 0
  const editItemDialog = useEditItemDialog()

  const handleEdit = () => editItemDialog.open(credstick)

  return (
    <>
      <ItemDetailsRoot
        item={credstick.name ? credstick : { ...credstick, name: CredstickTypeLabel[credstick.credstickType] }}
        type={CredstickTypeLabel[credstick.credstickType]}
        onEdit={handleEdit}
      >
        <ItemDetailsSlot.Stat label="Balance" value={formatNuyen(credstick.balance)} type="rating" />
        <ItemDetailsSlot.Stat label="Filled" value={`${fillPercent.toFixed(0)}%`} />
      </ItemDetailsRoot>

      {editItemDialog.outlet}
    </>
  )
}
