import type { Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"

import { rollDice, rollDiceExploding } from "#/system/dice/diceRoll.ts"

const ROLLING_DURATION_MS = 600

export interface DiceTrayState {
  open: boolean
  diceCount: number
  /** When true, the dialog will roll automatically on open. */
  autoRoll: boolean
  results: number[] | null
  isRolling: boolean
}

/**
 * Stable API object for the dice tray dialog. Holds all UI state in a TanStack
 * Store so that any subscriber (the dialog, external consumers) can react to
 * changes without prop-drilling.
 *
 * Obtain an instance via {@link useDiceTray} rather than constructing this directly.
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
  readonly store: Store<DiceTrayState>
  private rollingTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    this.store = createStore<DiceTrayState>({
      open: false,
      diceCount: 1,
      autoRoll: false,
      results: null,
      isRolling: false,
    })
  }

  /**
   * Open the tray pre-loaded with `count` dice. The user can adjust the count
   * and roll manually. Previous results are cleared.
   */
  setDice(count: number): void {
    this.store.setState(() => ({
      open: true,
      diceCount: Math.max(1, count),
      autoRoll: false,
      results: null,
      isRolling: false,
    }))
  }

  /**
   * Open the tray and immediately roll `count` dice. The dialog animates the
   * roll and shows results automatically.
   */
  roll(count: number): void {
    this.store.setState(() => ({
      open: true,
      diceCount: Math.max(1, count),
      autoRoll: true,
      results: null,
      isRolling: false,
    }))
  }

  /** Close the dialog. Cancels any in-progress rolling animation. */
  close(): void {
    if (this.rollingTimer !== null) {
      clearTimeout(this.rollingTimer)
      this.rollingTimer = null
    }
    this.store.setState((prev) => ({ ...prev, open: false, isRolling: false }))
  }

  /** Adjust the dice count shown in the tray. */
  setDiceCount(count: number): void {
    this.store.setState((prev) => ({ ...prev, diceCount: Math.max(1, count) }))
  }

  /**
   * Roll the current dice count using standard d6 (no exploding).
   * Starts the rolling animation and stores results when it completes.
   */
  rollStandard(): void {
    this.startRoll(rollDice(this.store.state.diceCount))
  }

  /**
   * Roll the current dice count using Push the Limit (exploding 6s).
   * Starts the rolling animation and stores results when it completes.
   */
  rollEdge(): void {
    this.startRoll(rollDiceExploding(this.store.state.diceCount))
  }

  /**
   * Begin the rolling animation with the provided result values. Cancels any
   * previous animation and schedules the reveal after {@link ROLLING_DURATION_MS}.
   */
  startRoll(values: number[]): void {
    if (this.rollingTimer !== null) {
      clearTimeout(this.rollingTimer)
    }
    this.store.setState((prev) => ({
      ...prev,
      results: values,
      isRolling: true,
      autoRoll: false,
    }))
    this.rollingTimer = setTimeout(() => {
      this.store.setState((prev) => ({ ...prev, isRolling: false }))
      this.rollingTimer = null
    }, ROLLING_DURATION_MS)
  }
}
