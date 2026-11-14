import type { FC } from "react"
import { describe, expect, it } from "vitest"

import { SlotManager } from "./slotUtils.ts"

const Stat: FC<{ label: string }> = () => null
const Footer: FC = () => null

describe.concurrent("SlotManager", () => {
  it("finds slots wrapped in fragments", () => {
    // Arrange
    const isFirearm = true
    const slots = new SlotManager(
      <>
        <Stat label="DV" />
        {isFirearm && (
          <>
            <Stat label="RC" />
            <Stat label="Ammo" />
          </>
        )}
        <Footer />
      </>,
    )

    // Act
    const stats = slots.filter(Stat)

    // Assert
    expect(stats.map((stat) => stat.props.label)).toEqual(["DV", "RC", "Ammo"])
    expect(slots.find(Footer)).toBeDefined()
  })

  it("keeps keys unique across fragments", () => {
    // Arrange
    const slots = new SlotManager([
      <>
        <Stat label="A" />
      </>,
      <>
        <Stat label="B" />
      </>,
    ])

    // Act
    const keys = slots.filter(Stat).map((stat) => stat.key)

    // Assert
    expect(new Set(keys).size).toBe(2)
  })
})
