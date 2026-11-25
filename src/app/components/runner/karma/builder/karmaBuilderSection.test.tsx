import { render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#app/components/runner/runnerStoreProvider.tsx"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { createRunnerStateStore } from "#state/runnerState.ts"

import { KarmaBuilderSection } from "./karmaBuilderSection.tsx"

describe("KarmaBuilderSection", () => {
  it("renders the Karma section header and the runner's karma from the store", () => {
    // Arrange
    const runnerData = runnerDataFactory({ afterBuild: (data) => {
      data.karma.current = 5
      data.karma.total = 20
    } })
    const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    )

    // Act
    render(<KarmaBuilderSection />, { wrapper: Wrapper })

    // Assert
    expect(screen.getByRole("heading", { name: "Karma" })).toBeDefined()
    expect(screen.getByText("5")).toBeDefined()
    expect(screen.getByText("20")).toBeDefined()
  })
})
