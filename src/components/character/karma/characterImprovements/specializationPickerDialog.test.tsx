import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogApi } from "#/components/dialogs/api/dialogApi.tsx"
import { DialogApiProvider } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { useSpecializationPickerDialog } from "./specializationPickerDialog.tsx"

// Wrapper that exposes a button to trigger the dialog so we can test the result.
function OpenButton({
  skill,
  initialValue,
  onResult,
}: {
  skill: SkillKey
  initialValue?: string
  onResult: (value: string | undefined) => void
}) {
  const dialog = useSpecializationPickerDialog()
  return (
    <button
      type="button"
      onClick={async () => {
        const result = await dialog.open({ skill, initialValue })
        onResult(result)
      }}
    >
      Open
    </button>
  )
}

function renderDialogHarness(skill: SkillKey, initialValue?: string) {
  const dialogApi = new DialogApi()
  let result: string | undefined = "__unset__"
  const onResult = (v: string | undefined) => {
    result = v
  }

  renderWithProviders(
    <DialogApiProvider dialogApi={dialogApi}>
      <OpenButton skill={skill} initialValue={initialValue} onResult={onResult} />
    </DialogApiProvider>,
  )

  return { getResult: () => result }
}

describe("SpecializationPickerDialog", () => {
  it("renders with the skill name in the title", async () => {
    // Arrange
    renderDialogHarness(SkillKey.pistols)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Open" }))

    // Assert
    await screen.findByText(/specialization\s*[—-]\s*Pistols/i)
  })

  it("disables Save until a specialization is chosen", async () => {
    // Arrange
    renderDialogHarness(SkillKey.pistols)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    await screen.findByText(/specialization\s*[—-]\s*Pistols/i)

    // Assert — Save is disabled with no selection
    const saveButton = screen.getAllByRole("button", { name: /save/i }).at(-1)!
    expect((saveButton as HTMLButtonElement).disabled).toBe(true)
  })

  it("returns the initial value via Save when one is pre-filled", async () => {
    // Arrange
    const { getResult } = renderDialogHarness(SkillKey.pistols, "Revolvers")

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    await screen.findByText(/specialization\s*[—-]\s*Pistols/i)
    const saveButton = screen.getAllByRole("button", { name: /save/i }).at(-1)!
    fireEvent.click(saveButton)

    // Assert
    await waitFor(() => {
      expect(getResult()).toBe("Revolvers")
    })
  })

  it("returns undefined when Cancel is clicked", async () => {
    // Arrange
    const { getResult } = renderDialogHarness(SkillKey.pistols, "Revolvers")

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    await screen.findByText(/specialization\s*[—-]\s*Pistols/i)
    const cancelButtons = screen.getAllByRole("button", { name: /cancel/i })
    fireEvent.click(cancelButtons[cancelButtons.length - 1])

    // Assert
    await waitFor(() => {
      expect(getResult()).toBeUndefined()
    })
  })
})
