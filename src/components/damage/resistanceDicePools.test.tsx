import { ThemeProvider } from "@mui/material/styles"
import { render, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { CharacterSheetProvider } from "#/components/character/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import {
  MeleeDodgeDicePool,
  MeleeFullBlockDicePool,
  MeleeFullDodgeDicePool,
  MeleeFullParryDicePool,
  RangedFullDefenseDicePool,
} from "#/components/damage/resistanceDicePools.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import { SkillKey } from "#/lib/system/skills/skillKey.ts"
import { theme } from "#/theme.ts"

interface TestProvidersProps extends PropsWithChildren {
  characterSheet: CharacterSheet
}

const TestProviders: FC<TestProvidersProps> = ({ characterSheet, children }) => {
  const store = new CharacterSheetStore(characterSheet)

  return (
    <ThemeProvider theme={theme}>
      <CharacterSheetProvider store={store}>{children}</CharacterSheetProvider>
    </ThemeProvider>
  )
}

function renderWithCharacter(
  element: ReactElement,
  updateCharacterSheet?: (characterSheet: CharacterSheet) => void,
) {
  const characterSheet = createDefaultCharacterSheet()
  updateCharacterSheet?.(characterSheet)

  const { container } = render(element, {
    wrapper: ({ children }) => (
      <TestProviders characterSheet={characterSheet}>{children}</TestProviders>
    ),
  })

  return within(container)
}

describe("MeleeDodgeDicePool", () => {
  it("shows a single defaulting entry when dodge rating is 0", () => {
    // Arrange / Act
    const view = renderWithCharacter(<MeleeDodgeDicePool />)

    // Assert
    expect(view.getAllByText("Defaulting")).toHaveLength(1)
    expect(view.getAllByText("-1")).toHaveLength(1)
  })

  it("shows no defaulting entry when dodge is trained", () => {
    // Arrange / Act
    const view = renderWithCharacter(<MeleeDodgeDicePool />, (sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 3 }]
    })

    // Assert
    expect(view.queryByText("Defaulting")).toBeNull()
  })
})

describe("MeleeFullDodgeDicePool", () => {
  it("shows a single defaulting entry when dodge rating is 0, even though dodge is used twice", () => {
    // Arrange / Act
    const view = renderWithCharacter(<MeleeFullDodgeDicePool />)

    // Assert
    expect(view.getAllByText("Defaulting")).toHaveLength(1)
    expect(view.getAllByText("-1")).toHaveLength(1)
  })

  it("shows no defaulting entry when dodge is trained", () => {
    // Arrange / Act
    const view = renderWithCharacter(<MeleeFullDodgeDicePool />, (sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 4 }]
    })

    // Assert
    expect(view.queryByText("Defaulting")).toBeNull()
  })
})

describe("RangedFullDefenseDicePool", () => {
  it("shows a single defaulting entry when dodge rating is 0", () => {
    // Arrange / Act
    const view = renderWithCharacter(<RangedFullDefenseDicePool />)

    // Assert
    expect(view.getAllByText("Defaulting")).toHaveLength(1)
  })

  it("shows no defaulting entry when dodge is trained", () => {
    // Arrange / Act
    const view = renderWithCharacter(<RangedFullDefenseDicePool />, (sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 2 }]
    })

    // Assert
    expect(view.queryByText("Defaulting")).toBeNull()
  })
})

describe("MeleeFullParryDicePool", () => {
  it("shows two defaulting entries when both weapon skill and dodge are untrained", () => {
    // Arrange / Act
    const view = renderWithCharacter(<MeleeFullParryDicePool weaponSkill={SkillKey.blades} />)

    // Assert
    expect(view.getAllByText("Defaulting")).toHaveLength(2)
  })

  it("shows one defaulting entry when only dodge is untrained", () => {
    // Arrange / Act
    const view = renderWithCharacter(
      <MeleeFullParryDicePool weaponSkill={SkillKey.blades} />,
      (sheet) => {
        sheet.skills.activeSkills = [{ name: SkillKey.blades, rating: 3 }]
      },
    )

    // Assert
    expect(view.getAllByText("Defaulting")).toHaveLength(1)
  })

  it("shows no defaulting entries when both weapon skill and dodge are trained", () => {
    // Arrange / Act
    const view = renderWithCharacter(
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
    const view = renderWithCharacter(<MeleeFullBlockDicePool />)

    // Assert
    expect(view.getAllByText("Defaulting")).toHaveLength(2)
  })

  it("shows no defaulting entries when both skills are trained", () => {
    // Arrange / Act
    const view = renderWithCharacter(<MeleeFullBlockDicePool />, (sheet) => {
      sheet.skills.activeSkills = [
        { name: SkillKey.unarmedCombat, rating: 2 },
        { name: SkillKey.dodge, rating: 2 },
      ]
    })

    // Assert
    expect(view.queryByText("Defaulting")).toBeNull()
  })
})

