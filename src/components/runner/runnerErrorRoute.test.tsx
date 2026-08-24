import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { RunnerManagerProvider } from "#/contexts/runner/runnerManagerContext.tsx"
import type { RunnerManager } from "#/lib/persistence/runnerManager.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { makeTestRunnerManager } from "#testUtils/storage/makeTestRunnerManager.ts"

import type * as ExportUtils from "./exportImport/exportUtils.ts"
import { downloadTextFile } from "./exportImport/exportUtils.ts"
import { RunnerErrorRoute } from "./runnerErrorRoute.tsx"

vi.mock("./exportImport/exportUtils.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof ExportUtils>()
  return { ...actual, downloadTextFile: vi.fn() }
})

/**
 * `RunnerErrorRoute` reads its target runnerId off `window.location.pathname` rather than
 * route params (it renders as `errorComponent`, outside the normal loader/param flow), so
 * tests drive the URL directly via `history.pushState`.
 */
function renderErrorRoute(manager: RunnerManager) {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    const router = useMemo(
      () => createRouter({ routeTree: createRootRoute(), history: createMemoryHistory() }),
      [],
    )
    return (
      <RouterContextProvider router={router}>
        <RunnerManagerProvider manager={manager}>{children}</RunnerManagerProvider>
      </RouterContextProvider>
    )
  }

  return render(<RunnerErrorRoute />, { wrapper: Wrapper })
}

describe("RunnerErrorRoute", () => {
  afterEach(() => {
    vi.mocked(downloadTextFile).mockClear()
    window.history.pushState({}, "", "/")
  })

  it("downloads the raw saved runner as YAML named `<name>.<isoDate>.error.sin`", async () => {
    // Arrange
    const { manager } = makeTestRunnerManager()
    const runner = runnerDataFactory({
      afterBuild: (data) => {
        data.profile.alias = "Artemis"
      },
    })
    await manager.saveRunner(runner)
    window.history.pushState({}, "", `/${runner.id}`)
    const isoDate = new Date().toISOString().slice(0, 10)
    renderErrorRoute(manager)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Export raw data as YAML" }))

    // Assert
    await waitFor(() =>
      expect(downloadTextFile).toHaveBeenCalledWith(
        expect.stringContaining("alias: Artemis"),
        `artemis.${isoDate}.error.sin`,
      ),
    )
  })

  it("falls back to `runner` in the file name when no saved data has a usable name", async () => {
    // Arrange
    const { manager } = makeTestRunnerManager()
    window.history.pushState({}, "", "/missing-runner-id")
    const isoDate = new Date().toISOString().slice(0, 10)
    renderErrorRoute(manager)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Export raw data as YAML" }))

    // Assert
    await waitFor(() =>
      expect(downloadTextFile).toHaveBeenCalledWith(
        expect.any(String),
        `runner.${isoDate}.error.sin`,
      ),
    )
  })
})
