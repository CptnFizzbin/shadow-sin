import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { renderWithRunner } from "#testUtils/renderWithRunner.tsx"

describe("RunnerHeaderSummary", () => {
  it("shows the Runner's alias when one is set", () => {
    // Arrange / Act
    renderWithRunner((data) => {
      data.profile.name = "Legal Name"
      data.profile.alias = "Artemis"
      return data
    })

    // Assert
    expect(screen.getByText("Artemis")).toBeDefined()
    expect(screen.queryByText("Legal Name")).toBeNull()
  })

  it("falls back to the Runner's name when no alias is set", () => {
    // Arrange / Act
    renderWithRunner((data) => {
      data.profile.name = "Legal Name"
      data.profile.alias = ""
      return data
    })

    // Assert
    expect(screen.getByText("Legal Name")).toBeDefined()
  })

  it("lists non-zero attribute values inline, hiding attributes at zero", () => {
    // Arrange / Act
    renderWithRunner((data) => {
      data.attributes[AttributeKey.body] = 4
      data.attributes[AttributeKey.magic] = 0
      return data
    })

    // Assert
    expect(screen.queryByText(/BOD/)).toBeDefined()
    expect(screen.queryByText(/MAG/)).toBeNull()
  })

  it("shows current/max damage track values", () => {
    // Arrange / Act
    renderWithRunner((data) => {
      data.attributes[AttributeKey.body] = 2
      data.attributes[AttributeKey.willpower] = 2
      data.damage.physical = 3
      data.damage.stun = 1
      return data
    })

    // Assert: max = 8 + ceil(attribute / 2), per selectPhysicalTrack/selectStunTrack.
    expect(screen.getByText("Physical 3/9")).toBeDefined()
    expect(screen.getByText("Stun 1/9")).toBeDefined()
  })

  it("shows street cred as reputation and current karma", () => {
    // Arrange / Act
    renderWithRunner((data) => {
      data.profile.streetCred = 7
      data.karma.current = 12
      return data
    })

    // Assert
    expect(screen.getByText("Rep 7")).toBeDefined()
    expect(screen.getByText("12")).toBeDefined()
  })
})
