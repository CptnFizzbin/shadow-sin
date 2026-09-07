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

  it("never shows AI-only computed rows (Rating/System/Firewall/Response/Signal)", () => {
    // Arrange / Act: AttributeOrder deliberately excludes these — see its own doc comment — so
    // this guards against them leaking back in via a future edit (they were never stored on
    // `attributes`, so a naive `!== 0` filter treats their `undefined` value as "shown").
    renderWithRunner(() => {})

    // Assert
    expect(screen.queryByText(/RTG/)).toBeNull()
    expect(screen.queryByText(/SYS/)).toBeNull()
    expect(screen.queryByText(/FWL/)).toBeNull()
    expect(screen.queryByText(/RSP/)).toBeNull()
    expect(screen.queryByText(/SIG/)).toBeNull()
  })

  it("shows street cred as reputation and current karma", () => {
    // Arrange / Act — streetCred = floor(karma.total / 10) = floor(70 / 10) = 7
    renderWithRunner((data) => {
      data.karma.total = 70
      data.karma.current = 12
    })

    // Assert: Rep | streetCred - notoriety - publicAwareness = 7 - 0 - 2
    // (floor((7 + 0) / 3) = 2)
    expect(screen.getByText("Rep | 7 - 0 - 2")).toBeDefined()
    expect(screen.getByText("12")).toBeDefined()
  })
})
