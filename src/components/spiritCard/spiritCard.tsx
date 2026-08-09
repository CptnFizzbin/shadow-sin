import type { FC } from "react"

import { CardElementAttributeBlock } from "#/components/entityCard/elements/cardElementAttributeBlock.tsx"
import { CardElementDamageTrack } from "#/components/entityCard/elements/cardElementDamageTrack.tsx"
import { CardElementNotes } from "#/components/entityCard/elements/cardElementNotes.tsx"
import { CardElementPowerList } from "#/components/entityCard/elements/cardElementPowerList.tsx"
import { CardElementSkillList } from "#/components/entityCard/elements/cardElementSkillList.tsx"
import { CardElementSubType } from "#/components/entityCard/elements/cardElementSubType.tsx"
import type { EntityCardProps } from "#/components/entityCard/entityCard.tsx"
import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import { EntityCardElements } from "#/components/entityCard/entityCardElements.tsx"

interface SpiritCardProps extends Omit<EntityCardProps, "entity"> {
  id: string
  name: string
}

/**
 * Category tier from ADR-0010 for Spirit and Sprite — both conjured/compiled beings with a stat
 * block, Force/Level rating, and Services owed, but neither implements `EntityData` (no `source`
 * field, ratings aren't `EntityData.rating`), so this constructs a minimal entity (`id`/`name`
 * only) rather than accepting one. `EntityCard`'s own Rating/Source/Effects are dropped from the
 * re-exposed elements for the same reason — there's nothing on Spirit/Sprite to feed them.
 * `SkillList`/`PowerList`/`AttributeBlock`/`Notes` are this tier's own incremental elements;
 * `DamageTrack` is `CardElementDamageTrack`, shared with `ItemCard`'s Vehicle usage rather than
 * owned by either tier (see the feature doc). `SpriteCard` (below) shares this exact shape.
 */
const SpiritCardRoot: FC<SpiritCardProps> = ({ id, name, children, ...props }) => (
  <EntityCard entity={{ id, name }} {...props}>
    {children}
  </EntityCard>
)

SpiritCardRoot.displayName = "SpiritCard"

export const SpiritCard = Object.assign(
  SpiritCardRoot,
  {
    Title: EntityCardElements.Title,
    Stat: EntityCardElements.Stat,
    Action: EntityCardElements.Action,
    SubType: CardElementSubType,
    DamageTrack: CardElementDamageTrack,
    SkillList: CardElementSkillList,
    PowerList: CardElementPowerList,
    AttributeBlock: CardElementAttributeBlock,
    Notes: CardElementNotes,
  },
  { Layout: EntityCard.Layout },
)

/** Sprite's card shares `SpiritCard`'s exact shape (see the feature doc) — no incremental elements of its own. */
export const SpriteCard = SpiritCard
