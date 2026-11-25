import type { AidSource } from "#data/dicePool/aidSource.ts"

/** The dice one `source` adds to a pool. */
interface AidContribution {
  source: AidSource
  dice: number
}

/** What a set of aid sources adds to a pool, before and after the Teamwork limit. */
interface AidDice {
  /** Each source with the dice it offers, in the order given. */
  contributions: AidContribution[]
  /** Teamwork dice offered beyond `teamworkLimit`, which the pool doesn't get. `0` when within it. */
  teamworkExcess: number
}

const offeredDice = (source: AidSource): number =>
  Math.max(0, source.kind === "teamwork" ? source.hits : source.force)

export const AidDiceFormulas = {
  /**
   * The dice `sources` add to a pool. Teamwork dice together never exceed `teamworkLimit` (the
   * leader's rating for the test's skill), and whatever goes past it is reported as
   * `teamworkExcess`. Spirit aid isn't limited.
   */
  getAidDice: ({ sources, teamworkLimit }: { sources: AidSource[], teamworkLimit: number }): AidDice => {
    const contributions = sources.map((source): AidContribution => ({ source, dice: offeredDice(source) }))
    const teamworkTotal = contributions
      .filter(({ source }) => source.kind === "teamwork")
      .reduce((sum, { dice }) => sum + dice, 0)

    return {
      contributions,
      teamworkExcess: Math.max(0, teamworkTotal - Math.max(0, teamworkLimit)),
    }
  },
}
