import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC } from "react"
import { useState } from "react"
import { describe, expect, it } from "vitest"

import type { Duration } from "#/utils/duration/duration.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { DurationInput } from "./durationInput.tsx"

// ── Test helpers ──────────────────────────────────────────────────────────────

const ControlledDurationField: FC<{ initial?: Duration }> = ({ initial }) => {
  const [value, setValue] = useState(initial)
  return <DurationInput label="Duration" value={value} onChange={setValue} />
}

function renderField(initial?: Duration) {
  render(<ControlledDurationField initial={initial} />, { wrapper: ThemeWrapper })
  return screen.getByRole("combobox")
}

function openMenu(combobox: HTMLElement) {
  fireEvent.mouseDown(combobox)
}

function getLastDialog() {
  const dialogs = screen.getAllByRole("dialog")
  return dialogs[dialogs.length - 1]
}

/** Clicks the increment ("+") button on the counter row labelled `unitLabel` inside the custom duration dialog. */
function incrementUnit(dialog: HTMLElement, unitLabel: string) {
  const row = within(dialog).getByText(unitLabel).parentElement!
  const [, incrementButton] = within(row).getAllByRole("button")
  fireEvent.click(incrementButton)
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("DurationField", () => {
  it("lists every standard duration plus a Custom option", () => {
    // Arrange
    const combobox = renderField()

    // Act
    openMenu(combobox)

    // Assert
    expect(screen.getByRole("option", { name: "1 initiative pass" })).toBeDefined()
    expect(screen.getByRole("option", { name: "1 combat round" })).toBeDefined()
    expect(screen.getByRole("option", { name: "1 minute" })).toBeDefined()
    expect(screen.getByRole("option", { name: "1 hour" })).toBeDefined()
    expect(screen.getByRole("option", { name: "1 day" })).toBeDefined()
    expect(screen.getByRole("option", { name: "1 week" })).toBeDefined()
    expect(screen.getByRole("option", { name: "1 month" })).toBeDefined()
    expect(screen.getByRole("option", { name: "Custom…" })).toBeDefined()
  })

  it("selecting a standard option reports its Duration", () => {
    // Arrange
    const combobox = renderField()

    // Act
    openMenu(combobox)
    fireEvent.click(screen.getByRole("option", { name: "1 hour" }))

    // Assert
    expect(combobox.textContent).toContain("1 hour")
  })

  it("opens the custom duration dialog when Custom… is picked, and applies the entered value on Save", async () => {
    // Arrange
    const combobox = renderField()

    // Act
    openMenu(combobox)
    fireEvent.click(screen.getByRole("option", { name: "Custom…" }))
    const dialog = getLastDialog()
    incrementUnit(dialog, "Hours")
    incrementUnit(dialog, "Hours")
    incrementUnit(dialog, "Minutes")
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }))

    // Assert
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(combobox.textContent).toContain("2 hours")
    expect(combobox.textContent).toContain("1 minute")
  })

  it("cancelling the custom duration dialog leaves the previous value unchanged", async () => {
    // Arrange — a Duration that isn't one of the standard options renders as already "Custom",
    // so re-opening the dialog goes through the edit button rather than re-picking the menu item
    // (MUI's Select only fires onChange when the selected value actually changes).
    const combobox = renderField({ hours: 2 })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Edit custom duration" }))
    const dialog = getLastDialog()
    incrementUnit(dialog, "Days")
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }))

    // Assert
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(combobox.textContent).toContain("2 hours")
  })

  it("opens pre-filled with the current value via the edit button when a non-standard Duration is already selected", () => {
    // Arrange
    renderField({ hours: 2 })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Edit custom duration" }))
    const dialog = getLastDialog()

    // Assert
    const row = within(dialog).getByText("Hours").parentElement!
    expect(within(row).getByDisplayValue("2")).toBeDefined()
  })
})
