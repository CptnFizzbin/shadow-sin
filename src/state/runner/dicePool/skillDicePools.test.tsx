import { ThemeProvider } from "@mui/material/styles"
import { render, renderHook, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"
import { theme } from "#/theme.ts"

import { useActiveSkillDicePool } from "./skillDicePools.ts"

interface TestProvidersProps extends PropsWithChildren {
  runnerData: RunnerData
}

const TestProviders: FC<TestProvidersProps> = ({ runnerData, children }) => {
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  return (
    <ThemeProvider theme={theme}>
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    </ThemeProvider>
  )
}

const ActiveSkillDicePoolHarness: FC<{ skillKey: SkillKey }> = ({ skillKey }) => {
  const pool = useActiveSkillDicePool({ skillKey })
  return <DicePool pool={pool} />
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

  it("applies the wound modifier exactly once when the Runner is wounded", () => {
    // Arrange
    const makeRunnerData = (physicalDamage: number) => {
      const runnerData = runnerDataFactory()
      runnerData.skills.activeSkills = [{ name: SkillKey.dodge, rating: 3 }]
      runnerData.damage.physical = physicalDamage
      return runnerData
    }
    const renderPool = (runnerData: RunnerData) => renderHook(
      () => useActiveSkillDicePool({ skillKey: SkillKey.dodge }),
      { wrapper: ({ children }) => <TestProviders runnerData={runnerData}>{children}</TestProviders> },
    ).result.current

    // Act
    const unwoundedPool = renderPool(makeRunnerData(0))
    const woundedPool = renderPool(makeRunnerData(6))
    const view = renderWithRunner(
      <ActiveSkillDicePoolHarness skillKey={SkillKey.dodge} />,
      (sheet) => {
        sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 3 }]
        sheet.damage.physical = 6
      },
    )

    // Assert: 6 boxes of Physical damage is a -2 Wound Modifier, applied as one group that
    // shows twice in the rendered pool (chip + ledger line).
    expect(woundedPool.groups.filter((group) => group.name === "Wound")).toEqual([
      { name: "Wound", size: -2, type: "penalty" },
    ])
    expect(woundedPool.size).toBe(unwoundedPool.size - 2)
    expect(view.getAllByText("Wound")).toHaveLength(2)
  })
})
