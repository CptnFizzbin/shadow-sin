import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { SpendKarmaDialogProvider } from "#/contexts/improvements/spendKarmaDialogContext.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementComplexFormList } from "./improvementComplexFormList.tsx"

function renderList(updateRunnerData?: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementComplexFormList />
    </SpendKarmaDialogProvider>,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory({ afterBuild: (sheet) => {
        updateRunnerData?.(sheet)
      } })),
    },
  )
}

describe("ImprovementComplexFormList", () => {
  it("shows the empty state when no complex forms are known and none are queued", () => {
    // Arrange
    renderList((sheet) => {
      sheet.complexForms = []
    })

    // Act — nothing

    // Assert
    expect(screen.getByText(/no complex forms known/i)).toBeTruthy()
  })

  it("lists known complex forms by name", () => {
    // Arrange
    renderList((sheet) => {
      sheet.complexForms = [{ kind: EntityKind.complexForm, id: "cf1", name: "Resonance Spike", rating: 2 }]
      sheet.attributes[AttributeKey.resonance] = 4
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Resonance Spike")).toBeTruthy()
  })

  it("clicking an affordable complex form row queues a rating raise", () => {
    // Arrange
    renderList((sheet) => {
      sheet.complexForms = [{ kind: EntityKind.complexForm, id: "cf1", name: "Resonance Spike", rating: 2 }]
      sheet.attributes[AttributeKey.resonance] = 4
      sheet.karma.current = 50
    })
    const formButton = screen.getByRole("button", { name: /resonance spike/i }) as HTMLButtonElement

    // Act
    fireEvent.click(formButton)

    // Assert
    expect(formButton.getAttribute("aria-pressed")).toBe("true")
  })

  it("shows a Max chip when a complex form's rating equals Resonance", () => {
    // Arrange
    renderList((sheet) => {
      sheet.complexForms = [{ kind: EntityKind.complexForm, id: "cf1", name: "Resonance Spike", rating: 3 }]
      sheet.attributes[AttributeKey.resonance] = 3
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Max")).toBeTruthy()
  })

  it("exposes a Learn New Complex Form button", () => {
    // Arrange
    renderList()

    // Act — nothing

    // Assert
    expect(screen.getByRole("button", { name: /learn new complex form/i })).toBeTruthy()
  })
})
