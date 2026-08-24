import { ThemeProvider } from "@mui/material/styles"
import { render, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { theme } from "#/theme.ts"

import { useActiveSkillDicePool } from "./skillDicePools.ts"

interface TestProvidersProps extends PropsWithChildren {
  runnerData: RunnerData
}

const TestProviders: FC<TestProvidersProps> = ({ runnerData, children }) => {
  const store = new RunnerDataStore(runnerData)

  return (
    <ThemeProvider theme={theme}>
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    </ThemeProvider>
  )
}

const ActiveSkillDicePoolHarness: FC<{ skillKey: SkillKey }> = ({ skillKey }) => {
  const pool = useActiveSkillDicePool({ skillKey })
  return <DicePool {...pool} />
}

function renderWithRunner(
  element: ReactElement,
  updateRunnerData?: (runnerData: RunnerData) => void,
) {
  const runnerData = runnerDataFactory()
  updateRunnerData?.(runnerData)

  const { container } = render(element, {
    wrapper: ({ children }) => (
      <TestProviders runnerData={runnerData}>{children}</TestProviders>
    ),
  })

  return within(container)
}

describe("useActiveSkillDicePool", () => {
  it("shows a single defaulting entry when the skill is untrained", () => {
    // Arrange / Act
    const view = renderWithRunner(<ActiveSkillDicePoolHarness skillKey={SkillKey.dodge} />)

    // Assert: one "Dodge - Defaulting" group, shown twice (chip + ledger line) —
    // not doubled up with a second generic "Defaulting" penalty.
    expect(view.getAllByText(/Defaulting/)).toHaveLength(2)
    expect(view.getAllByText("-1")).toHaveLength(2)
  })

  it("shows no defaulting entry when the skill is trained", () => {
    // Arrange / Act
    const view = renderWithRunner(
      <ActiveSkillDicePoolHarness skillKey={SkillKey.dodge} />,
      (sheet) => {
        sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 3 }]
      },
    )

    // Assert
    expect(view.queryByText(/Defaulting/)).toBeNull()
  })
})
