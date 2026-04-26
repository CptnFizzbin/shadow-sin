import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line, RiEdit2Line } from "@remixicon/react"
import type { FC } from "react"

import { SpiritConditionMonitor } from "#/components/character/spirits/spiritConditionMonitor.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { AttributeKey, AttributeLabels } from "#/system/attributeKey.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { calculateSpiritAttributes, calculateSpiritInitiative, SpiritTypeLabels } from "#/system/magic/spiritData.ts"

const SPIRIT_ATTR_ORDER: AttributeKey[] = [
  AttributeKey.body,
  AttributeKey.agility,
  AttributeKey.reaction,
  AttributeKey.strength,
  AttributeKey.charisma,
  AttributeKey.intuition,
  AttributeKey.logic,
  AttributeKey.willpower,
  AttributeKey.edge,
  AttributeKey.magic,
]

interface SpiritItemCardProps {
  spirit: SpiritData
  onEdit: () => void
  onRemove: () => void
  onDamageChange: (damage: SpiritData["damage"]) => void
}

export const SpiritItemCard: FC<SpiritItemCardProps> = ({ spirit, onEdit, onRemove, onDamageChange }) => {
  const title = spirit.name || SpiritTypeLabels[spirit.spiritType]
  const subtitle = spirit.name ? SpiritTypeLabels[spirit.spiritType] : undefined

  const { physicalScore, physicalIp, astralBase, astralIp } = calculateSpiritInitiative(spirit.force, spirit.spiritType)
  const attrs = calculateSpiritAttributes(spirit.force, spirit.spiritType)

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
      <ItemCard.Meta type="stat">
        <ItemStatChip label={`Init: ${physicalScore} (${physicalIp}IP)`} />
      </ItemCard.Meta>
      <ItemCard.Meta type="stat">
        <ItemStatChip label={`Astral ${astralBase} (${astralIp}IP)`} />
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
          <Divider />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 0.5,
              textAlign: "center",
            }}
          >
            {SPIRIT_ATTR_ORDER.map((key) => (
              <Box key={key}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  {AttributeLabels[key]}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {attrs[key]}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider />
          <SpiritConditionMonitor spirit={spirit} onChange={onDamageChange} />
        </Stack>
      </ItemCard.Children>
    </ItemCard>
  )
}
