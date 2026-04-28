import type { Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"

export interface DiceTrayState {
  open: boolean
  edgeSpent: boolean
  threshold: number
  diceCount: number
  results: number[] | null
  autoRoll: boolean
  isRolling: boolean
}

const ROLL_ANIMATION_MS = 600

/**
 * Stable API object for the dice tray dialog. Holds all UI state in a TanStack
 * Store so that any subscriber (the dialog, external consumers) can react to
 * changes without prop-drilling.
 *
 * Obtain an instance via {@link useDiceTray} rather than constructing directly.
 *
 * ```ts
 * const diceTray = useDiceTray()
 *
 * // Open the tray so the user can adjust the count before rolling
 * diceTray.setDice(pool.size)
 *
 * // Open the tray and immediately roll
 * diceTray.roll(pool.size)
 * ```
 */
export class DiceTrayApi {
  public readonly store: Store<DiceTrayState>
  private rollTimerId: ReturnType<typeof setTimeout> | null = null

  constructor() {
    this.store = createStore<DiceTrayState>({
      open: false,
      edgeSpent: false,
      threshold: 1,
      diceCount: 1,
      results: null,
      autoRoll: false,
      isRolling: false,
    })
  }

  private clamp(count: number): number {
    return Math.max(1, count)
  }

  private rollD6(): number {
    return Math.floor(Math.random() * 6) + 1
  }

  private rollNDice(count: number): number[] {
    return Array.from({ length: count }, () => this.rollD6())
  }

  private rollNDiceExploding(count: number): number[] {
    const results: number[] = []
    let remaining = count
    while (remaining > 0) {
      remaining--
      const value = this.rollD6()
      results.push(value)
      if (value === 6) remaining++
    }
    return results
  }

  private startAnimation(results: number[]): void {
    this.cancelTimer()
    this.store.setState((prev) => ({
      ...prev,
      results,
      isRolling: true,
      autoRoll: false,
    }))
    this.rollTimerId = setTimeout(() => {
      this.rollTimerId = null
      this.store.setState((prev) => ({ ...prev, isRolling: false }))
    }, ROLL_ANIMATION_MS)
  }

  private cancelTimer(): void {
    if (this.rollTimerId !== null) {
      clearTimeout(this.rollTimerId)
      this.rollTimerId = null
    }
  }

  /**
   * Open the tray pre-loaded with `count` dice. The user can adjust the count
   * and roll manually. Previous results are cleared.
   */
  setDice(count: number): void {
    const clamped = this.clamp(count)
    this.cancelTimer()
    this.store.setState((prev) => ({
      ...prev,
      open: true,
      diceCount: clamped,
      results: null,
      autoRoll: false,
      edgeSpent: false,
      isRolling: false,
    }))
  }

  /**
   * Open the tray and immediately roll `count` dice. The dialog reads
   * `autoRoll` and triggers the animation automatically.
   */
  roll(count: number): void {
    const clamped = this.clamp(count)
    this.cancelTimer()
    this.store.setState((prev) => ({
      ...prev,
      open: true,
      diceCount: clamped,
      results: null,
      autoRoll: true,
      edgeSpent: false,
      isRolling: false,
    }))
  }

  /** Roll the current dice pool using standard d6 (no exploding 6s). */
  rollStandard(): void {
    const { diceCount } = this.store.state
    this.startAnimation(this.rollNDice(diceCount))
  }

  /**
   * Roll with Push the Limit (exploding 6s). Pre-roll only — adds `edge` dice
   * to the pool and rolls everything from scratch with exploding 6s.
   */
  rollEdge(edge: number = 0): void {
    const { edgeSpent, diceCount } = this.store.state
    if (edgeSpent) return

    this.store.setState((prev) => ({ ...prev, edgeSpent: true }))
    this.startAnimation(this.rollNDiceExploding(diceCount + edge))
  }

  /** Re-roll all misses (< 5) in the current results, preserving hits. */
  rollSecondChance(): void {
    const { results } = this.store.state
    if (!results) return
    const newResults = results.map((v) => (v >= 5 ? v : this.rollD6()))
    this.store.setState((prev) => ({ ...prev, results: newResults, edgeSpent: true }))
  }

  /** Update the dice count and clear any existing results. */
  setDiceCount(count: number): void {
    const clamped = this.clamp(count)
    this.store.setState((prev) => ({ ...prev, diceCount: clamped, results: null }))
  }

  setThreshold(count: number): void {
    this.store.setState((prev) => ({ ...prev, threshold: count }))
  }

  open(): void {
    this.store.setState((prev) => ({ ...prev, open: true }))
  }

  close(): void {
    this.cancelTimer()
    this.store.setState((prev) => ({ ...prev, open: false, isRolling: false }))
  }

  reset(): void {
    this.store.setState((prev) => ({ ...prev, results: null, edgeSpent: false }))
  }

  /** Cancel any pending animation timer. Call on component unmount. */
  destroy(): void {
    this.cancelTimer()
  }
}
