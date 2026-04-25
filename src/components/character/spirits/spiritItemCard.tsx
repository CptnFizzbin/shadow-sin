import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line, RiEdit2Line } from "@remixicon/react"
import type { FC } from "react"

import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { SpiritTypeLabels } from "#/system/magic/spiritData.ts"

interface SpiritItemCardProps {
  spirit: SpiritData
  onEdit: () => void
  onRemove: () => void
}

export const SpiritItemCard: FC<SpiritItemCardProps> = ({ spirit, onEdit, onRemove }) => {
  const title = spirit.name || SpiritTypeLabels[spirit.spiritType]
  const subtitle = spirit.name ? SpiritTypeLabels[spirit.spiritType] : undefined

  return (
    <ItemCard onClick={onEdit}>
      <ItemCard.Title>
        <Stack direction="row" sx={{ alignItems: "baseline", gap: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>{title}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      </ItemCard.Title>

      <ItemCard.Meta type="stat">
        <ItemStatChip label={`Force ${spirit.force}`} />
      </ItemCard.Meta>
      <ItemCard.Meta type="stat">
        <ItemStatChip label={`Services ${spirit.services.used}/${spirit.services.max}`} />
      </ItemCard.Meta>
      {spirit.bound && (
        <ItemCard.Meta type="stat">
          <ItemStatChip label="Bound" color="primary" />
        </ItemCard.Meta>
      )}

      <ItemCard.Action type="icon" onClick={onEdit}>
        <RiEdit2Line size={16} />
      </ItemCard.Action>
      <ItemCard.Action type="icon" color="error" onClick={onRemove}>
        <RiDeleteBin6Line size={16} />
      </ItemCard.Action>

      <ItemCard.Children>
        <Stack sx={{ p: 1, gap: 1 }}>
          {spirit.optionalPowers.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Optional Powers
              </Typography>
              <Stack direction="row" sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
                {spirit.optionalPowers.map((power) => (
                  <Chip key={power} label={power} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}
          {spirit.notes && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Notes
              </Typography>
              <Typography variant="body2">{spirit.notes}</Typography>
            </Box>
          )}
        </Stack>
      </ItemCard.Children>
    </ItemCard>
  )
}
