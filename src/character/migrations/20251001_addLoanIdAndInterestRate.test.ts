import { describe, expect, it } from "vitest"

import migration from "#/character/migrations/20251001_addLoanIdAndInterestRate.ts"

describe("20251001_addLoanIdAndInterestRate", () => {
  it("initialises an empty nuyen object when missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.nuyen).toEqual({ current: 0, loans: [] })
  })

  it("preserves existing nuyen.current", () => {
    // Arrange
    const character = { nuyen: { current: 5000 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.nuyen?.current).toBe(5000)
    expect(result.nuyen?.loans).toEqual([])
  })

  it("assigns a UUID to a loan that has no id", () => {
    // Arrange
    const character = {
      nuyen: { current: 0, loans: [{ lender: "Aztechnology", amount: 1000 }] },
    }

    // Act
    const result = migration.up(character)

    // Assert
    const loan = result.nuyen?.loans?.[0]
    expect(loan?.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(loan?.lender).toBe("Aztechnology")
    expect(loan?.amount).toBe(1000)
  })

  it("defaults a missing interestRate to 0", () => {
    // Arrange
    const character = {
      nuyen: { current: 0, loans: [{ lender: "Loan Shark", amount: 500 }] },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.nuyen?.loans?.[0].interestRate).toBe(0)
  })

  it("preserves an existing loan id, interestRate and notes", () => {
    // Arrange
    const knownId = "00000000-0000-0000-0000-000000000123"
    const character = {
      nuyen: {
        current: 0,
        loans: [
          {
            id: knownId,
            lender: "Aztechnology",
            amount: 1000,
            interestRate: 12,
            notes: "monthly",
          },
        ],
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.nuyen?.loans?.[0]).toEqual({
      id: knownId,
      lender: "Aztechnology",
      amount: 1000,
      interestRate: 12,
      notes: "monthly",
    })
  })

  it("assigns unique ids to multiple loans missing an id", () => {
    // Arrange
    const character = {
      nuyen: {
        current: 0,
        loans: [
          { lender: "A", amount: 100 },
          { lender: "B", amount: 200 },
        ],
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    const ids = result.nuyen?.loans?.map((loan) => loan.id) ?? []
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })
})
