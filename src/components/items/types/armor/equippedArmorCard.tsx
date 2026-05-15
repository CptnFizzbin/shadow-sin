import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ItemCard } from "#/components/items/card/itemCard.tsx"
import { ItemStatChip } from "#/components/items/card/itemStatChip.tsx"
import DamageTrack from "#/components/system/damage/damageTrack.tsx"
import type { ArmorData } from "#/system/gear/armorData.ts"

export interface EquippedArmorCardProps {
  armor: ArmorData
  onDamageChange: (damage: NonNullable<ArmorData["damage"]>) => void
}

export const EquippedArmorCard: FC<EquippedArmorCardProps> = ({ armor, onDamageChange }) => {
  const damage = armor.damage ?? { ballistic: 0, impact: 0 }
  const effectiveBallistic = Math.max(0, armor.ballistic - damage.ballistic)
  const effectiveImpact = Math.max(0, armor.impact - damage.impact)

  const ballisticLabel = damage.ballistic > 0
    ? `B: ${effectiveBallistic}/${armor.ballistic}`
    : `B: ${armor.ballistic}`
  const impactLabel = damage.impact > 0
    ? `I: ${effectiveImpact}/${armor.impact}`
    : `I: ${armor.impact}`

  const hasTracks = armor.ballistic > 0 || armor.impact > 0

  return (
    <ItemCard>
      <ItemCard.Title>{armor.name}</ItemCard.Title>
      <ItemCard.Meta type="stat">
        <ItemStatChip label={ballisticLabel} />
        <ItemStatChip label={impactLabel} />
      </ItemCard.Meta>
      {hasTracks && (
        <ItemCard.Children>
          <Stack sx={{ p: 1, gap: 1 }}>
            <Grid container columns={2} spacing={1}>
              {armor.ballistic > 0 && (
                <Grid size={1}>
                  <DamageTrack
                    label="Ballistic"
                    max={armor.ballistic}
                    current={damage.ballistic}
                    woundInterval={armor.ballistic + 1}
                    onChange={(value) => onDamageChange({ ...damage, ballistic: value })}
                  />
                </Grid>
              )}
              {armor.impact > 0 && (
                <Grid size={1}>
                  <DamageTrack
                    label="Impact"
                    max={armor.impact}
                    current={damage.impact}
                    woundInterval={armor.impact + 1}
                    onChange={(value) => onDamageChange({ ...damage, impact: value })}
                  />
                </Grid>
              )}
            </Grid>
          </Stack>
        </ItemCard.Children>
      )}
    </ItemCard>
  )
}
