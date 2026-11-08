import type { FC } from "react"

import { CardElementDicePool } from "#/components/ui/cards/entityCard/elements/cardElementDicePool.tsx"
import { CardElementStatusIcon } from "#/components/ui/cards/entityCard/elements/cardElementStatusIcon.tsx"
import { EntityCard } from "#/components/ui/cards/entityCard/entityCard.tsx"
import { MarkdownText } from "#/components/ui/text/markdownText.tsx"
import { hasSpellEffects, isSustainable } from "#/system/formulas/magic/spellSustaining.ts"
import type { SpellData } from "#/system/model/magic/spellData.ts"
import { SpellSustainTarget } from "#/system/model/magic/spellData.ts"
import { Icons } from "#/utils/icons.ts"

import { formatDrainFormula } from "./spellDrainFormula.ts"

interface SpellCardProps {
  spell: SpellData
  onOpen: () => void
  /** When provided on a sustainable Spell, adds a button to start or stop sustaining it. */
  onToggleSustained?: () => void
}

/**
 * `SpellCard`'s own renderable frame — sits directly on `EntityCard`, with no intermediate
 * category tier: Spell has no subtypes the way Item does (Weapon, Armor, ...), so this is both
 * the category tier and the concrete typed card. Renders Type/Range/Duration/Drain/Damage via
 * `EntityCard.Stat`, plus a Sustained status (and, for a Spell with effects, who it's sustained on)
 * while the Spell is sustained.
 */
const SpellCardRoot: FC<SpellCardProps> = ({ spell, onOpen, onToggleSustained }) => {
  const sustainAction = onToggleSustained && isSustainable(spell)
    ? {
        label: spell.sustained ? "Stop Sustaining" : "Sustain",
        icon: spell.sustained ? <Icons.spell.stopSustaining /> : <Icons.spell.startSustaining />,
        onClick: onToggleSustained,
      }
    : undefined

  return (
    <EntityCard entity={spell} onOpen={onOpen} leftAction={sustainAction}>
      {spell.sustained && isSustainable(spell) && (
        <EntityCard.Layout.HeaderRow sx={{ alignItems: "center" }}>
          <CardElementStatusIcon status="sustained" />
          {hasSpellEffects(spell) && (
            <EntityCard.Stat label="Sustained on" value={spell.sustainedOn ?? SpellSustainTarget.Self} />
          )}
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
          <MarkdownText variant="body2" color="text.secondary">{spell.description}</MarkdownText>
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
 * (`DrainResistanceDicePool`), each of which reads its compiled pool from a dice pool selector
 * and hands it to this element.
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
