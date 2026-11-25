import { describe, expect, it } from "vitest"

import type { AidSource } from "#/system/model/dicePool/aidSource.ts"

import { AidDiceFormulas } from "./aidDiceFormulas.ts"

describe.concurrent("AidDiceFormulas.getAidDice", () => {
  it("offers one die per Teamwork hit and the Force of an aiding spirit", () => {
    // Arrange
    const sources: AidSource[] = [
      { kind: "teamwork", name: "Twitch", hits: 2 },
      { kind: "spirit", name: "Fire Spirit", force: 4 },
    ]

    // Act
    const aid = AidDiceFormulas.getAidDice({ sources, teamworkLimit: 5 })

    // Assert
    expect(aid).toEqual({
      contributions: [
        { source: sources[0], dice: 2 },
        { source: sources[1], dice: 4 },
      ],
      teamworkExcess: 0,
    })
  })

  it("reports the Teamwork dice beyond the limit as excess", () => {
    // Arrange
    const sources: AidSource[] = [
      { kind: "teamwork", name: "Twitch", hits: 3 },
      { kind: "teamwork", name: "Hammer", hits: 2 },
    ]

    // Act
    const aid = AidDiceFormulas.getAidDice({ sources, teamworkLimit: 4 })

    // Assert
    expect(aid.teamworkExcess).toBe(1)
  })

  it("never counts spirit aid against the Teamwork limit", () => {
    // Arrange
    const sources: AidSource[] = [{ kind: "spirit", name: "Fire Spirit", force: 6 }]

    // Act
    const aid = AidDiceFormulas.getAidDice({ sources, teamworkLimit: 1 })

    // Assert
    expect(aid.teamworkExcess).toBe(0)
  })

  it("treats a negative hit count as no dice", () => {
    // Arrange
    const sources: AidSource[] = [{ kind: "teamwork", name: "Twitch", hits: -1 }]

    // Act
    const aid = AidDiceFormulas.getAidDice({ sources, teamworkLimit: 3 })

    // Assert
    expect(aid.contributions[0]?.dice).toBe(0)
  })
})
