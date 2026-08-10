import { ThemeProvider } from "@mui/material/styles"
import { render, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { theme } from "#/theme.ts"

import {
  MeleeDodgeDicePool,
  MeleeFullBlockDicePool,
  MeleeFullDodgeDicePool,
  MeleeFullParryDicePool,
  RangedFullDefenseDicePool,
} from "./resistanceDicePools.tsx"

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

describe("MeleeDodgeDicePool", () => {
  it("shows a single defaulting entry when dodge rating is 0", () => {
    // Arrange / Act
    const view = renderWithRunner(<MeleeDodgeDicePool />)

    // Assert: DicePool renders each penalty group twice — once as an
    // always-visible chip, once as its own line in the expanded ledger.
    expect(view.getAllByText("Defaulting")).toHaveLength(4)
    expect(view.getAllByText("-1")).toHaveLength(4)
  })

  it("shows no defaulting entry when dodge is trained", () => {
    // Arrange / Act
    const view = renderWithRunner(<MeleeDodgeDicePool />, (sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 3 }]
    })

    // Assert
    expect(view.queryByText("Defaulting")).toBeNull()
  })
})

describe("MeleeFullDodgeDicePool", () => {
  it("shows a single defaulting entry when dodge rating is 0, even though dodge is used twice", () => {
    // Arrange / Act
    const view = renderWithRunner(<MeleeFullDodgeDicePool />)

    // Assert: one defaulting group, shown twice (chip + ledger line).
    expect(view.getAllByText("Defaulting")).toHaveLength(4)
    expect(view.getAllByText("-1")).toHaveLength(4)
  })

  it("shows no defaulting entry when dodge is trained", () => {
    // Arrange / Act
    const view = renderWithRunner(<MeleeFullDodgeDicePool />, (sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 4 }]
    })

    // Assert
    expect(view.queryByText("Defaulting")).toBeNull()
  })
})

describe("RangedFullDefenseDicePool", () => {
  it("shows a single defaulting entry when dodge rating is 0", () => {
    // Arrange / Act
    const view = renderWithRunner(<RangedFullDefenseDicePool />)

    // Assert: one defaulting group, shown twice (chip + ledger line).
    expect(view.getAllByText("Defaulting")).toHaveLength(4)
  })

  it("shows no defaulting entry when dodge is trained", () => {
    // Arrange / Act
    const view = renderWithRunner(<RangedFullDefenseDicePool />, (sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 2 }]
    })

    // Assert
    expect(view.queryByText("Defaulting")).toBeNull()
  })
})

describe("MeleeFullParryDicePool", () => {
  it("shows two defaulting entries when both weapon skill and dodge are untrained", () => {
    // Arrange / Act
    const view = renderWithRunner(<MeleeFullParryDicePool weaponSkill={SkillKey.blades} />)

    // Assert: two defaulting groups (weapon skill + dodge), each shown twice
    // (chip + ledger line).
    expect(view.getAllByText("Defaulting")).toHaveLength(4)
  })

  it("shows one defaulting entry when only dodge is untrained", () => {
    // Arrange / Act
    const view = renderWithRunner(
      <MeleeFullParryDicePool weaponSkill={SkillKey.blades} />,
      (sheet) => {
        sheet.skills.activeSkills = [{ name: SkillKey.blades, rating: 3 }]
      },
    )

    // Assert: one defaulting group, shown twice (chip + ledger line).
    expect(view.getAllByText("Defaulting")).toHaveLength(2)
  })

  it("shows no defaulting entries when both weapon skill and dodge are trained", () => {
    // Arrange / Act
    const view = renderWithRunner(
      <MeleeFullParryDicePool weaponSkill={SkillKey.blades} />,
      (sheet) => {
        sheet.skills.activeSkills = [
          { name: SkillKey.blades, rating: 3 },
          { name: SkillKey.dodge, rating: 2 },
        ]
      },
    )

    // Assert
    expect(view.queryByText("Defaulting")).toBeNull()
  })
})

describe("MeleeFullBlockDicePool", () => {
  it("shows two defaulting entries when both unarmed combat and dodge are untrained", () => {
    // Arrange / Act
    const view = renderWithRunner(<MeleeFullBlockDicePool />)

    // Assert: two defaulting groups (unarmed combat + dodge), each shown
    // twice (chip + ledger line).
    expect(view.getAllByText("Defaulting")).toHaveLength(4)
  })

  it("shows no defaulting entries when both skills are trained", () => {
    // Arrange / Act
    const view = renderWithRunner(<MeleeFullBlockDicePool />, (sheet) => {
      sheet.skills.activeSkills = [
        { name: SkillKey.unarmedCombat, rating: 2 },
        { name: SkillKey.dodge, rating: 2 },
      ]
    })

    // Assert
    expect(view.queryByText("Defaulting")).toBeNull()
  })
})
