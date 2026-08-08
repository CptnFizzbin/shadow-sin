import type { FC } from "react"

import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"

export interface CardElementDicePoolProps {
  name: string
  groups: DiceGroupList
}

/**
 * Thin wrapper around `src/components/system/dicePool/dicePool.tsx`, passing its props straight
 * through — no new dice-pool logic or math, just the `CardElement` naming/placement convention so
 * a typed card with a linked test (Weapon's attack pool, Spell's casting/drain-resistance pools)
 * can assemble it as `.DicePool`. Each such card computes its own `groups` via the existing hooks
 * (`useDiceGroup`, `skillDicePools.ts`) and hands them to this element unchanged.
 */
export const CardElementDicePool: FC<CardElementDicePoolProps> = (props) => <DicePool {...props} />

CardElementDicePool.displayName = "EntityCard.DicePool"
