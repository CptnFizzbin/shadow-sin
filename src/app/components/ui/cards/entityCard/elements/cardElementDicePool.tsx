import type { FC } from "react"

import type { DicePoolProps } from "#/components/system/dicePool/dicePool.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"

/**
 * Dice pool element for a card body — renders `pool` with a roll button, using the
 * `CardElement` naming/placement convention so a typed card with a linked test (Weapon's attack
 * pool, Spell's casting/drain-resistance pools) can assemble it as `.DicePool`.
 */
export const CardElementDicePool: FC<DicePoolProps> = (props) => <DicePool {...props} />

CardElementDicePool.displayName = "EntityCard.DicePool"
