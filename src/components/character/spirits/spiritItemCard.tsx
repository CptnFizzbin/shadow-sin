import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line, RiEdit2Line } from "@remixicon/react"
import type { FC } from "react"

import { AttributeValueRow } from "#/components/character/attributes/attributeValueRow.tsx"
import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import { AttributeKey, MentalAttributes, PhysicalAttributes } from "#/system/attributeKey.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { calculateSpiritAttributes, calculateSpiritInitiative, SpiritTypeLabels } from "#/system/magic/spiritData.ts"
import { SpiritRegistry } from "#/system/magic/spiritRegistry.ts"

import { CritterPowerChip } from "#/components/character/spirits/critterPowerChip.tsx"
import { SpiritConditionMonitor } from "./spiritConditionMonitor.tsx"

const SPIRIT_SPECIAL_ATTRS = [AttributeKey.edge, AttributeKey.magic] as const

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
  const registry = SpiritRegistry[spirit.spiritType]

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
      {registry.movement && (
        <ItemCard.Meta type="stat">
          <ItemStatChip label={`Move: ${registry.movement}`} />
        </ItemCard.Meta>
      )}
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
          {registry.skills.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Skills
              </Typography>
              <Stack direction="row" sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
                {registry.skills.map((skill) => (
                  <Chip
                    key={skill.name}
                    label={`${skill.name} [${spirit.force + attrs[skill.attribute]}]`}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          )}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              Powers
            </Typography>
            <Stack direction="row" sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
              {registry.basePowers.map((power) => (
                <CritterPowerChip key={power} name={power} force={spirit.force} attrs={attrs} />
              ))}
            </Stack>
          </Box>
          {spirit.optionalPowers.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Optional Powers
              </Typography>
              <Stack direction="row" sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
                {spirit.optionalPowers.map((power) => (
                  <CritterPowerChip key={power} name={power} force={spirit.force} attrs={attrs} color="secondary" />
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
          <Stack sx={{ gap: 0 }}>
            <AttributeValueRow values={attrs} attrKeys={PhysicalAttributes} />
            <AttributeValueRow values={attrs} attrKeys={MentalAttributes} />
            <AttributeValueRow values={attrs} attrKeys={SPIRIT_SPECIAL_ATTRS} />
          </Stack>
          <Divider />
          <SpiritConditionMonitor spirit={spirit} onChange={onDamageChange} />
        </Stack>
      </ItemCard.Children>
    </ItemCard>
  )
}
