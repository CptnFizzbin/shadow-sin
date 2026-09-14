import { describe, expect, it } from "vitest"

import { isCredential } from "./credential.ts"

describe.concurrent("isCredential", () => {
  it("is true for a real credential (isReal: true, no rating)", () => {
    // Arrange
    const credential = { isReal: true }

    // Act / Assert
    expect(isCredential(credential)).toBe(true)
  })

  it("is true for a fake credential (isReal: false, with a rating)", () => {
    // Arrange
    const credential = { isReal: false, rating: 4 }

    // Act / Assert
    expect(isCredential(credential)).toBe(true)
  })

  it("is false when isReal is missing", () => {
    // Arrange
    const credential = { rating: 4 }

    // Act / Assert
    expect(isCredential(credential)).toBe(false)
  })

  it("is false when rating is a non-numeric type", () => {
    // Arrange
    const credential = { isReal: false, rating: "4" }

    // Act / Assert
    expect(isCredential(credential)).toBe(false)
  })
})
