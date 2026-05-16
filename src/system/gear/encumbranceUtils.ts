import type { ArmorData } from "./armorData.ts"

export function calculateArmorTotals(equipped: ArmorData[]): { ballistic: number, impact: number } {
  return equipped.reduce(
    (totals, a) => ({
      ballistic: totals.ballistic + Math.max(0, a.ballistic - (a.damage?.ballistic ?? 0)),
      impact: totals.impact + Math.max(0, a.impact - (a.damage?.impact ?? 0)),
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
