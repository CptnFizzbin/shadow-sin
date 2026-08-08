import type { FC } from "react"

import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"

export interface CardElementDicePoolProps {
  name: string
  groups: DiceGroupList
}

/**
 * Dice pool element for a card body — renders `groups` under `name` with a roll button, using the
 * `CardElement` naming/placement convention so a typed card with a linked test (Weapon's attack
 * pool, Spell's casting/drain-resistance pools) can assemble it as `.DicePool`.
 */
export const CardElementDicePool: FC<CardElementDicePoolProps> = (props) => <DicePool {...props} />

CardElementDicePool.displayName = "EntityCard.DicePool"
