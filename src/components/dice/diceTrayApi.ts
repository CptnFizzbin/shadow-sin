import type { Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"

import { selectWasRolled } from "#/system/dice/diceRoller.selectors.ts"
import { DiceRoller } from "#/system/dice/diceRoller.ts"

export interface DiceTrayState {
  open: boolean
  edgeSpent: boolean
  threshold: number
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
  public readonly store: Store<DiceTrayState>
  public readonly roller: DiceRoller

  constructor() {
    this.store = createStore({ open: false, edgeSpent: false, threshold: 1 })
    this.roller = new DiceRoller()
  }

  /**
   * Open the tray pre-loaded with `count` dice. The user can adjust the count
   * and roll manually. Previous results are cleared.
   */
  setDice(count: number): void {
    this.reset()
    this.roller
      .reset()
      .setPoolSize(count)
    this.open()
  }

  setThreshold(count: number): void {
    this.store.setState(produce((state) => {
      state.threshold = count
    }))
  }

  /**
   * Open the tray and immediately roll `count` dice. The dialog animates the
   * roll and shows results automatically.
   */
  roll(count?: number): void {
    if (count) {
      this.roller
        .reset()
        .setPoolSize(count)
    }
    this.open()

    this.roller.rollAll({ timeout: 1500 })
  }

  open(): void {
    this.store.setState(produce((state) => {
      state.open = true
    }))
  }

  /** Close the dialog and cancel any in-progress rolling animation. */
  close(): void {
    this.roller.cancel()
    this.store.setState(produce((state) => {
      state.open = false
    }))
  }

  reset(): void {
    this.roller.reset()
    this.store.setState(produce((state) => {
      state.edgeSpent = false
    }))
  }

  /**
   * Roll the current dice count using standard d6 (no exploding).
   * Starts the rolling animation and stores results when it completes.
   */
  rollStandard(): void {
    this.roller.rollAll()
  }

  /**
   * Roll the current dice count using Push the Limit (exploding 6s).
   * Starts the rolling animation and stores results when it completes.
   */
  rollEdge(edge: number): void {
    const { edgeSpent } = this.store.get()
    if (edgeSpent) return

    this.store.setState(produce((state) => {
      state.edgeSpent = true
    }))

    const wasRolled = selectWasRolled(this.roller.store.get())
    if (wasRolled) {
      this.roller.addDice(edge).rollDice(edge * -1, Infinity, { explodes: true })
    } else {
      this.roller.addDice(edge).rollAll({ explodes: true })
    }
  }

  rerollMisses(): void {
    const { edgeSpent } = this.store.get()
    if (edgeSpent) return

    this.store.setState(produce((state) => {
      state.edgeSpent = true
    }))

    this.roller.rollMisses()
  }
}
