import { createStore } from "@tanstack/store"
import { produce } from "immer"

import { NumberUtils } from "#/lib/numberUtils.ts"
import type { DiceRollerState } from "#/system/dice/diceRoller.state.ts"
import { selectAllSettled, selectIsRolling } from "./diceRoller.selectors.ts"
import type { DieState } from "./dieState.ts"

type IntervalId = ReturnType<typeof setInterval>

interface RollOptions {
  timeout?: number
  explodes?: boolean
}

export class DiceRoller {
  public readonly store = createStore<DiceRollerState>({ dice: [] })
  private rollingIntervalId: IntervalId | null = null

  static createDie(state: Partial<DieState> = {}): DieState {
    return { value: null, isRolling: false, ...state }
  }

  public createDie(state: Partial<DieState> = {}) {
    return DiceRoller.createDie(state)
  }

  public reset() {
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

    this.store.setState(produce((state) => {
      state.dice = state.dice.slice(0, Math.max(0, state.dice.length - numDice))
    }))

    return this
  }

  public rollD6() {
    return NumberUtils.randomIntInRange(1, 6)
  }

  public rollDie(index: number, options: RollOptions = {}) {
    this.store.setState(produce((state) => {
      state.dice[index].isRolling = true
      state.dice[index].value = null
    }))

    const timeoutRange = 200
    const timeout = Math.max(0, (options.timeout ?? 1_000) - NumberUtils.randomIntInRange(0, timeoutRange))

    setTimeout(() => {
      const value = this.rollD6()

      this.store.setState(produce(({ dice }) => {
        dice[index].isRolling = false
        dice[index].value = value

        if (options.explodes && value === 6) {
          dice.push(this.createDie({ isRolling: true }))
        }
      }))

      if (options.explodes && value === 6) {
        const { dice } = this.store.get()
        this.rollDie(dice.length - 1, { timeout: 500, explodes: true })
      }
    }, timeout)

    if (timeout >= 1) {
      this.startRollingInterval()
    }

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
      .forEach(({ index }) => this.rollDie(index, options))

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
      .forEach(({ index }) => this.rollDie(index, options))

    return this.settled()
  }

  public rerollOnes(options: RollOptions = {}) {
    this.store.get()
      .dice
      .map((die, index) => ({ die, index }))
      .filter(({ die }) => die.value === 1)
      .forEach(({ index }) => this.rollDie(index, options))

    return this.settled()
  }

  public rollMisses() {
    this.store.get()
      .dice
      .map((die, index) => ({ die, index }))
      .filter(({ die }) => die.value === null || die.value <= 4)
      .forEach(({ index }) => this.rollDie(index))

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
