import type { ArmorData } from "./armorData.ts"

function effectiveRatings(armor: ArmorData): { ballistic: number, impact: number } {
  return {
    ballistic: Math.max(0, armor.ballistic - (armor.damage?.ballistic ?? 0)),
    impact: Math.max(0, armor.impact - (armor.damage?.impact ?? 0)),
  }
}

// Base armor doesn't stack: only the highest-rated base piece applies, tracked
// separately for ballistic and impact. Modifier armor (e.g. helmets, shields)
// adds on top of that base, and does stack with other modifiers.
export function calculateArmorTotals(equipped: ArmorData[]): { ballistic: number, impact: number } {
  const base = { ballistic: 0, impact: 0 }
  const modifiers = { ballistic: 0, impact: 0 }

  for (const armor of equipped) {
    const { ballistic, impact } = effectiveRatings(armor)
    if (armor.isModifier) {
      modifiers.ballistic += ballistic
      modifiers.impact += impact
    } else {
      base.ballistic = Math.max(base.ballistic, ballistic)
      base.impact = Math.max(base.impact, impact)
    }
  }

  return {
    ballistic: base.ballistic + modifiers.ballistic,
    impact: base.impact + modifiers.impact,
  }
}

// Encumbrance is driven by the bulk of everything worn, not just the armor rating
// that ends up applying — a redundant base layer still weighs the character down
// even though its rating is superseded. Sums every equipped item's printed rating;
// damage doesn't reduce bulk, so it isn't subtracted here.
export function calculateArmorBulk(equipped: ArmorData[]): { ballistic: number, impact: number } {
  return equipped.reduce(
    (totals, a) => ({
      ballistic: totals.ballistic + a.ballistic,
      impact: totals.impact + a.impact,
    }),
    { ballistic: 0, impact: 0 },
  )
}

// SR4A p.160: penalty is –1 to Agility and Reaction per 2 points (or fraction) either
// armor rating exceeds Body × 2. Check ballistic and impact independently; apply the worse.
export function calculateEncumbrancePenalty(totalBallistic: number, totalImpact: number, body: number): number {
  const threshold = body * 2
  const ballisticExcess = Math.max(0, totalBallistic - threshold)
  const impactExcess = Math.max(0, totalImpact - threshold)
  return Math.max(Math.ceil(ballisticExcess / 2), Math.ceil(impactExcess / 2))
}
