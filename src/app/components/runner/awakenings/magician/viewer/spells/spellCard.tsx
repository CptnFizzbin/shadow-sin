import type { FC } from "react"

import { CardElementDicePool } from "#/app/components/ui/cards/entityCard/elements/cardElementDicePool.tsx"
import { CardElementStatusIcon } from "#/app/components/ui/cards/entityCard/elements/cardElementStatusIcon.tsx"
import { EntityCard } from "#/app/components/ui/cards/entityCard/entityCard.tsx"
import type { SpellData } from "#/data/magic/spellData.ts"
import { SpellSustainTarget } from "#/data/magic/spellData.ts"
import { formatDrainFormula } from "#/rules/magic/spellDrainFormula.ts"
import { hasSpellEffects, isSustainable } from "#/rules/magic/spellSustaining.ts"
import { Icons } from "#/ui/icons/icons.ts"
import { MarkdownText } from "#/ui/text/markdownText.tsx"

interface SpellCardProps {
  spell: SpellData
  onOpen: () => void
  /** When provided on a sustainable Spell, adds a button to start or stop sustaining it. */
  onToggleSustained?: () => void
  /** The name of the Sustaining Focus holding the Spell, while one does. */
  sustainingFocusName?: string
}

/**
 * `SpellCard`'s own renderable frame — sits directly on `EntityCard`, with no intermediate
 * category tier: Spell has no subtypes the way Item does (Weapon, Armor, ...), so this is both
 * the category tier and the concrete typed card. Renders Type/Range/Duration/Drain/Damage via
 * `EntityCard.Stat`, plus a Sustained status (and, for a Spell with effects, who it's sustained on,
 * and the Sustaining Focus holding it, if any) while the Spell is sustained.
 */
const SpellCardRoot: FC<SpellCardProps> = ({ spell, onOpen, onToggleSustained, sustainingFocusName }) => {
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
          {sustainingFocusName && <EntityCard.Stat label="Held by" value={sustainingFocusName} />}
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
