import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"
import { RiEdit2Line } from "@remixicon/react"
import type { FC } from "react"

import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { CredstickMaxBalance, CredstickTypeLabel } from "#/system/gear/credstickData.ts"

interface CredstickCardProps {
  credstick: CredstickData
  onClick: (credstick: CredstickData) => void
}

export const CredstickCard: FC<CredstickCardProps> = ({ credstick, onClick }) => {
  const maxBalance = CredstickMaxBalance[credstick.credstickType]
  const fillPercent = maxBalance > 0 ? (credstick.balance / maxBalance) * 100 : 0

  return (
    <ItemCard>
      <ItemCard.Title>
        {credstick.name || CredstickTypeLabel[credstick.credstickType]}
      </ItemCard.Title>

      <ItemCard.Meta type="cost">
        <Typography sx={{ fontWeight: "medium", whiteSpace: "nowrap" }}>
          {formatNuyen(credstick.balance)}
        </Typography>
      </ItemCard.Meta>

      <ItemCard.Meta type="stat">
        <Chip
          label={CredstickTypeLabel[credstick.credstickType]}
          size="small"
          variant="outlined"
        />
        <Typography color="text.secondary">
          {fillPercent.toFixed(0)}% full
        </Typography>
      </ItemCard.Meta>

      <ItemCard.Action type="icon" aria-label="Edit" onClick={() => onClick(credstick)}>
        <RiEdit2Line size={16} />
      </ItemCard.Action>
    </ItemCard>
  )
}
