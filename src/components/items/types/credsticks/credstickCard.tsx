import type { FC } from "react"

import { BasicItemCard } from "#/components/items/card-redesign/basicItemCard.tsx"
import { ItemCardSlot } from "#/components/items/card-redesign/itemCardSlot.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { CredstickMaxBalance, CredstickTypeLabel } from "#/system/gear/credstickData.ts"

interface CredstickCardProps {
  credstick: CredstickData
  onOpen?: () => void
  onEdit?: () => void
}

export const CredstickCard: FC<CredstickCardProps> = ({ credstick, onOpen, onEdit }) => {
  const maxBalance = CredstickMaxBalance[credstick.credstickType]
  const fillPercent = maxBalance > 0 ? (credstick.balance / maxBalance) * 100 : 0

  return (
    <BasicItemCard
      item={credstick.name ? credstick : { ...credstick, name: CredstickTypeLabel[credstick.credstickType] }}
      type={CredstickTypeLabel[credstick.credstickType]}
      onOpen={onOpen}
      onEdit={onEdit}
    >
      <ItemCardSlot.Stat value={formatNuyen(credstick.balance)} type="rating" />
      <ItemCardSlot.Stat value={`${fillPercent.toFixed(0)}% full`} />
    </BasicItemCard>
  )
}
