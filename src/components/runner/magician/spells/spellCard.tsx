import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { CardElementDicePool } from "#/components/entityCard/elements/cardElementDicePool.tsx"
import { CardElementStatusIcon } from "#/components/entityCard/elements/cardElementStatusIcon.tsx"
import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import type { SpellData } from "#/system/magic/spellData.ts"

import { formatDrainFormula } from "./spellDrainFormula.ts"

interface SpellCardProps {
  spell: SpellData
  onOpen: () => void
  onToggleSustained?: () => void
}

/**
 * `SpellCard`'s own renderable frame — sits directly on `EntityCard`, with no intermediate
 * category tier: Spell has no subtypes the way Item does (Weapon, Armor, ...), so this is both
 * the category tier and the concrete typed card. Renders Type/Range/Duration/Drain/Damage via
 * `EntityCard.Stat` and a Sustained status icon.
 */
const SpellCardRoot: FC<SpellCardProps> = ({ spell, onOpen, onToggleSustained }) => {
  const hasSustainableEffects = onToggleSustained && spell.effects && spell.effects.length > 0

  return (
    <EntityCard entity={spell} onOpen={onOpen}>
      {hasSustainableEffects && (
        <EntityCard.Layout.HeaderRow>
          <CardElementStatusIcon
            status={spell.sustained ? "sustained" : "not-sustained"}
            onClick={onToggleSustained}
          />
        </EntityCard.Layout.HeaderRow>
      )}

      <EntityCard.Layout.BodyRow sx={{ flexWrap: "wrap" }}>
        <EntityCard.Stat label="Type" value={spell.type} />
        <EntityCard.Stat label="Range" value={spell.range} />
        <EntityCard.Stat label="Duration" value={spell.duration} />
        {spell.dealsDamage && <EntityCard.Stat label="Damage" value={spell.damage} type="damage" />}
        <EntityCard.Stat label="Drain" value={formatDrainFormula(spell)} />
      </EntityCard.Layout.BodyRow>

      {spell.description && (
        <EntityCard.Layout.BodyRow>
          <Typography variant="body2" color="text.secondary">
            {spell.description}
          </Typography>
        </EntityCard.Layout.BodyRow>
      )}
    </EntityCard>
  )
}

SpellCardRoot.displayName = "SpellCard"

/**
 * Category tier from ADR-0010, assembled directly from `EntityCard`'s elements plus `.DicePool`
 * (`CardElementDicePool`) — shared with `WeaponCard`'s attack pool (see the feature doc) and used
 * here for the casting pool (`SpellcastingDicePool`) and drain-resistance pool
 * (`DrainResistanceDicePool`), each of which still computes its own `groups` via the existing
 * dice-group hooks and just hands them to this element.
 */
export const SpellCard = Object.assign(
  SpellCardRoot,
  {
    Title: EntityCard.Title,
    Rating: EntityCard.Rating,
    Source: EntityCard.Source,
    Effects: EntityCard.Effects,
    Stat: EntityCard.Stat,
    Action: EntityCard.Action,
    StatusIcon: CardElementStatusIcon,
    DicePool: CardElementDicePool,
  },
  { Layout: EntityCard.Layout },
)
