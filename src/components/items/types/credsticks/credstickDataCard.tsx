import type { FC } from "react"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { CredstickMaxBalance, CredstickTypeLabel } from "#/system/gear/credstickData.ts"

interface CredstickDataCardProps {
  credstick: CredstickData
  onOpen?: () => void
  onEdit?: () => void
}

export const CredstickDataCard: FC<CredstickDataCardProps> = ({ credstick, onOpen, onEdit }) => {
  const maxBalance = CredstickMaxBalance[credstick.credstickType]
  const fillPercent = maxBalance > 0 ? (credstick.balance / maxBalance) * 100 : 0

  return (
    <ItemDataCardRoot
      item={credstick.name ? credstick : { ...credstick, name: CredstickTypeLabel[credstick.credstickType] }}
      subType={CredstickTypeLabel[credstick.credstickType]}
      onOpen={onOpen}
      onEdit={onEdit}
    >
      <DataCard.Stat value={formatNuyen(credstick.balance)} type="rating" />
      <DataCard.Stat value={`${fillPercent.toFixed(0)}% full`} />
    </ItemDataCardRoot>
  )
}
