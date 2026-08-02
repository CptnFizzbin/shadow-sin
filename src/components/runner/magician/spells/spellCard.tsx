import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import type { SpellData } from "#/system/magic/spellData.ts"

import { formatDrainFormula } from "./spellDrainFormula.ts"

interface SpellCardProps {
  spell: SpellData
  onOpen: () => void
  onToggleSustained?: () => void
}

export const SpellCard: FC<SpellCardProps> = ({ spell, onOpen, onToggleSustained }) => {
  const hasSustainableEffects = onToggleSustained && spell.effects && spell.effects.length > 0

  return (
    <DataCard onOpen={onOpen}>
      <DataCard.Title title={spell.name} />

      <DataCard.Stat label="Type" value={spell.type} />
      <DataCard.Stat label="Range" value={spell.range} />
      <DataCard.Stat label="Duration" value={spell.duration} />
      {spell.dealsDamage && <DataCard.Stat label="Damage" value={spell.damage} type="damage" />}
      <DataCard.Stat label="Drain" value={formatDrainFormula(spell)} />

      {hasSustainableEffects && (
        <DataCard.Footer>
          <Chip
            label="Sustained"
            size="small"
            variant={spell.sustained ? "filled" : "outlined"}
            color={spell.sustained ? "secondary" : "default"}
            onClick={(event) => {
              event.stopPropagation()
              onToggleSustained()
            }}
          />
        </DataCard.Footer>
      )}

      {spell.description && (
        <DataCard.Content>
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            {spell.description}
          </Typography>
        </DataCard.Content>
      )}
    </DataCard>
  )
}
