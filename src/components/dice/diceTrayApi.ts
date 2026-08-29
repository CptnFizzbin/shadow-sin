import { produce } from "immer"

import { markOverlayClosed, markOverlayOpened } from "#/components/ui/dialog/openOverlayTracker.ts"
import type { CompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { selectWasRolled } from "#/system/dice/diceRoller.selectors.ts"
import { DiceRoller } from "#/system/dice/diceRoller.ts"

import { ExtendedInterval, TestType } from "./testType.ts"

export interface ExtendedRollEntry {
  hits: number
  edgeUsed: boolean
}

export interface DiceTrayState {
  open: boolean
  edgeSpent: boolean
  threshold: number
  /**
   * The runner's current dice pool size. Decoupled from the underlying
   * `DiceRoller` — when edge dice are added the roller may hold more dice
   * than this value; the surplus dice are presented as "Edge Dice".
   */
  poolSize: number
  testType: TestType
  /** Number of opposed hits to compare against (Opposed test). */
  opposedHits: number
  /** Time interval per intermediate roll (Extended test). */
  extendedInterval: ExtendedInterval
  /** Remove one die from the pool each subsequent intermediate roll. */
  shrinkingPool: boolean
  /** History of intermediate rolls in an Extended test. */
  extendedHistory: ExtendedRollEntry[]
  /** When true, the dialog tracks hits manually (physical dice). */
  physicalMode: boolean
  /** Manually-entered hit count when in physical mode. */
  physicalHits: number
}

const createInitialState = (): DiceTrayState => ({
  open: false,
  edgeSpent: false,
  threshold: 2,
  poolSize: 5,
  testType: TestType.Standard,
  opposedHits: 1,
  extendedInterval: ExtendedInterval.CombatRound,
  shrinkingPool: false,
  extendedHistory: [],
  physicalMode: false,
  physicalHits: 0,
})

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
 * diceTray.rollStandard()
 * ```
 */
export class DiceTrayApi {
  public readonly store: CompatStore<DiceTrayState>
  public readonly roller: DiceRoller

  constructor() {
    this.store = createCompatStore<DiceTrayState>(createInitialState())
    this.roller = new DiceRoller()
  }

  /**
   * Open the tray pre-loaded with `count` dice. The user can adjust the count
   * and roll manually. Previous results are cleared.
   */
  setDice(count: number): void {
    this.reset()
    this.setPoolSize(count)
    this.open()
  }

  /**
   * Updates the user-facing dice pool size and synchronises the underlying
   * roller so it holds exactly that many dice (no edge surplus).
   */
  setPoolSize(count: number): void {
    const safeCount = Math.max(0, count)
    this.store.setState(produce((state) => {
      state.poolSize = safeCount
    }))
    this.roller.setPoolSize(safeCount)
  }

  // called on the useDiceTray() instance in diceTrayInputs.tsx
  setThreshold(count: number): void {
    this.store.setState(produce((state) => {
      state.threshold = count
    }))
  }

  // called on the useDiceTray() instance in diceTrayInputs.tsx
  setOpposedHits(count: number): void {
    this.store.setState(produce((state) => {
      state.opposedHits = count
    }))
  }

  setTestType(testType: TestType): void {
    // Reset all values except for the dice pool size and the digital/physical
    // mode. Switching test type starts a fresh test from the user's chosen
    // dice count.
    const { poolSize, physicalMode, open } = this.store.getState()
    const fresh = createInitialState()
    this.store.setState(() => ({
      ...fresh,
      open,
      poolSize,
      physicalMode,
      testType,
    }))
    this.roller.reset().setPoolSize(poolSize)
  }

  // called on the useDiceTray() instance in diceTrayInputs.tsx
  setExtendedInterval(interval: ExtendedInterval): void {
    this.store.setState(produce((state) => {
      state.extendedInterval = interval
    }))
  }

  // called on the useDiceTray() instance in diceTrayInputs.tsx
  setShrinkingPool(value: boolean): void {
    this.store.setState(produce((state) => {
      state.shrinkingPool = value
    }))
  }

  // called on the useDiceTray() instance in diceTrayHeader.tsx
  setPhysicalMode(value: boolean): void {
    this.store.setState(produce((state) => {
      state.physicalMode = value
      if (value) {
        // Physical mode hides the dice roller; clear any digital roll state
        // so re-enabling digital mode starts fresh.
        state.edgeSpent = false
      } else {
        state.physicalHits = 0
      }
    }))
    if (value) {
      this.roller.reset()
    }
  }

  // called on the useDiceTray() instance in diceTrayDiceDisplay.tsx / diceTrayActions.tsx
  setPhysicalHits(count: number): void {
    this.store.setState(produce((state) => {
      state.physicalHits = Math.max(0, count)
    }))
  }

  /**
   * Commit the current roll into the extended-test history and prepare the
   * roller for the next intermediate roll. Edge availability resets so it can
   * be applied separately to each roll.
   */
  // called on the useDiceTray() instance in diceTrayActions.tsx
  recordExtendedRoll(currentHits: number): void {
    const { edgeSpent, shrinkingPool, poolSize } = this.store.getState()

    this.store.setState(produce((state) => {
      state.extendedHistory.push({ hits: currentHits, edgeUsed: edgeSpent })
      state.edgeSpent = false
    }))

    // Reset the roller in both branches so stale dice from the previous roll
    // don't linger between intermediate rolls. When shrinking, drop one die
    // from the pool too.
    this.roller.reset()
    if (shrinkingPool && poolSize > 1) {
      this.setPoolSize(poolSize - 1)
    } else {
      this.roller.setPoolSize(this.store.getState().poolSize)
    }
  }

  open(): void {
    if (!this.store.getState().open) {
      markOverlayOpened()
    }
    this.store.setState(produce((state) => {
      state.open = true
    }))
  }

  close(): void {
    if (this.store.getState().open) {
      markOverlayClosed()
    }
    this.store.setState(produce((state) => {
      state.open = false
    }))
  }

  /**
   * Release overlay-tracking state without changing `store.open`. Call from
   * an unmount cleanup so a tray left open when its provider unmounts doesn't
   * permanently count as "open".
   */
  dispose(): void {
    if (this.store.getState().open) {
      markOverlayClosed()
    }
  }

  reset(): void {
    const { poolSize } = this.store.getState()
    this.roller.reset().setPoolSize(poolSize)
    this.store.setState(produce((state) => {
      state.edgeSpent = false
      state.extendedHistory = []
    }))
  }

  /**
   * Roll the current dice count using standard d6 (no exploding).
   * Starts the rolling animation and stores results when it completes.
   */
  // called on the useDiceTray() instance in diceTrayActions.tsx
  rollStandard(): void {
    // Drop any leftover edge dice from a previous roll so the user starts
    // from the configured pool size.
    const { poolSize } = this.store.getState()
    this.roller.setPoolSize(poolSize)
    this.roller.rollAll()
  }

  /**
   * Roll the current dice count using Push the Limit (exploding 6s).
   * Starts the rolling animation and stores results when it completes.
   */
  rollEdge(edge: number): void {
    const { edgeSpent } = this.store.getState()
    if (edgeSpent || edge <= 0) return

    this.store.setState(produce((state) => {
      state.edgeSpent = true
    }))

    const wasRolled = selectWasRolled(this.roller.store.getState())
    if (wasRolled) {
      this.roller.addDice(edge).rollDice(edge * -1, Infinity, { explodes: true })
    } else {
      this.roller.addDice(edge).rollAll({ explodes: true })
    }
  }

  rerollMisses(): void {
    const { edgeSpent } = this.store.getState()
    if (edgeSpent) return

    this.store.setState(produce((state) => {
      state.edgeSpent = true
    }))

    this.roller.rollMisses()
  }
}
