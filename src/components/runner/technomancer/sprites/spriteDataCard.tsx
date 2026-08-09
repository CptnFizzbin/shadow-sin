import type { FC } from "react"

import { SpriteCard } from "#/components/spiritCard/spiritCard.tsx"
import type { SpriteData } from "#/system/magic/spriteData.ts"

interface SpriteDataCardProps {
  sprite: SpriteData
  onEdit: () => void
  onRemove: () => void
  onDamageChange: (damage: SpriteData["damage"]) => void
}

export const SpriteDataCard: FC<SpriteDataCardProps> = ({ sprite, onEdit, onRemove, onDamageChange }) => {
  // No SpriteRegistry equivalent to SpiritRegistry exists yet — Force is the only stat SpriteData
  // tracks today, so it stands in for the Body/Willpower that size Spirit's own condition
  // monitors (calculateSpiritConditionMonitor), following the same 8 + Ceil(X/2) formula.
  const matrixMax = 8 + Math.ceil(sprite.force / 2)

  return (
    <SpriteCard id={sprite.id} name={sprite.name} onEdit={onEdit} onRemove={onRemove}>
      <SpriteCard.Layout.BodyRow sx={{ flexWrap: "wrap" }}>
        <SpriteCard.Stat label="Force" value={sprite.force} />
        <SpriteCard.Stat label="Services" value={`${sprite.services.used}/${sprite.services.max}`} />
        {sprite.bound && <SpriteCard.Stat value="Registered" type="rating" />}
      </SpriteCard.Layout.BodyRow>

      {sprite.notes && (
        <SpriteCard.Layout.BodyRow>
          <SpriteCard.Notes value={sprite.notes} />
        </SpriteCard.Layout.BodyRow>
      )}

      <SpriteCard.Layout.BodyRow>
        <SpriteCard.DamageTrack
          label="Matrix"
          max={matrixMax}
          current={sprite.damage.matrix}
          onChange={(matrix) => onDamageChange({ matrix })}
        />
      </SpriteCard.Layout.BodyRow>
    </SpriteCard>
  )
}
