import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  selectAllDice,
  selectHits,
  selectIsCriticalGlitch,
  selectIsGlitch,
  selectIsRolling,
} from "./diceRoller.selectors.ts"
import { DiceRoller } from "./diceRoller.ts"

describe("DiceRoller", () => {
  describe("constructor", () => {
    it("initialises with an empty dice array", () => {
      // Arrange / Act
      const diceRoller = new DiceRoller()

      // Assert
      expect(diceRoller.store.getState().dice).toEqual([])
    })
  })

  describe("createDie", () => {
    it("returns a die with null value and isRolling false (static)", () => {
      // Arrange / Act
      const die = DiceRoller.createDie()

      // Assert
      expect(die).toEqual({ value: null, isRolling: false })
    })

    it("returns a die with null value and isRolling false (instance method)", () => {
      // Arrange
      const diceRoller = new DiceRoller()

      // Act
      const die = diceRoller.createDie()

      // Assert
      expect(die).toEqual({ value: null, isRolling: false })
    })
  })

  describe("addDice", () => {
    it("adds the requested number of fresh dice", () => {
      // Arrange
      const diceRoller = new DiceRoller()

      // Act
      diceRoller.addDice(3)

      // Assert
      expect(diceRoller.store.getState().dice).toHaveLength(3)
      expect(diceRoller.store.getState().dice.every((die) => die.value === null && !die.isRolling)).toBe(true)
    })

    it("appends to existing dice rather than replacing them", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(2)

      // Act
      diceRoller.addDice(1)

      // Assert
      expect(diceRoller.store.getState().dice).toHaveLength(3)
    })

    it("throws when count is zero", () => {
      // Arrange
      const diceRoller = new DiceRoller()

      // Act / Assert
      expect(() => diceRoller.addDice(0)).toThrow("numDice must be greater than 0")
    })

    it("throws when count is negative", () => {
      // Arrange
      const diceRoller = new DiceRoller()

      // Act / Assert
      expect(() => diceRoller.addDice(-1)).toThrow("numDice must be greater than 0")
    })
  })

  describe("removeDice", () => {
    it("removes dice from the end of the pool", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(5)
      // Seed values so we can verify which dice were removed
      diceRoller.store.setState(() => ({
        dice: [
          { value: 1, isRolling: false },
          { value: 2, isRolling: false },
          { value: 3, isRolling: false },
          { value: 4, isRolling: false },
          { value: 5, isRolling: false },
        ],
      }))

      // Act
      diceRoller.removeDice(2)

      // Assert — first three dice are kept, last two are dropped
      expect(diceRoller.store.getState().dice).toHaveLength(3)
      expect(diceRoller.store.getState().dice.map((die) => die.value)).toEqual([1, 2, 3])
    })

    it("throws when count is zero", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(3)

      // Act / Assert
      expect(() => diceRoller.removeDice(0)).toThrow("numDice must be greater than 0")
    })

    it("throws when count is negative", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(3)

      // Act / Assert
      expect(() => diceRoller.removeDice(-1)).toThrow("numDice must be greater than 0")
    })
  })

  describe("setPoolSize", () => {
    it("adds dice when the pool is smaller than the target", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(2)

      // Act
      diceRoller.setPoolSize(5)

      // Assert
      expect(diceRoller.store.getState().dice).toHaveLength(5)
    })

    it("removes dice when the pool is larger than the target", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(5)

      // Act
      diceRoller.setPoolSize(2)

      // Assert
      expect(diceRoller.store.getState().dice).toHaveLength(2)
    })

    it("does nothing when the pool is already the right size", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(4)
      const diceSnapshot = diceRoller.store.getState().dice

      // Act
      diceRoller.setPoolSize(4)

      // Assert
      expect(diceRoller.store.getState().dice).toBe(diceSnapshot)
    })

    it("can set the pool size to zero", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(3)

      // Act
      diceRoller.setPoolSize(0)

      // Assert
      expect(diceRoller.store.getState().dice).toHaveLength(0)
    })
  })

  describe("reset", () => {
    it("resets all dice to null/not-rolling state", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(3)
      diceRoller.store.setState((state) => ({
        dice: state.dice.map(() => ({ value: 5, isRolling: false })),
      }))

      // Act
      diceRoller.reset()

      // Assert
      expect(diceRoller.store.getState().dice.every((die) => die.value === null && !die.isRolling)).toBe(true)
    })

    it("preserves the number of dice in the pool", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(4)

      // Act
      diceRoller.reset()

      // Assert
      expect(diceRoller.store.getState().dice).toHaveLength(4)
    })
  })

  describe("rollD6", () => {
    afterEach(() => vi.restoreAllMocks())

    it("returns 1 when Math.random() is 0", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(Math, "random").mockReturnValue(0)

      // Act / Assert
      expect(diceRoller.rollD6()).toBe(1)
    })

    it("returns 6 when Math.random() approaches 1", () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(Math, "random").mockReturnValue(0.9999)

      // Act / Assert
      expect(diceRoller.rollD6()).toBe(6)
    })

    it("always returns an integer between 1 and 6", () => {
      // Arrange
      const diceRoller = new DiceRoller()

      // Arrange / Act / Assert
      for (let rollIndex = 0; rollIndex < 100; rollIndex++) {
        const result = diceRoller.rollD6()
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(6)
        expect(Number.isInteger(result)).toBe(true)
      }
    })
  })

  describe("rollDie", () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it("sets isRolling immediately and resolves with a value after the timeout", async () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(Math, "random").mockReturnValue(0.9999) // always rolls 6
      diceRoller.addDice(1)

      // Act
      const rollPromise = diceRoller.rollDie(0)

      // Assert — isRolling set synchronously before any timers fire
      expect(diceRoller.store.getState().dice[0].isRolling).toBe(true)
      expect(diceRoller.store.getState().dice[0].value).toBeNull()

      vi.runAllTimers()
      await rollPromise

      // Assert — settled after timer fires
      expect(diceRoller.store.getState().dice[0].isRolling).toBe(false)
      expect(diceRoller.store.getState().dice[0].value).toBe(6)
    })

    it("adds an extra die and rolls it when explodes is true and value is 6", async () => {
      // Arrange — first roll returns 6 (explodes), second roll returns 3 (stops chain)
      const diceRoller = new DiceRoller()

      vi.spyOn(diceRoller, "rollD6")
        .mockReturnValueOnce(6) // 6 for first roll
        .mockReturnValueOnce(3)

      diceRoller.addDice(1)

      // Act
      const rollPromise = diceRoller.rollDie(0, { timeout: 0, explodes: true })
      vi.runAllTimers()
      await rollPromise

      // Assert — original die + 1 extra from explosion
      expect(diceRoller.store.getState().dice.length).toBeGreaterThan(1)
    })

    it("does NOT add an extra die when explodes is true but value is not 6", async () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(diceRoller, "rollD6").mockReturnValue(1)
      diceRoller.addDice(1)

      // Act
      const rollPromise = diceRoller.rollDie(0, { explodes: true })
      vi.runAllTimers()
      await rollPromise

      // Assert
      expect(diceRoller.store.getState().dice).toHaveLength(1)
      expect(diceRoller.store.getState().dice[0].value).toBe(1)
    })
  })

  describe("rollAll", () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it("gives every die a non-null value after settling", async () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(diceRoller, "rollD6").mockReturnValue(4)
      diceRoller.addDice(4)

      // Act
      const rollPromise = diceRoller.rollAll()
      vi.runAllTimers()
      await rollPromise

      // Assert
      expect(diceRoller.store.getState().dice.every((die) => die.value !== null)).toBe(true)
      expect(diceRoller.store.getState().dice.every((die) => !die.isRolling)).toBe(true)
    })
  })

  describe("rollDice", () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it("only rolls dice within the specified index range", async () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(diceRoller, "rollD6").mockReturnValue(2)
      diceRoller.addDice(4)

      // Act — only roll indices 1 and 2
      const rollPromise = diceRoller.rollDice(1, 3)
      vi.runAllTimers()
      await rollPromise

      // Assert
      const diceStates = diceRoller.store.getState().dice
      expect(diceStates[0].value).toBeNull() // not rolled
      expect(diceStates[1].value).toBe(2)
      expect(diceStates[2].value).toBe(2)
      expect(diceStates[3].value).toBeNull() // not rolled
    })

    it("rolls all dice when no range arguments are given", async () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(diceRoller, "rollD6").mockReturnValue(4)
      diceRoller.addDice(3)

      // Act
      const rollPromise = diceRoller.rollDice()
      vi.runAllTimers()
      await rollPromise

      // Assert
      expect(diceRoller.store.getState().dice.every((die) => die.value === 4)).toBe(true)
    })

    it("treats a negative startIndex as an offset from the end of the pool", async () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(diceRoller, "rollD6").mockReturnValue(6)
      diceRoller.addDice(4)

      // Act — -2 resolves to startIndex 2, rolling only the last 2 dice (indices 2 and 3)
      const rollPromise = diceRoller.rollDice(-2)
      vi.runAllTimers()
      await rollPromise

      // Assert
      const diceStates = diceRoller.store.getState().dice
      expect(diceStates[0].value).toBeNull() // not rolled
      expect(diceStates[1].value).toBeNull() // not rolled
      expect(diceStates[2].value).toBe(6) // rolled
      expect(diceStates[3].value).toBe(6) // rolled
    })
  })

  describe("rerollOnes", () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it("only re-rolls dice that show a 1, leaving others unchanged", async () => {
      // Arrange — seed values: [6, 1, 5, 1]
      const diceRoller = new DiceRoller()
      diceRoller.addDice(4)
      diceRoller.store.setState(() => ({
        dice: [
          { value: 6, isRolling: false },
          { value: 1, isRolling: false },
          { value: 5, isRolling: false },
          { value: 1, isRolling: false },
        ],
      }))
      vi.spyOn(diceRoller, "rollD6").mockReturnValue(6)

      // Act
      const rollPromise = diceRoller.rerollOnes()
      vi.runAllTimers()
      await rollPromise

      // Assert
      const diceStates = diceRoller.store.getState().dice
      expect(diceStates[0].value).toBe(6) // unchanged
      expect(diceStates[1].value).toBe(6) // re-rolled 1 → 6
      expect(diceStates[2].value).toBe(5) // unchanged
      expect(diceStates[3].value).toBe(6) // re-rolled 1 → 6
    })

    it("does nothing when there are no ones in the pool", async () => {
      // Arrange
      const diceRoller = new DiceRoller()
      diceRoller.addDice(2)
      diceRoller.store.setState(() => ({
        dice: [
          { value: 5, isRolling: false },
          { value: 6, isRolling: false },
        ],
      }))

      // Act — settled() resolves immediately because all dice are already settled
      const settledPromise = diceRoller.rerollOnes()
      vi.runAllTimers()
      await settledPromise

      // Assert — values are unchanged
      const diceStates = diceRoller.store.getState().dice
      expect(diceStates[0].value).toBe(5)
      expect(diceStates[1].value).toBe(6)
    })
  })

  describe("settled", () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => {
      vi.useRealTimers()
    })

    it("resolves with the DiceRoller instance once rolling finishes", async () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(Math, "random").mockReturnValue(0.5)
      diceRoller.addDice(1)

      // Act
      const rollPromise = diceRoller.rollDie(0)
      const settledPromise = diceRoller.settled()

      vi.runAllTimers()
      const settledResult = await settledPromise
      await rollPromise

      // Assert
      expect(settledResult).toBe(diceRoller)
    })

    it("resolves as soon as all dice stop rolling even with multiple dice", async () => {
      // Arrange
      const diceRoller = new DiceRoller()
      vi.spyOn(Math, "random").mockReturnValue(0.5) // always 4
      diceRoller.addDice(3)

      // Act
      const rollPromise = diceRoller.rollAll()
      vi.runAllTimers()
      const result = await rollPromise

      // Assert
      expect(result).toBe(diceRoller)
      expect(diceRoller.store.getState().dice.every((die) => !die.isRolling)).toBe(true)
    })
  })
})

describe("DiceRollerSelectors", () => {
  describe("selectIsRolling", () => {
    it("returns true when at least one die is rolling", () => {
      // Arrange
      const state = { dice: [{ value: null, isRolling: true }, { value: null, isRolling: false }] }

      // Act / Assert
      expect(selectIsRolling(state)).toBe(true)
    })

    it("returns false when no dice are rolling", () => {
      // Arrange
      const state = { dice: [{ value: 4, isRolling: false }, { value: 6, isRolling: false }] }

      // Act / Assert
      expect(selectIsRolling(state)).toBe(false)
    })

    it("returns false for an empty dice array", () => {
      // Arrange
      const state = { dice: [] }

      // Act / Assert
      expect(selectIsRolling(state)).toBe(false)
    })
  })

  describe("selectDice", () => {
    it("returns the full dice array", () => {
      // Arrange
      const diceArray = [{ value: 3, isRolling: false }, { value: 5, isRolling: false }]
      const state = { dice: diceArray }

      // Act / Assert
      expect(selectAllDice(state)).toBe(diceArray)
    })
  })

  describe("selectHits", () => {
    it("counts 5s and 6s as hits", () => {
      // Arrange
      const state = { dice: [{ value: 5, isRolling: false }, { value: 6, isRolling: false }] }

      // Act / Assert
      expect(selectHits(state)).toBe(2)
    })

    it("does not count 1–4 as hits", () => {
      // Arrange
      const state = { dice: [1, 2, 3, 4].map((value) => ({ value, isRolling: false })) }

      // Act / Assert
      expect(selectHits(state)).toBe(0)
    })

    it("ignores dice with a null value (still rolling)", () => {
      // Arrange
      const state = { dice: [{ value: null, isRolling: true }, { value: 5, isRolling: false }] }

      // Act / Assert
      expect(selectHits(state)).toBe(1)
    })

    it("returns 0 for an empty dice array", () => {
      // Arrange
      const state = { dice: [] }

      // Act / Assert
      expect(selectHits(state)).toBe(0)
    })
  })

  describe("selectIsGlitch", () => {
    it("is a glitch when more than half the dice show 1s", () => {
      // Arrange — 3 ones out of 5 dice
      const state = { dice: [1, 1, 1, 3, 5].map((value) => ({ value, isRolling: false })) }

      // Act / Assert
      expect(selectIsGlitch(state)).toBe(true)
    })

    it("is a glitch when exactly half the dice show 1s", () => {
      // Arrange — 2 ones out of 4 dice — exactly half: 2 >= 4/2 = 2 >= 2 = true
      const state = { dice: [1, 1, 3, 5].map((value) => ({ value, isRolling: false })) }

      // Act / Assert
      expect(selectIsGlitch(state)).toBe(true)
    })

    it("is not a glitch when fewer than half show 1s", () => {
      // Arrange
      const state = { dice: [1, 2, 3, 5, 6].map((value) => ({ value, isRolling: false })) }

      // Act / Assert
      expect(selectIsGlitch(state)).toBe(false)
    })

    it("returns false for an empty dice array", () => {
      // Arrange
      const state = { dice: [] }

      // Act / Assert
      expect(selectIsGlitch(state)).toBe(false)
    })

    it("is a glitch with a single die showing 1", () => {
      // Arrange
      const state = { dice: [{ value: 1, isRolling: false }] }

      // Act / Assert
      expect(selectIsGlitch(state)).toBe(true)
    })
  })

  describe("selectIsCriticalGlitch", () => {
    it("is a critical glitch when glitch conditions are met and there are zero hits", () => {
      // Arrange — 3 ones, no hits
      const state = { dice: [1, 1, 1, 3, 4].map((value) => ({ value, isRolling: false })) }

      // Act / Assert
      expect(selectIsCriticalGlitch(state)).toBe(true)
    })

    it("is only a regular glitch when glitch conditions are met but hits exist", () => {
      // Arrange — 3 ones but one hit
      const state = { dice: [1, 1, 1, 5, 4].map((value) => ({ value, isRolling: false })) }

      // Act / Assert
      expect(selectIsCriticalGlitch(state)).toBe(false)
    })

    it("is not a critical glitch when no glitch at all", () => {
      // Arrange
      const state = { dice: [2, 3, 5, 6].map((value) => ({ value, isRolling: false })) }

      // Act / Assert
      expect(selectIsCriticalGlitch(state)).toBe(false)
    })

    it("returns false for an empty dice array", () => {
      // Arrange
      const state = { dice: [] }

      // Act / Assert
      expect(selectIsCriticalGlitch(state)).toBe(false)
    })
  })
})
