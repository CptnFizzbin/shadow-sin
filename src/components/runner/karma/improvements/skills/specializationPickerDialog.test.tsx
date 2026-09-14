import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { useSpecializationPickerDialog } from "./specializationPickerDialog.tsx"

interface OpenButtonProps {
  skillLabel: string
  fieldLabel?: string
  fixedOptions?: readonly string[]
  initialValue?: string
  onResult: (value: string | undefined) => void
}

// Wrapper that exposes a button to trigger the dialog so we can test the result.
function OpenButton({
  skillLabel,
  fieldLabel,
  fixedOptions,
  initialValue,
  onResult,
}: OpenButtonProps) {
  const dialog = useSpecializationPickerDialog()
  return (
    <>
      <button
        type="button"
        onClick={async () => {
          const result = await dialog.open({ skillLabel, fieldLabel, fixedOptions, initialValue })
          onResult(result)
        }}
      >
        Open
      </button>
      {dialog.outlet}
    </>
  )
}

function renderDialogHarness(props: Omit<OpenButtonProps, "onResult">) {
  let result: string | undefined = "__unset__"
  const onResult = (v: string | undefined) => {
    result = v
  }

  renderWithProviders(<OpenButton {...props} onResult={onResult} />)

  return { getResult: () => result }
}

describe("SpecializationPickerDialog", () => {
  it("renders with the skill name in the title", async () => {
    // Arrange
    renderDialogHarness({ skillLabel: "Pistols", fixedOptions: ["Revolvers"] })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Open" }))

    // Assert
    await screen.findByText(/specialization\s*[—-]\s*Pistols/i)
  })

  it("uses a custom fieldLabel in the title (e.g. 'Lingo' for languages)", async () => {
    // Arrange
    renderDialogHarness({ skillLabel: "Sperethiel", fieldLabel: "Lingo" })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Open" }))

    // Assert
    await screen.findByText(/lingo\s*[—-]\s*Sperethiel/i)
  })

  it("disables Save until a specialization is chosen", async () => {
    // Arrange
    renderDialogHarness({ skillLabel: "Pistols", fixedOptions: ["Revolvers"] })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    await screen.findByText(/specialization\s*[—-]\s*Pistols/i)

    // Assert
    const saveButton = screen.getAllByRole("button", { name: /save/i }).at(-1)!
    expect((saveButton as HTMLButtonElement).disabled).toBe(true)
  })

  it("returns the initial value via Save when one is pre-filled", async () => {
    // Arrange
    const { getResult } = renderDialogHarness({
      skillLabel: "Pistols",
      fixedOptions: ["Revolvers"],
      initialValue: "Revolvers",
    })

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
    const { getResult } = renderDialogHarness({
      skillLabel: "Pistols",
      fixedOptions: ["Revolvers"],
      initialValue: "Revolvers",
    })

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

  it("shows a plain text input (no dropdown) when no fixedOptions are provided", async () => {
    // Arrange — mirrors how knowledge/language skills will use it
    renderDialogHarness({ skillLabel: "Ancient History" })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    await screen.findByText(/specialization\s*[—-]\s*Ancient History/i)

    // Assert — exactly one textbox, no combobox
    expect(screen.getAllByRole("textbox")).toHaveLength(1)
    expect(screen.queryByRole("combobox")).toBeNull()
  })
})
