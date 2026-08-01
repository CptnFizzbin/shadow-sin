import type { FC } from "react"

import { BasicItemDetails } from "#/components/items/details/basicItemDetails.tsx"
import { ItemDetailsSlot } from "#/components/items/details/itemDetailsSlot.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { CredstickMaxBalance, CredstickTypeLabel } from "#/system/gear/credstickData.ts"

import { useCredstickDialog } from "./credstickDialog.tsx"

export interface CredstickItemDetailsProps {
  credstick: CredstickData
}

/** No Remove action, matching CredstickDataCard — credsticks don't offer one today. */
export const CredstickItemDetails: FC<CredstickItemDetailsProps> = ({ credstick }) => {
  const maxBalance = CredstickMaxBalance[credstick.credstickType]
  const fillPercent = maxBalance > 0 ? (credstick.balance / maxBalance) * 100 : 0
  const credstickDialog = useCredstickDialog()

  const handleEdit = () => credstickDialog.open({ mode: "edit", credstick })

  return (
    <>
      <BasicItemDetails
        item={credstick.name ? credstick : { ...credstick, name: CredstickTypeLabel[credstick.credstickType] }}
        type={CredstickTypeLabel[credstick.credstickType]}
        onEdit={handleEdit}
      >
        <ItemDetailsSlot.Stat label="Balance" value={formatNuyen(credstick.balance)} type="rating" />
        <ItemDetailsSlot.Stat label="Filled" value={`${fillPercent.toFixed(0)}%`} />
      </BasicItemDetails>

      {credstickDialog.dialog}
    </>
  )
}
