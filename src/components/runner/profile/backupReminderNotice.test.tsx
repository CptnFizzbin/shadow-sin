import { render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { BackupReminderNotice } from "./backupReminderNotice.tsx"

function renderWithLastExportDate(lastExportDate: string | null) {
  const runnerData = runnerDataFactory((data) => {
    data._meta_.lastExportDate = lastExportDate
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<BackupReminderNotice />, { wrapper: Wrapper })
}

describe("BackupReminderNotice", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-08-12T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows a notice when the runner has never been exported", () => {
    // Arrange / Act
    renderWithLastExportDate(null)

    // Assert
    expect(screen.getByText(/haven't exported this runner yet/i)).toBeDefined()
  })

  it("shows a notice when the last export was more than 7 days ago", () => {
    // Arrange / Act
    renderWithLastExportDate("2026-08-01T12:00:00.000Z")

    // Assert
    expect(screen.getByText(/11 days since you last exported/i)).toBeDefined()
  })

  it("does not show a notice when the last export was within 7 days", () => {
    // Arrange / Act
    renderWithLastExportDate("2026-08-10T12:00:00.000Z")

    // Assert
    expect(screen.queryByText(/since you last exported/i)).toBeNull()
    expect(screen.queryByText(/haven't exported this runner yet/i)).toBeNull()
  })

  it("does not show a notice when the last export was exactly 7 days ago", () => {
    // Arrange / Act
    renderWithLastExportDate("2026-08-05T12:00:00.000Z")

    // Assert
    expect(screen.queryByText(/since you last exported/i)).toBeNull()
  })
})
