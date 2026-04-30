export function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1
}

export function rollDice(count: number): number[] {
  return Array.from({ length: count }, rollD6)
}

/** Count hits — a die shows 5 or 6 */
export function countHits(results: number[]): number {
  return results.filter((r) => r >= 5).length
}

export function countOnes(results: number[]): number {
  return results.filter((r) => r === 1).length
}

export function sumDice(results: number[]): number {
  return results.reduce((sum, r) => sum + r, 0)
}

/**
 * Glitch: more than half the dice show 1s.
 * Critical glitch: glitch with zero hits.
 */
export function isGlitch(results: number[]): boolean {
  if (results.length === 0) return false
  return countOnes(results) > results.length / 2
}

export function isCriticalGlitch(results: number[]): boolean {
  return isGlitch(results) && countHits(results) === 0
}

/**
 * Edge — Push the Limit (before roll): Rule of Six applies.
 * Every 6 grants one additional die; those dice can also explode.
 */
export function rollDiceExploding(count: number): number[] {
  const results: number[] = []
  let toRoll = count
  while (toRoll > 0) {
    const batch = rollDice(toRoll)
    results.push(...batch)
    toRoll = batch.filter((r) => r === 6).length
  }
  return results
}

/**
 * Edge — Second Chance (after roll): re-roll all non-hits, keep existing hits.
 */
export function rerollMisses(results: number[]): number[] {
  const hits = results.filter((r) => r >= 5)
  const missCount = results.filter((r) => r < 5).length
  return [...hits, ...rollDice(missCount)]
}
