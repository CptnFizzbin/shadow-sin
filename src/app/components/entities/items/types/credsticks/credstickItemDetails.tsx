import type { FC } from "react"

import { useEditItemDialog } from "#/app/components/entities/items/actions/useEditItemDialog.tsx"
import { ItemDetailsRoot } from "#/app/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/app/components/entities/items/details/itemDetailsSlot.tsx"
import type { CredstickData } from "#/data/items/credstickData.ts"
import { CredstickMaxBalance, CredstickTypeLabel } from "#/data/items/credstickData.ts"
import { formatNuyen } from "#/forms/nuyen/nuyen.tsx"

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
