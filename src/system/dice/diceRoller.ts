import { createStore } from "@tanstack/store"
import { produce } from "immer"

import { NumberUtils } from "#/lib/numberUtils.ts"
import type { DiceRollerState } from "#/system/dice/diceRoller.state.ts"
import { selectAllSettled, selectIsRolling } from "./diceRoller.selectors.ts"
import type { DieState } from "./dieState.ts"

type IntervalId = ReturnType<typeof setInterval>
type TimeoutId = ReturnType<typeof setTimeout>

interface RollOptions {
  timeout?: number
  explodes?: boolean
}

export class DiceRoller {
  public readonly store = createStore<DiceRollerState>({ dice: [] })
  private rollingIntervalId: IntervalId | null = null
  private pendingTimeouts = new Set<TimeoutId>()
  /** Generation token; incremented on cancel/reset/setPoolSize so stale
   * timeouts ignore their results when they finally fire. */
  private rollGeneration = 0

  static createDie(state: Partial<DieState> = {}): DieState {
    return { value: null, isRolling: false, ...state }
  }

  public createDie(state: Partial<DieState> = {}) {
    return DiceRoller.createDie(state)
  }

  /**
   * Cancel any in-flight roll animations / timeouts and stop the shimmer
   * interval. Already-rolled dice keep their values; in-flight dice are left
   * in their last visible state.
   */
  public cancel() {
    this.rollGeneration += 1
    for (const id of this.pendingTimeouts) {
      clearTimeout(id)
    }
    this.pendingTimeouts.clear()
    this.clearRollingInterval()

    this.store.setState(produce((state) => {
      state.dice.forEach((die) => {
        die.isRolling = false
      })
    }))

    return this
  }

  public reset() {
    this.cancel()
    this.store.setState(produce((state) => {
      state.dice = state.dice.map(() => this.createDie())
    }))

    return this
  }

  public setPoolSize(numDice: number) {
    const { dice } = this.store.get()

    const difference = Math.abs(dice.length - numDice)
    if (difference === 0) return this

    if (dice.length > numDice) {
      this.removeDice(difference)
    } else {
      this.addDice(difference)
    }

    return this
  }

  public settled(): Promise<this> {
    return new Promise((resolve) => {
      if (selectAllSettled(this.store.get())) {
        resolve(this)
        return
      }

      const { unsubscribe } = this.store.subscribe((state) => {
        const allSettled = selectAllSettled(state)

        if (allSettled) {
          unsubscribe()
          resolve(this)
        }
      })
    })
  }

  public addDice(numDice: number) {
    if (numDice <= 0) {
      throw new Error("numDice must be greater than 0")
    }

    this.store.setState(produce((state) => {
      const newDice = new Array(numDice).fill(null).map(() => this.createDie())
      state.dice.push(...newDice)
    }))

    return this
  }

  public removeDice(numDice: number) {
    if (numDice <= 0) {
      throw new Error("numDice must be greater than 0")
    }

    // Bump the generation so any in-flight timeouts targeting trimmed
    // indices are ignored when they fire.
    this.rollGeneration += 1
    this.store.setState(produce((state) => {
      state.dice = state.dice.slice(0, Math.max(0, state.dice.length - numDice))
    }))

    return this
  }

  public rollD6() {
    return NumberUtils.randomIntInRange(1, 6)
  }

  /**
   * Schedule a single die roll. Internal primitive used by {@link rollDice} /
   * {@link rollAll}; does not return a `settled()` promise — callers should
   * await `settled()` themselves once they've scheduled the whole batch.
   */
  private scheduleDie(index: number, options: RollOptions = {}) {
    const initialDice = this.store.get().dice
    if (index < 0 || index >= initialDice.length) return

    const generation = this.rollGeneration

    this.store.setState(produce((state) => {
      if (index >= state.dice.length) return
      state.dice[index].isRolling = true
      state.dice[index].value = null
    }))

    const timeoutRange = 200
    const timeout = Math.max(0, (options.timeout ?? 1_000) - NumberUtils.randomIntInRange(0, timeoutRange))

    const timeoutId = setTimeout(() => {
      this.pendingTimeouts.delete(timeoutId)

      // Stale timeout: pool was reset / resized / cancelled.
      if (generation !== this.rollGeneration) return

      const value = this.rollD6()

      this.store.setState(produce(({ dice }) => {
        if (index < 0 || index >= dice.length) return
        dice[index].isRolling = false
        dice[index].value = value

        if (options.explodes && value === 6) {
          dice.push(this.createDie({ isRolling: true }))
        }
      }))

      if (options.explodes && value === 6) {
        const { dice: nextDice } = this.store.get()
        this.scheduleDie(nextDice.length - 1, { timeout: 500, explodes: true })
      }
    }, timeout)

    this.pendingTimeouts.add(timeoutId)

    if (timeout >= 1) {
      this.startRollingInterval()
    }
  }

  /**
   * Roll a single die at `index`. Public wrapper around the internal scheduler
   * that returns a `settled()` promise for callers expecting one.
   */
  public rollDie(index: number, options: RollOptions = {}) {
    this.scheduleDie(index, options)
    return this.settled()
  }

  public rollDice(startIndex: number = 0, endIndex: number = Infinity, options?: RollOptions) {
    const { dice } = this.store.get()

    if (startIndex < 0) {
      startIndex = dice.length - Math.abs(startIndex)
    }

    dice
      .map((die, index) => ({ die, index }))
      .filter(({ index }) => index >= startIndex && index < endIndex)
      .forEach(({ index }) => this.scheduleDie(index, options))

    return this.settled()
  }

  public rollAll(options: RollOptions = {}) {
    this.store.setState(produce((state) => {
      state.dice.forEach((die) => {
        die.isRolling = true
      })
    }))

    this.store.get()
      .dice
      .map((die, index) => ({ die, index }))
      .forEach(({ index }) => this.scheduleDie(index, options))

    return this.settled()
  }

  public rerollOnes(options: RollOptions = {}) {
    this.store.get()
      .dice
      .map((die, index) => ({ die, index }))
      .filter(({ die }) => die.value === 1)
      .forEach(({ index }) => this.scheduleDie(index, options))

    return this.settled()
  }

  public rollMisses() {
    this.store.get()
      .dice
      .map((die, index) => ({ die, index }))
      .filter(({ die }) => die.value === null || die.value <= 4)
      .forEach(({ index }) => this.scheduleDie(index))

    return this.settled()
  }

  private startRollingInterval() {
    if (this.rollingIntervalId !== null) return

    this.rollingIntervalId = setInterval(() => {
      const isRolling = selectIsRolling(this.store.get())
      if (!isRolling) {
        this.clearRollingInterval()
        return
      }

      this.store.setState(produce((state) => {
        state.dice = state.dice.map((die) => {
          if (die.isRolling) die.value = this.rollD6()
          return die
        })
      }))
    }, 100)
  }

  private clearRollingInterval() {
    if (this.rollingIntervalId) {
      clearInterval(this.rollingIntervalId)
    }

    this.rollingIntervalId = null
  }
}
