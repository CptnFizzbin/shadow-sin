import { render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerFactoryAfterBuildFn } from "#/system/runnerData.factory.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { RunnerHeaderSummary } from "./runnerHeaderSummary.tsx"

function renderWithRunner(afterBuild: RunnerFactoryAfterBuildFn) {
  const runnerData = runnerDataFactory({ afterBuild })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<RunnerHeaderSummary />, { wrapper: Wrapper })

  return store
}

describe("RunnerHeaderSummary", () => {
  it("shows the Runner's alias when one is set", () => {
    // Arrange / Act
    renderWithRunner((data) => {
      data.profile.name = "Legal Name"
      data.profile.alias = "Artemis"
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
    })

    // Assert
    expect(screen.getByText("Legal Name")).toBeDefined()
  })

  it("lists non-zero attribute values inline, hiding attributes at zero", () => {
    // Arrange / Act
    renderWithRunner((data) => {
      data.attributes[AttributeKey.body] = 4
      data.attributes[AttributeKey.magic] = 0
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
    })

    // Assert: max = 8 + ceil(attribute / 2), per selectPhysicalTrack/selectStunTrack.
    expect(screen.getByText("Physical 3/9")).toBeDefined()
    expect(screen.getByText("Stun 1/9")).toBeDefined()
  })

  it("shows street cred as reputation and current karma", () => {
    // Arrange / Act
    renderWithRunner((data) => {
      data.karma.total = 70 // Computes to streetCred = 7 (70 / 10)
      data.karma.current = 12
    })

    // Assert: Rep | streetCred - notoriety - awareness.rating = 7 - 0 - 2
    expect(screen.getByText("Rep | 7 - 0 - 2")).toBeDefined()
    expect(screen.getByText("12")).toBeDefined()
  })
})
