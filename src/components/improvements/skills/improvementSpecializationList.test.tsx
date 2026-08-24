import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { SpendKarmaDialogProvider, useSpendKarmaDialogContext } from "#/contexts/improvements/spendKarmaDialogContext.tsx"
import type { LearnActiveSkillEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementSpecializationList } from "./improvementSpecializationList.tsx"

// Test-only harness: queues a "learn new active skill" entry directly on the
// store, bypassing the acquire-skill picker dialog, so tests can verify that
// a skill queued to be *learned* this downtime doesn't show up as
// specializable (it isn't on `sheet.skills.activeSkills` yet).
function QueueLearnActiveSkillButton({ skill }: { skill: SkillKey }) {
  const { improvementStore } = useSpendKarmaDialogContext()
  const handleClick = () => {
    const newEntry: Omit<LearnActiveSkillEntry, "id"> = {
      type: ImprovementType.learnActiveSkill,
      skill: { name: skill, rating: 1 },
    }
    improvementStore.add(newEntry)
  }
  return (
    <button type="button" onClick={handleClick}>
      Queue learn {skill}
    </button>
  )
}

function renderList(
  updateRunnerData?: (sheet: RunnerData) => void,
  options: { queueLearnSkill?: SkillKey } = {},
) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      {options.queueLearnSkill && <QueueLearnActiveSkillButton skill={options.queueLearnSkill} />}
      <ImprovementSpecializationList />
    </SpendKarmaDialogProvider>,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory({ afterBuild: (sheet) => {
        updateRunnerData?.(sheet)
      } })),
    },
  )
}

describe("ImprovementSpecializationList", () => {
  it("shows empty-state text for each category when the runner has none", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.activeSkills = []
      sheet.skills.skillGroups = []
      sheet.skills.knowledgeSkills = []
      sheet.skills.languageSkills = []
    })

    // Act — nothing

    // Assert
    expect(screen.getByText(/no active skills to specialize/i)).toBeTruthy()
    expect(screen.getByText(/no knowledge skills to specialize/i)).toBeTruthy()
    expect(screen.getByText(/no language skills to specialize/i)).toBeTruthy()
  })

  it("lists an existing active skill as specializable", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByRole("button", { name: /add specialization/i })).toBeTruthy()
    expect(screen.getByText("Pistols")).toBeTruthy()
  })

  it("shows a ⚠ warning for skills that belong to a still-unbroken group", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.activeSkills = []
      sheet.skills.skillGroups = [{ name: SkillGroupKey.Firearms, rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getAllByText("⚠").length).toBeGreaterThan(0)
  })

  it("does not list an active skill queued to be learned this downtime", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.activeSkills = []
      sheet.karma.current = 50
    }, { queueLearnSkill: SkillKey.pistols })

    // Act — queue "learn new" Pistols this session
    fireEvent.click(screen.getByRole("button", { name: /queue learn/i }))

    // Assert — Pistols is queued to learn, not yet on the sheet, so it isn't specializable
    expect(screen.queryByText("Pistols")).toBeNull()
    expect(screen.getByText(/no active skills to specialize/i)).toBeTruthy()
  })

  it("lists existing knowledge and language skills as specializable", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.knowledgeSkills = [{ name: "Ancient History", rating: 3 }]
      sheet.skills.languageSkills = [{ name: "Sperethiel", rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Ancient History")).toBeTruthy()
    expect(screen.getByText("Sperethiel")).toBeTruthy()
  })

  it("queuing a knowledge specialization shows the name as a chip and removes on toggle", async () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.knowledgeSkills = [{ name: "Ancient History", rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — open the picker, type a name, save
    fireEvent.click(screen.getByRole("button", { name: /add specialization/i }))
    await screen.findByText(/specialization\s*[—-]\s*Ancient History/i)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Rome" } })
    const saveButton = screen.getAllByRole("button", { name: /save/i }).at(-1)!
    fireEvent.click(saveButton)

    // Assert — queued name appears (both as the row's secondary text and the rename chip)
    await screen.findByRole("button", { name: /remove specialization/i })
    expect(screen.getAllByText("Rome").length).toBeGreaterThan(0)

    // Act — toggle off by clicking the row again
    fireEvent.click(screen.getByRole("button", { name: /remove specialization/i }))

    // Assert — name is gone
    expect(screen.queryByText("Rome")).toBeNull()
  })

  it("disables the row when the runner cannot afford the specialization cost", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.knowledgeSkills = [{ name: "Ancient History", rating: 3 }]
      sheet.karma.current = 1 // < 2k specialization cost
    })

    // Act — nothing

    // Assert
    const specButton = screen.getByRole("button", { name: /add specialization/i })
    expect(specButton.getAttribute("aria-disabled")).toBe("true")
  })
})
